const router = require("express").Router();
const UserModel = require("../models/UserModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// register
router.post("/register", async (req, res) => {
  try {
    const saltRound = 10;
    const saltRounds = await bcrypt.genSalt(saltRound);
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = new UserModel({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const result = await newUser.save();
    res.status(200).json(result);
  } catch (error) {
    res.json(error.message);
  }
});

// login route
router.post("/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ username: req.body.username });
    !user && res.status(404).send("No user found with this email");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    !validPassword && res.status(404).json("Invalid password");
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      {
        expiresIn: "3d",
      }
    );

    const { password, ...others } = user._doc;
    res.status(200).send({ ...others, accessToken });
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

module.exports = router;
