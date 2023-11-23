import { loadConfig, saveConfig } from "./config.ts";

interface Alias {
  name: string;
  environment: Environment;
}

enum Environment {
  production = "production",
  sandbox = "sandbox",
}

class SfClient {
  orgs: Alias[];
  current_connection: string;

  constructor() {
    this.orgs = [];
    this.current_connection = "";
  }

  async init(): Promise<void> {
    const config = await loadConfig();
    this.orgs = config.orgs.map((org: any) => ({
      name: org.name,
      environment: Environment[org.environment as keyof typeof Environment]
    }));
    this.current_connection = config.current_connection;
  }
}

export { SfClient };

(async () => {
  const sfClient = new SfClient();
  await sfClient.init();

  console.log(sfClient);
})();
