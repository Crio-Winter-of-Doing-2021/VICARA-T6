const availableStorage = require("express").Router();
const Files = require("../../db/models/filesSchema");
const mongoose = require("mongoose");
const currentUserMiddleware = require("../middleware");

export {};

availableStorage.get(
  "/",
  currentUserMiddleware.currentUser,
  async (req, res, next) => {
    const ownerID = req.currentUser.id;
    const totalAllotedSize = 1024 * 1024 * 1024;

    const totalUsedSize = await Files.aggregate([
      {
        $match: {
          $and: [
            {
              owner: new mongoose.Types.ObjectId(ownerID),
            },
            {
              directory: false,
            },
          ],
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$size",
          },
        },
      },
    ]);

    res.status(200).send({
      totalAllotedSize: totalAllotedSize,
      totalUsedSize: totalUsedSize?.[0]?.total ?? 0,
    });
  }
);

module.exports = availableStorage;
