const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(401).json({ message: "Token missing" });

    const token = authHeader.split(" ")[1];

    // verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // check token exists in DB
    const user = await User.findOne({
      _id: decoded.userId,
      "tokens.token": token
    });
    
    if (!user)
      return res.status(401).json({ message: "Unauthorized" });

    req.user = user;
    req.token = token;

    next();

  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;