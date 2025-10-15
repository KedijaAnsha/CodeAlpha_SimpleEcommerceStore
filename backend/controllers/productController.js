const Product = require('../models/productModel');

exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

exports.addProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};
