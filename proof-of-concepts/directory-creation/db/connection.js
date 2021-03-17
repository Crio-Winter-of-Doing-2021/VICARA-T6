const mongoose = require("mongoose");
const uri = `mongodb://localhost:27017/vicara-t6`;

try {
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    });

    // CONNECTION EVENTS
    // When successfully connected
    mongoose.connection.on("connected", function () {
        console.log("Mongoose connected to database");
    });

    // If the connection throws an error
    mongoose.connection.on("error", function (err) {
        console.log("Mongoose default connection error: " + err);
    });

    // When the connection is disconnected
    mongoose.connection.on("disconnected", function () {
        console.log("Mongoose default connection disconnected");
    });

    // If the Node process ends, close the Mongoose connection
    process.on("SIGINT", function () {
        mongoose.connection.close(function () {
            console.log(
                "Mongoose default connection disconnected through app termination"
            );
            process.exit(0);
        });
    });
} catch (error) {
    console.log("ERROR", error);
}
