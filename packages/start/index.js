import { transformFileSync } from "@babel/core";
import startPlugin from "./plugins/start/index.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

// 在esm中没有 __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { code } = transformFileSync(path.join(__dirname, "./sourceCode.js"), {
  plugins: [startPlugin],
  parserOpts: {
    sourceType: "unambiguous",
    plugins: ["jsx"],
  },
});

console.log(code);
