/* For local development purposes only. */
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware({
      target: "https://student.cs.uwaterloo.ca/~se212",
      changeOrigin: true,
      pathFilter: [
        "/files.json",
        "/george/ask-george/cgi-bin/george.cgi/check",
        "/files",
        "/assignments.json",
        "/assignments/",
        "/george/ask-george/cgi-bin/markus_get.cgi",
        "/george/ask-george/cgi-bin/markus_submit.cgi",
      ],
      pathRewrite: { "^/files/": "/" },
    })
  );
};
