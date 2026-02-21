const { createServer } = require("http");
const next = require("next");

const port = Number(process.env.PORT) || 3000;
const host = "0.0.0.0";

const app = next({
  dev: false,
  hostname: host,
  port,
});

const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      handle(req, res);
    }).listen(port, host, () => {
      console.log(`[Next] server ready on http://${host}:${port}`);
    });
  })
  .catch((err) => {
    console.error("[Next] startup failed:", err);
    process.exit(1);
  });
