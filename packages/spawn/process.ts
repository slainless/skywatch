import type { ReadableSubprocess, SpawnOptions, Subprocess } from "bun";

export class AbortError extends Error {
  constructor(
    public cmd: string,
    public reason?: string,
    public proc?: Subprocess,
  ) {
    super(
      `Process from command (${cmd}) with PID ${proc?.pid ?? "-1"} is aborted. Reason:\n${reason ?? "None"}`,
    );
  }
}

export interface CreateProcessOptions
  extends Omit<
    SpawnOptions.OptionsObject,
    "stdout" | "stderr" | "stdio" | "onExit"
  > {
  signal?: AbortSignal;
}
export function createProcess<Opts extends CreateProcessOptions>(
  cmd: string,
  readyCheck: (line: string) => boolean,
  opts?: Opts,
): Promise<ReadableSubprocess> {
  const { signal, ...rest } = opts ?? {};
  return new Promise<ReadableSubprocess>((res, rej) => {
    if (opts?.signal?.aborted)
      return rej(new AbortError(cmd, "Early signal abort"));

    const proc = Bun.spawn({
      cmd: cmd.split(" "),
      stderr: "pipe",
      stdout: "pipe",
      ...rest,
    }) as ReadableSubprocess;

    let final = false;
    const abort = (reason: string) =>
      // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
      (final = true) && rej(new AbortError(cmd, reason, proc));
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    const resolve = (obj: any) => (final = true) && res(obj);

    proc.exited.then((code) => {
      abort(`Spawned process exiting early with code: ${code}`);
    });

    const readLine = (reader: ReadableStreamDefaultReader) => {
      if (final) return;

      if (signal?.aborted) {
        proc.kill();
        return abort("Abort mid line reading");
      }

      if (proc.killed)
        return abort(
          "Spawned process exiting early while trying to read stdout",
        );

      reader
        .read()
        .then((data) => {
          // NOTE: Since this rejects earliest, we are delegating the
          // closing of the process to onExit instead...
          // if (data.done) return abort("stdout is done/closed");
          if (data.done) return;

          if (readyCheck(Buffer.from(data.value).toString("utf8"))) {
            reader.releaseLock();
            return resolve(proc);
          }

          readLine(reader);
        })
        .catch((e) => {
          rej(e);
        });
    };

    readLine(proc.stdout.getReader());
    readLine(proc.stderr.getReader());
  });
}
