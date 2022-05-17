import { app } from "./app";
import log from 'heroku-logger'
import dotenv from 'dotenv'

const port = app.get("port");

dotenv.config()
const server = app.listen(port, onListening);
server.on("error", onError);

function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      log.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      log.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind =
    typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  log.info(`Listening on ${bind}`);
}

export default server;
