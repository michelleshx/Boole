/* For local development purposes only. */

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    ["^/files/", "^/verify$"],
    createProxyMiddleware({
      target: "https://student.cs.uwaterloo.ca/~se212/",
      changeOrigin: true,
      pathRewrite: {
        "^/files/": "/",
        "^/verify$": "/george/ask-george/cgi-bin/george.cgi/check",
      },
    })
  );
};
