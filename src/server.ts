import app from "./app";
import { PORT } from "./utils/env";




app.listen(PORT, () => console.log("server is running on port: ", PORT));