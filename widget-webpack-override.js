module.exports = function (webpackConfig) {
  const path = require("path");
  /**
   * If you need to change the widget webpack config, you can change the webpack config here and return the changed config.
   */
  Object.assign(webpackConfig.resolve.alias, {
    lodash: path.resolve(__dirname, "../your-extensions/node_plugin/node_modules/lodash"),
    "date-fns": path.resolve(__dirname, "../your-extensions/node_plugin/node_modules/date-fns"),
    axios: path.resolve(__dirname, "../your-extensions/node_plugin/node_modules/axios"),
    "@mui/material": path.resolve(__dirname, "../your-extensions/node_plugin/node_modules/@mui/material"),
    "@mui/icons-material": path.resolve(__dirname, "../your-extensions/node_plugin/node_modules/@mui/icons-material"),
    "@mui/x-date-pickers": path.resolve(__dirname, "../your-extensions/node_plugin/node_modules/@mui/x-date-pickers"),
    helper: path.resolve(__dirname, "../your-extensions/widgets/common/helper"),
    "material-react-table": path.resolve(__dirname, "../your-extensions/node_plugin/node_modules/material-react-table"),
    "react-hook-form": path.resolve(__dirname, "../your-extensions/node_plugin/node_modules/react-hook-form"),
    "styled-components": path.resolve(__dirname, "../your-extensions/node_plugin/node_modules/styled-components1"),
  });

  return webpackConfig;
};
