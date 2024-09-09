/* For local development purposes only. */
// @ts-ignore
const { createProxyMiddleware } = require("http-proxy-middleware");

// @ts-ignore
module.exports = function (app) {
  app.use(
    createProxyMiddleware({
      target: "https://student.cs.uwaterloo.ca/~se212",
      changeOrigin: true,
      pathFilter: [
        "/files.json", // TODO check this URL
        "/george/ask-george/cgi-bin/george.cgi/check",
      ],
    })
  );
};
