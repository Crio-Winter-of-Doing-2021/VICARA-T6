const dotenv = require("dotenv");
dotenv.config();

require("./db/connection.ts");
const express = require("express");
const busboy = require("connect-busboy");
const cors = require("cors");
const app = express();
const cookieSession = require("cookie-session");
const AWS = require("aws-sdk");
const bodyParser = require("body-parser");

const Files = require("./db/models/filesSchema");
const routes = require("./routes");

const corsOptions = {
  origin: "*",
  credentials: true,
  exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(
  busboy({
    highWaterMark: 10 * 1024 * 1024, // Set 10 MB buffer
  })
); // Insert the busboy middle-ware
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

//  Connect all our routes to our application
app.use("/", routes);

AWS.config.update({
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  accessKeyId: process.env.ACCESS_KEY_ID,
  region: process.env.S3_REGION,
});

const server = app.listen(3001, function () {
  console.log(`Listening on port ${server.address().port}`);
});
