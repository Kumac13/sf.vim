import { Denops, ensureString, vars } from "./deps.ts";
import { SfClient } from "./sf_client.ts";

export async function main(denops: Denops): Promise<void> {
  denops.dispatcher = {
    async echo(text: unknown): Promise<unknown> {
      ensureString(text);
      return await Promise.resolve(text);
    },
  };

  await denops.cmd(
    `command! -nargs=1 HelloWorldEcho echomsg denops#request('${denops.name}', 'echo', [<q-args>])`,
  );
}
