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

// module.exports = function (app) {
//   app.use(
//     ["^/files/", "^/verify$"],
//     createProxyMiddleware({
//       target: "https://student.cs.uwaterloo.ca/~se212",
//       changeOrigin: true,
//       pathRewrite: {
//         "^/files/": "/",
//         "^/verify$": "/george/ask-george/cgi-bin/george.cgi/check",
//       },
//     })
//   );
// };

// // app.use(
// //   "^/files/",
// //   createProxyMiddleware({
// //     target: "https://student.cs.uwaterloo.ca/~se212/",
// //     changeOrigin: true,
// //     pathRewrite: { "^/files/": "/" },
// //   })
// // );

// // app.use(
// //   "^/verify$",
// //   createProxyMiddleware({
// //     target: "https://catfact.ninja/",
// //     changeOrigin: true,
// //     pathRewrite: {
// //       "^/verify$": "/fact",
// //     },
// //   })
// // );

// // app.use(
// //   ["^/files/", "^/verify$"],
// //   createProxyMiddleware({
// //     target: "https://student.cs.uwaterloo.ca/~se212",
// //     changeOrigin: true,
// //     pathRewrite: {
// //       "^/files/": "/",
// //       "^/verify$": "/george/ask-george/cgi-bin/george.cgi/check",
// //     },
// //   })
// // );

// const express = require("express");
// const { createProxyMiddleware } = require("http-proxy-middleware");

// const app = express();

// // Set up proxy middleware
// app.use(
//   "^/verify$",
//   createProxyMiddleware({
//     target: "https://student.cs.uwaterloo.ca/~se212",
//     changeOrigin: true,
//     pathRewrite: { "^/verify$": "/george/ask-george/cgi-bin/george.cgi/check" },
//   })
// );

// // Start the server
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Proxy server is listening on port ${port}`);
// });
