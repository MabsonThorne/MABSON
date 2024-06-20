const Order = require('../models/order');

exports.getAllOrders = (req, res) => {
  Order.getAll((err, orders) => {
    if (err) res.status(500).send(err);
    res.json(orders);
  });
};

// 添加其他订单相关控制器函数
