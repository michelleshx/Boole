/* For local development purposes only. */
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    ["^/files/", "^/verify$"],
    createProxyMiddleware({
      // pathFilter: ["^/files/", "^/verify$"],
      target: "https://student.cs.uwaterloo.ca/~se212/",
      changeOrigin: true,
      pathRewrite: {
        "^/files/": "/",
        "^/verify$": "/george/ask-george/cgi-bin/george.cgi/check",
      },
      // on: {
      //   proxyReq: (proxyReq, req, res) => {
      //     console.log("hi");
      //   },
      //   proxyRes: (proxyRes, req, res) => {
      //     // log original request and proxied request info
      //     const exchange = `[${req.method}] [${proxyRes.statusCode}] ${req.path} -> ${proxyRes.req.protocol}//${proxyRes.req.host}${proxyRes.req.path}`;
      //     console.log(exchange); // [GET] [200] / -> http://www.example.com
      //   },
      //   error: (err, req, res) => {
      //     console.log(err);
      //     /* handle error */
      //   },
      // },
    })
  );
};
