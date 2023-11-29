import { ensureDir, exists } from "./deps.ts";

const configDir = `${Deno.env.get("HOME")}/.sf.vim`;
const configFile = `${configDir}/config.json`;

async function loadConfig(
  configFilePath: string = getConfigFilePath(),
): Promise<Record<string, any>> {
  await ensureConfigFile();
  try {
    const text = await Deno.readTextFile(configFilePath);
    const json = JSON.parse(text);
    return json;
  } catch (error) {
    console.error("Faild to load config: ", error);
    return {};
  }
}

async function saveConfig(config: Record<string, any>) {
  await ensureConfigFile();
  try {
    const configText = JSON.stringify(config);
    await Deno.writeTextFile(configFile, configText);
  } catch (error) {
    console.error("Failed to write config: ", error);
    return {};
  }
}

async function ensureConfigFile(configDir: string = getConfigDirectory()) {
  await ensureDir(configDir);
  const file_exists = await exists(getConfigFilePath());
  if (file_exists) {
    return;
  }
  await Deno.writeTextFile(configFile, "");
}

function getConfigFilePath(): string {
  return `${getConfigDirectory()}/config.json`;
}

function getConfigDirectory(): string {
  return `${Deno.env.get("HOME")}/.sf.vim`;
}

export { loadConfig, saveConfig };
