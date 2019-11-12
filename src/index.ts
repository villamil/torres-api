import { Server } from "./server";
import { CONFIG } from "./config";

(async () => {
  try {
    const server = new Server();
    const startedServer = await server.start();
    if (!startedServer) throw Error("Error server");
    startedServer.listen(CONFIG.PORT);
    startedServer.on("listening", () => {
      console.log(`Server listening on port ${CONFIG.PORT}`);
    });
  } catch (error) {
    console.log(error);
    throw new Error("Couldn't create server");
  }
})();
