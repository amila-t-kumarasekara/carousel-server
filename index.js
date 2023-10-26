require("dotenv").config();
const express = require("express");
const cors = require("cors");
const compression = require('compression');
const routes  = require("./routes/routes");
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const app = express();

app.use(compression());

// Configure JSON body parser
app.use(bodyParser.json({
  limit: '50MB', // Reject payload bigger than 1 MB
}));

//Cors Configuration - Start
const corsOptions = {
  origin: "*",
  methods: "GET,POST",
  allowedHeaders: "*",
  preflightContinue: false
};

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 60 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use((req, res, next) => {
  req.ip = req.body.ipAddress; // Extract the client's IP address from the request headers
  next();
});

app.options('*', cors());

app.use(cors(corsOptions));

app.use('/images', express.static('images'));

// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use(routes.routes);

const PORT = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 5000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

module.exports = app;
