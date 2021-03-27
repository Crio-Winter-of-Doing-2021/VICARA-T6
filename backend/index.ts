const dotenv = require("dotenv");
dotenv.config();

require("./db/connection.ts");
const express = require("express");
const busboy = require("connect-busboy");
const cors = require("cors");
const app = express();
const AWS = require("aws-sdk");
const bodyParser = require("body-parser");

const Files = require("./db/models/filesSchema");
const routes = require("./routes");

app.use(cors());
app.use(bodyParser.json());
app.use(
  busboy({
    highWaterMark: 10 * 1024 * 1024, // Set 10 MB buffer
  })
); // Insert the busboy middle-ware

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
