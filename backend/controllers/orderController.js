const Order = require('../models/orderModel');

exports.createOrder = async (req, res) => {
  const { userId, products, totalAmount } = req.body;
  const order = await Order.create({ userId, products, totalAmount });
  res.status(201).json(order);
};
