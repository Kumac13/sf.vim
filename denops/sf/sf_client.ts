import { loadConfig, saveConfig } from "./config.ts";

interface Org {
  user_name: string;
  isSandbox: boolean;
  instanceUrl: string;
  alias: string;
}

class SfClient {
  #orgs: Org[] = [];

  get orgs(): Org[] {
    return this.#orgs;
  }

  async init(): Promise<void> {
    const config = await loadConfig();
    this.#orgs = config.orgs.map((org: Org) => ({
      user_name: org.user_name,
      isSandbox: org.isSandbox,
      instanceUrl: org.instanceUrl,
      alias: org.alias
    }));
  }

  async setOrgs(): Promise<void> {
    if (await !this.isSfAvailable()) {
      return;
    }

    const result = await this.getOrgList();
    console.log(result.result);
  }

  async getOrgList(): Promise<any> {
    const process = Deno.run({
      cmd: ["sf", "auth", "list", "--json"],
      stdout: "piped",
      stderr: "piped",
    });

    const output = await process.output();
    process.close();

    const text = new TextDecoder().decode(output);
    try {
      return JSON.parse(text);
    } catch (error) {
      console.error("Failed to parse JSON: ", error);
      return null;
    }
  }

  private isOrgsSet(): boolean {
    return this.#orgs.length > 0;
  }

  private resetOrgs(): void {
    this.#orgs = [];
  }

  private async isSfAvailable(): Promise<boolean> {
    const process = Deno.run({
      cmd: ["sf", "--version"],
      stdout: "null",
      stderr: "null",
    });

    const status = await process.status();
    process.close();
    return status.code === 0;
  }
}

export { SfClient };

(async () => {
  const sfClient = new SfClient();
  await sfClient.setOrgs();
})();
