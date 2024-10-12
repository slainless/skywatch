import { afterEach, describe, expect, it, mock } from "bun:test";
import { CacheMetadataRepository, type CacheMetadata } from "./cache-metadata";
import { createMockKV } from "../test/helper";
import expected from "../test/example.expected.json";

const kv = createMockKV();

afterEach(() => mock.restore());

describe(CacheMetadataRepository.name, () => {
	it("should produce correct hex-encoded SHA1", async () => {
		const hash = "4f888672fae84dd76a8c59a733e6638ff9f95610";
		const repo = new CacheMetadataRepository(kv);
		const result = {
			etag: hash,
			expireAt: 100,
			maxAge: 200,
		} satisfies CacheMetadata;

		await expect(
			repo.cache(JSON.stringify(expected), result.expireAt, result.maxAge),
		).resolves.toEqual(result);
		expect(kv.set).toHaveBeenLastCalledWith(hash, result);
	});

	it("should return the first metadata it got", async () => {
		const repo = new CacheMetadataRepository(kv);
		const mockResult = [
			undefined,
			undefined,
			{ etag: "a", expireAt: 100, maxAge: 200 },
			undefined,
			{ etag: "b", expireAt: 200, maxAge: 300 },
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
