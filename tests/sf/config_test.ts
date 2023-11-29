import {
  assertEquals,
  assertThrows,
  stub,
  loadConfig,
  saveConfig,
} from "./deps_test.ts";

Deno.test("loadConfig shoud return the configuration object", async () => {
  const readTextFileStub = stub(Deno, "readTextFile", () =>
    Promise.resolve('{"key": "value"}')
  );
  const mockConfigPath = "path/to/config";

  try {
    const config = await loadConfig(mockConfigPath);
    assertEquals(config, { key: "value" });
  } finally {
    readTextFileStub.restore();
  }
});

Deno.test("loadConfig shoud handle errors", async () => {
  const readTextFileStub = stub(Deno, "readTextFile", () =>
    Promise.reject(new Error("Faild to load config: there is no such file"))
  );
  const mockConfigPath = "path/to/config";

  try {
    const config = await loadConfig(mockConfigPath);
    assertEquals(config, {});
  } finally {
    readTextFileStub.restore();
  }
});

Deno.test("saveConfig should save the config", async () => {
  const writeTextFileStub = stub(Deno, "writeTextFile", () =>
    Promise.resolve()
  );

  const testConfig = { key: "value" };

  try {
    await saveConfig(testConfig);
    assertEquals(writeTextFileStub.calls.length, 1);
    assertEquals(
      writeTextFileStub.calls[0].args[1],
      JSON.stringify(testConfig)
    );
  } finally {
    writeTextFileStub.restore();
  }
});
