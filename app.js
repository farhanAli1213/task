const express = require("express");
const globalErrorHandler = require("./Controllers/errorControllers");
const { unhandledRoutes } = require("./Utils/unSpecifedRouteHandler");
const calenderificRoutes = require('./Routes/calenderificRoutes')
const app = express();

//Guards
app.use(require("./Utils/requestGuards"));

// Routes
app.use("/", calenderificRoutes);

app.get('/health', (req, res) => {
    return res.status(200).json({ message: 'Server is running' });
});

// Handling unhandled routes:
app.all("*", unhandledRoutes());

// Error handler middlware
app.use(globalErrorHandler);
module.exports = app;
