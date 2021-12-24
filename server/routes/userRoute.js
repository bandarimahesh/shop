const router = require("express").Router();
const bcrypt = require("bcrypt");
const UserModel = require("../models/UserModel.js");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken.js");

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  const saltRound = 10;
  const saltRounds = await bcrypt.genSalt(saltRound);

  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, saltRounds);
  }

  try {
    const updateUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send(updateUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.status(200).json("user has been deleted");
  } catch (error) {
    res.status(500).send(error.message);
  }
});
// get user only one
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).send(others);
  } catch (error) {
    res.status(404).json(error.message);
  }
});
// get all users

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await UserModel.find().sort({ _id: -1 }).limit(5)
      : await UserModel.find();

    res.status(200).send(users);
  } catch (error) {
    res.status(404).json(error.message);
  }
});

// get users status

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear() - 1);

  try {
    const data = await UserModel.aggregate([
      {
        $match: { createdAt: { $gte: lastYear } },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
