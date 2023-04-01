import { declare } from "@babel/helper-plugin-utils";
import importModule from "@babel/helper-module-imports";

const autoTrackPlugin = declare((api, options, dirname) => {
  api.assertVersion(7);

  return {
    visitor: {
      Program: {
        enter(path, state) {
          path.traverse({
            ImportDeclaration(curPath) {
              const requirePath = curPath.get("source").node.value;
              // 判断是否已经引入tracker模块
              if (requirePath === options.trackerPath) {
                // 获取tracker引入后的函数名，便于后续调用
                const specifierPath = curPath.get("specifiers")[0];
                // import UI from 'xxx-ui'
                if (specifierPath.ImportDefaultSpecifier()) {
                  state.trackerImportId = specifierPath.toString();
                  // import * as UI from 'xxx-ui'
                } else if (specifierPath.isImportNamespaceSpecifier()) {
                  state.trackerImportId = specifierPath.get("local").toString();
                }
                path.stop();
              }
            },
          });

          if (!state.trackerImportId) {
            // 用default的方式引入，并生成函数名
            state.trackerImportId = importModule.addDefault(path, "tracker", {
              nameHint: path.scope.generateUid("tracker"),
            }).name;
            state.trackerAST = api.template.statement(
              `${state.trackerImportId}()`
            )();
          }
        },
      },

      "ClassMethod|ArrowFunctionExpression|FunctionExpression|FunctionDeclaration"(
        path,
        state
      ) {
        const bodyPath = path.get("body");
        if (bodyPath.isBlockStatement()) {
          bodyPath.node.body.unshift(state.trackerAST);
        } else {
          const ast = api.template.statement(
            `{${state.trackerImportId}();return PREV_BODY;}`
          )({ PREV_BODY: bodyPath.node });
          bodyPath.replaceWith(ast);
        }
      },
    },
  };
});

export default autoTrackPlugin;
