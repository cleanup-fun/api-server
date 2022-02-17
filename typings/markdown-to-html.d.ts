// markdown-to-html.d.ts
// Type definitions for markdown-to-html

declare module "markdown-to-html" {
  import { Readable } from "stream";

  export class Markdown extends Readable {
    debug: boolean;
    bufmax: number;
    render(
      fileName: string,
      opts: Partial<{
        flavor: "gfm" | "markdown",
        highlight: boolean,
        stylesheet: string,
        context: string,
        title: string,
        template: string,
      }>,
      onDone?: (err: Error | string | void)=>any
    ): void;
  }

  export class GithubMarkdown {
    debug: boolean;
    bufmax: number;
    render(
      fileName: string,
      opts: Partial<{
        flavor: "gfm" | "markdown",
        context: string,
        stylesheet: string,
        username: string,
        title: string,
      }>,
      onDone?: (err: Error | string | void)=>any
    ): void;
  }
}
