const router = require("express").Router();
const OrderModel = require("../models/OrderModel.js");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
} = require("./verifyToken.js");

// create cart

router.post("/", verifyToken, async (req, res) => {
  const newOrder = new OrderModel(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// edit  orders
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updateCart = await CartModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send(updateCart);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// delete product from cart
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await OrderModel.findByIdAndDelete(req.params.id);
    res.status(200).json("order has been deleted from cart");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// get user orders
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await OrderModel.find({ userId: req.params.userId });
    res.status(200).send(orders);
  } catch (error) {
    res.status(404).json(error.message);
  }
});

// get all cart
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await OrderModel.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await OrderModel.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
