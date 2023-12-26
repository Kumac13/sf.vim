import { assertEquals, SfClient, stub } from "./deps_test.ts";

Deno.test("init should load config file", async () => {
  const readTextFileStub = stub(Deno, "readTextFile", () =>
    Promise.resolve(
      '{"orgs": [ {"user_name": "prod@example.com", "isSandbox": false, "instanceUrl": "https://hoge.my.salesforce.com", "alias": "prod"}, {"user_name": "prod@example.com.sandbox", "isSandbox": true, "instanceUrl": "https://hoge--sandbox.sandbox.mysalesforce.com", "alias": "sandbox"}]}'
    )
  );
  const sfClient = new SfClient();
  const checkSfAvailableStub = stub(
    sfClient,
    "checkSfAvailable",
    async () => {}
  );

  try {
    await sfClient.init();

    const orgs = sfClient.orgs;
    assertEquals(orgs[0].user_name, "prod@example.com");
    assertEquals(orgs[0].isSandbox, false);
    assertEquals(orgs[0].instanceUrl, "https://hoge.my.salesforce.com");
    assertEquals(orgs[0].alias, "prod");
    assertEquals(orgs[1].user_name, "prod@example.com.sandbox");
    assertEquals(orgs[1].isSandbox, true);
    assertEquals(
      orgs[1].instanceUrl,
      "https://hoge--sandbox.sandbox.mysalesforce.com"
    );
    assertEquals(orgs[1].alias, "sandbox");
  } finally {
    readTextFileStub.restore();
    checkSfAvailableStub.restore();
  }
});

Deno.test("init fail when sf command is not available", async () => {
  const errorMessage =
    "sf command is not avalable. please install before use this plugin";
  const sfClient = new SfClient();
  const checkSfAvailableStub = stub(sfClient, "checkSfAvailable", async () => {
    throw new Error(errorMessage);
  });

  try {
    await sfClient.init();
  } catch (error) {
    assertEquals(error.message, errorMessage);
  } finally {
    checkSfAvailableStub.restore();
  }
});
