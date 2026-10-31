import express from 'express';
import authRoute from './routes/auth.route.js';
import cors from 'cors'
import bodyParser from 'body-parser';
import departmentRoute from './routes/department.route.js';
import agentRoute from './routes/agent.route.js';
import errorMiddleware from './middlewares/error.middleware.js';
import employeeRoute from './routes/employee.route.js';
import categoryRoute from './routes/category.route.js';
import ticketRoute from './routes/ticket.route.js';
import notificationRoute from './routes/notification.route.js';
import dashboardRoute from './routes/dashboard.route.js';
import userRoute from './routes/user.route.js';
import swaggerDocs from './docs/route.js';


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
app.use("/api/employee", employeeRoute);
app.use("/api/category", categoryRoute);
app.use("/api/ticket", ticketRoute);
app.use("/api/notification", notificationRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/user", userRoute)

swaggerDocs(app)

app.use(errorMiddleware.routeError());

app.use(errorMiddleware.serverError())

export default app;