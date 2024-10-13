import { afterEach, describe, expect, it, mock } from "bun:test";
import expected from "../test/example.expected.json";
import { createMockKV } from "../test/helper";
import { type CacheMetadata, CacheMetadataRepository } from "./cache-metadata";

const kv = createMockKV();

afterEach(() => mock.restore());

describe(CacheMetadataRepository.name, () => {
  it("should produce correct hex-encoded SHA1", async () => {
    const hash = "a198c75614a20a795bcb5fb15d84896aa06ea041";
    const repo = new CacheMetadataRepository(kv);
    const result = {
      etag: hash,
      expireAt: 100,
      maxAgeMs: 200,
    } satisfies CacheMetadata;

    await expect(
      repo.cache(JSON.stringify(expected), result.expireAt, result.maxAgeMs),
    ).resolves.toEqual(result);
    expect(kv.set).toHaveBeenLastCalledWith(hash, result);
  });

  it("should return the first metadata it got", async () => {
    const repo = new CacheMetadataRepository(kv);
    const mockResult = [
      undefined,
      undefined,
      { etag: "a", expireAt: 100, maxAgeMs: 200 },
      undefined,
      { etag: "b", expireAt: 200, maxAgeMs: 300 },
    ] satisfies (CacheMetadata | undefined)[];
    kv.bulkGet.mockResolvedValueOnce(mockResult);

    const keys = ["a", "b", "c", "d", "e"];
    await expect(repo.get(keys)).resolves.toBe(mockResult[2]);
    expect(kv.bulkGet).toHaveBeenLastCalledWith(keys);
  });

  it("should return undefined for no metadata", async () => {
    const repo = new CacheMetadataRepository(kv);
    kv.bulkGet.mockResolvedValueOnce([null, null, null]);

    await expect(repo.get(["a", "b", "c"])).resolves.toBe(undefined);
    expect(kv.bulkGet).toHaveBeenLastCalledWith(["a", "b", "c"]);
  });
});
