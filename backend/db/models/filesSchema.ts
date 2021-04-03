const { Schema, ObjectId, model } = require("mongoose");

export {};

const FilesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    directory: {
      type: Boolean,
    },
    parent: {
      type: ObjectId,
    },
    owner: {
      type: ObjectId,
    },
    type: {
      type: String,
    },
    extension: {
      type: String,
    },
    size: {
      type: Number,
    },
    starred: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const MyFiles = model("files", FilesSchema);

module.exports = MyFiles;
