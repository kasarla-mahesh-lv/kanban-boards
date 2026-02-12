const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log(authHeader,"auth");
    
    if (!authHeader)
      return res.status(401).json({ message: "Token missing" });

    const token = authHeader.split(" ")[1];

    // verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded,"dec");
    
    // check token exists in DB
    const user = await UserModel.findOne({
      _id: decoded.userId,
      "tokens.token": token
    });
    

    // $2b$10$vek.350rDyxxHHAz2Mm98.RcKyqN4ZvwerfIlF1YITau9fG.M0L9W
    console.log(user,"user");
    
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