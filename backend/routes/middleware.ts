const jwt = require("jsonwebtoken");

const currentUserMiddleware = {
  currentUser: async function (req, res, next) {
    if (!req.session?.jwt) {
      return next();
    }

    try {
      req.currentUser = jwt.verify(req.session.jwt, process.env.JWT_SECRET!);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(400).json({ err: "Session Expired" });
      }
    }

    next();
  },
};

module.exports = currentUserMiddleware;
