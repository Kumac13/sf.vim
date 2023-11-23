import { ensureDir, exists } from './deps.ts';

const configDir = `${Deno.env.get("HOME")}/.sf.vim`;
const configFile = `${configDir}/config.json`;

async function loadConfig(): JSON {
  await ensureConfigFile();
  try {
    const text = await Deno.readTextFile(configFile);
    const json = JSON.parse(text);
    return json;
  } catch (error) {
    console.error("Faild to load config: ", error);
    return {};
  }
}

async function saveConfig(config: Record<string, any>) {
  await ensureConfigFile();
  await Deno.writeTextFile(configFile, config);
}

async function ensureConfigFile() {
  await ensureDir(configDir);
  const file_exists = await exists(configFile);
  if (file_exists) {
    return;
  }
  await Deno.writeTextFile(configFile, "");
}

export { loadConfig, saveConfig };
