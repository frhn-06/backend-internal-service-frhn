import express from 'express';
import authRoute from './routes/auth.route.js';
import cors from 'cors'
import bodyParser from 'body-parser';
import departmentRoute from './routes/department.route.js';
import agentRoute from './routes/agent.route.js';

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.get("/", (req, res) => {
    return res.json({
        name: "internal service",
        developer: "farhan"
    })
});

app.use("/api/auth", authRoute);
app.use("/api/department", departmentRoute);
app.use("/api/agent", agentRoute);

export default app;