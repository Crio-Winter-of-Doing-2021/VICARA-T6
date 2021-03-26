const { connection, connect } = require("mongoose");

const MONGOOSE_URI = process.env.MONGOOSE_URI;

try {
  connect(MONGOOSE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  // CONNECTION EVENTS
  // When successfully connected
  connection.on("connected", function () {
    console.log("Mongoose connected to database");
  });

  // If the connection throws an error
  connection.on("error", function (err: string) {
    console.log("Mongoose default connection error: " + err);
  });

  // When the connection is disconnected
  connection.on("disconnected", function () {
    console.log("Mongoose default connection disconnected");
  });

  // If the Node process ends, close the Mongoose connection
  process.on("SIGINT", function () {
    connection.close(function () {
      console.log(
        "Mongoose default connection disconnected through app termination"
      );
      process.exit(0);
    });
  });
} catch (error) {
  console.log("ERROR", error);
}
