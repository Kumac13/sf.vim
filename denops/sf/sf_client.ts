import { loadConfig, saveConfig } from "./config.ts";

interface Org {
  user_name: string;
  isSandbox: boolean;
  instanceUrl: string;
  alias: string;
}

type SfCommandResultData = object | object[] | string;
interface SfCommandSuccess {
  status: number;
  result: SfCommandResultData;
  warning?: string;
}

interface SfCommandError {
  status: number;
  context: string;
  message: string;
}

type SfCommandResult = SfCommandSuccess | SfCommandError;

class SfClient {
  #orgs: Org[] = [];

  get orgs(): Org[] {
    return this.#orgs;
  }

  async init(): Promise<void> {
    await this.checkSfAvailable();
    const config = await loadConfig();
    this.#orgs = config.orgs.map((org: Org) => ({
      user_name: org.user_name,
      isSandbox: org.isSandbox,
      instanceUrl: org.instanceUrl,
      alias: org.alias,
    }));
  }

  async runSfCommand(commands: string[]): Promise<SfCommandResult> {
    const process = Deno.run({
      cmd: commands,
      stdout: "piped",
      stderr: "piped",
    });

    const output = await process.output();
    process.close();

    const text = new TextDecoder().decode(output);
    try {
      const json: SfCommandResult = JSON.parse(text);
      if (json.status !== 0) {
        if ("context" in json && "message" in json) {
          throw new Error(
            `Failed to execute sf command on ${json.context}: ${json.message}`
          );
        } else {
          throw new Error("Unknown error occurred");
        }
      }
      return json;
    } catch (error) {
      console.error("Failed to run command: ", error);
      throw error;
    }
  }

  private isOrgsSet(): boolean {
    return this.#orgs.length > 0;
  }

  private resetOrgs(): void {
    this.#orgs = [];
  }

  async checkSfAvailable(): Promise<void> {
    const process = Deno.run({
      cmd: ["sf", "--version"],
      stdout: "null",
      stderr: "null",
    });

    const status = await process.status();
    process.close();
    if (status.code !== 0) {
      throw new Error(
        "sf command is not avalable. please install before use this plugin"
      );
    }
    return;
  }
}

export { SfClient };

(async () => {
  const sfClient = new SfClient();
  await sfClient.setOrgs();
})();
