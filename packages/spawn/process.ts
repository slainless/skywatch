import type { SpawnOptions, Subprocess } from "bun";

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

type PipedStdout = { stdout: "pipe" };
export interface CreateProcessOptions
	extends Omit<SpawnOptions.OptionsObject, "stdout"> {
	signal?: AbortSignal;
}
export function createProcess<Opts extends CreateProcessOptions>(
	cmd: string,
	readyCheck: (line: string) => boolean,
	opts?: Opts,
): Promise<SpawnOptions.OptionsToSubprocess<Opts & PipedStdout>> {
	const { onExit, signal, ...rest } = opts ?? {};
	return new Promise<SpawnOptions.OptionsToSubprocess<Opts & PipedStdout>>(
		(res, rej) => {
			if (opts?.signal?.aborted)
				return rej(new AbortError(cmd, "Early signal abort"));

			const proc = Bun.spawn({
				cmd: cmd.split(" "),
				onExit(subprocess, exitCode, signalCode, error) {
					onExit?.(subprocess, exitCode, signalCode, error);
					if (error != null) return rej(error);
					rej(new AbortError(cmd, "Spawned process exiting early", proc));
				},
				...(rest as Opts & PipedStdout),
			});
			const abort = (reason: string) => rej(new AbortError(cmd, reason, proc));

			const reader = proc.stdout.getReader();
			const readLine = () => {
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
							return res(proc);
						}

						readLine();
					})
					.catch((e) => {
						rej(e);
					});
			};

			readLine();
		},
	);
}
