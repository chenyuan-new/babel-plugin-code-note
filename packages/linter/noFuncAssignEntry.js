const { transformFromAstSync } = require("@babel/core");
const parser = require("@babel/parser");
const noFuncAssignLintPlugin = require("./plugin/noFuncAssign");

const sourceCode = `
    function foo() {
        foo = bar;
    }

    var a = function hello() {
    hello = 123;
    };
`;

const ast = parser.parse(sourceCode, {
  sourceType: "unambiguous",
});

const { code } = transformFromAstSync(ast, sourceCode, {
  plugins: [noFuncAssignLintPlugin],
  filename: "input.js",
});

// 有error在plugin运行中展示出来，但是不影响最后的code生成
console.log(code);
/** 
function foo() {
  foo = bar;
}
var a = function hello() {
  hello = 123;
};
 
 * 
*/
