// --------------------------------------------- no web socket

// import app from "./app.js";
// import { PORT } from "./utils/env.js";




// app.listen(PORT, () => console.log("server is running on port: ", PORT));











// ------------------------------------------- web socket
import { createServer } from "http";
import app from "./app.js";
import { PORT } from "./utils/env.js";
import { initializeSocket } from "./socket/index.js";

const server = createServer(app)

initializeSocket(server);

server.listen(PORT, () => console.log("server is running on port: ", PORT));