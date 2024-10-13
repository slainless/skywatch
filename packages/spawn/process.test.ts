import { describe, expect, it } from "bun:test";
import { AbortError, createProcess } from "./process.js";

const basePath = import.meta.url;

describe(createProcess.name, () => {
  it("Should reject when returning early", async () => {
    try {
      const process = await createProcess(
        `bun ${Bun.fileURLToPath(new URL("test/hello.sh", basePath))}`,
        (line) => {
          return false;
        },
      );
      expect().fail("function should throw");
    } catch (e) {
      expect(e).toBeInstanceOf(AbortError);
      if (e instanceof AbortError === false)
        return expect().fail(`Not ${AbortError.name}`);
      expect(e.reason).toBe("Spawned process exiting early with code: 0");
    }
  });

  it("Should reject early when path not found", async () => {
    try {
      const process = await createProcess("missingno", (line) => {
        return false;
      });
      expect().fail("function should throw");
    } catch (e) {
      expect(e).toBeInstanceOf(TypeError);
      if (e instanceof TypeError === false)
        return expect().fail(`Not ${TypeError.name}`);
      expect(e.message).toContain("Executable not found");
    }
  });

  it("Should resolve to Subprocess when passing ready check", async () => {
    const lineSequences = [
      "Hello, World!",
      "This is a simulated standard output",
      "Service is ready! Listening at 0.0.0.0:8323",
      ">",
    ][Symbol.iterator]();

    try {
      const process = await createProcess(
        `bun ${Bun.fileURLToPath(new URL("test/sleep.sh", basePath))}`,
        (lines) => {
          for (const line of lines.trim().split("\n"))
            expect(line).toBe(lineSequences.next().value as string);

          return lines.indexOf("Service is ready!") !== -1;
        },
      );
      expect(process.killed).toBe(false);
    } catch (e) {
      console.error(e);
      expect().fail();
    }
  });

  it("Should not resolve to Subprocess when not passing ready check", async () => {
    const lineSequences = [
      "Hello, World!",
      "This is a simulated standard output",
      "Service is ready! Listening at 0.0.0.0:8323",
      ">",
      "Stopped!",
    ][Symbol.iterator]();

    try {
      const process = await createProcess(
        `bun ${Bun.fileURLToPath(new URL("test/sleep.sh", basePath))}`,
        (lines) => {
          for (const line of lines.trim().split("\n"))
            expect(line).toBe(lineSequences.next().value as string);

          return lines.indexOf("Service is WHAT") !== -1;
        },
      );
      expect().fail();
    } catch (e) {
      expect(e).toBeInstanceOf(AbortError);
      if (e instanceof AbortError === false)
        return expect().fail(`Not ${AbortError.name}`);
      expect(e.message).toContain("Spawned process exiting early");
    }
  });

  it("Should not lock reader when resolved", async () => {
    const lineSequences = [
      "Hello, World!",
      "This is a simulated standard output",
      "Service is ready! Listening at 0.0.0.0:8323",
      ">",
    ][Symbol.iterator]();

    try {
      const process = await createProcess(
        `bun ${Bun.fileURLToPath(new URL("test/sleep.sh", basePath))}`,
        (lines) => {
          for (const line of lines.trim().split("\n"))
            expect(line).toBe(lineSequences.next().value as string);

          return lines.indexOf("Service is ready!") !== -1;
        },
      );
      expect(process.killed).toBe(false);
      const reader = process.stdout.getReader();
      expect(reader).toBeInstanceOf(ReadableStreamDefaultReader);
    } catch (e) {
      console.error(e);
      expect().fail();
    }
  });
});
