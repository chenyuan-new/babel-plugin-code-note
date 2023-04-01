const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;
const types = require("@babel/types");

const src = `
console.log(1);
function func() {
    console.info(2);
}
export default class Clazz {
    say() {
        console.debug(3);
    }
    render() {
        return <div>{console.error(4)}</div>
    }
}
`;

const ast = parser.parse(src, {
  sourceType: "unambiguous",
  plugins: ["jsx"],
});

const targetCalleeNames = ["log", "info", "error", "debug"].map(
  (item) => `console.${item}`
);

traverse(ast, {
  CallExpression(path, state) {
    const calleeName = path.get("callee").toString();
    if (targetCalleeNames.includes(calleeName)) {
      const { line, column } = path.node.loc.start;
      path.node.arguments.unshift(
        types.stringLiteral(`filename:(${line} ${column})`)
      );
    }
  },
});

const { code, map } = generate(ast);

console.log(code, map);
