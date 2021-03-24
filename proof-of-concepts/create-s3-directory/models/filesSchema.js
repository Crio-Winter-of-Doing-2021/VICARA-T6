const mongoose = require("mongoose");

const FilesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    directory: {
        type: Boolean
    },
    parent: {
        type: mongoose.ObjectId
    },
    owner: {
        type: mongoose.ObjectId
    },
    type: {
        type: String,
    },
    extension: {
        type: String
    },
    size: {
        type: Number,
    },
    url: {
        type: String,
    }
}, {
    timestamps: true
})

const Files = mongoose.model("files", FilesSchema);

module.exports = Files;