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
    children: {
        type: [mongoose.ObjectId]
    },
}, {
    timestamps: true
})

const Files = mongoose.model("files", FilesSchema);

module.exports = Files;