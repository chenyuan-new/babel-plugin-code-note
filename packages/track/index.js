import { transformFromAstSync } from "@babel/core";
import { parse } from "@babel/parser";
import autoTrackPlugin from "./plugin/index.js";
import { getSourceCode, get__dirname } from "../utils/getSourceCode.js";

const sourceCode = getSourceCode(
  "./sourceCode.js",
  get__dirname(import.meta.url)
);
const ast = parse(sourceCode, {
  sourceType: "module",
});

const { code } = transformFromAstSync(ast, sourceCode, {
  plugins: [
    [
      autoTrackPlugin,
      {
        trackerPath: "tracker",
      },
    ],
  ],
});

console.log(code);
