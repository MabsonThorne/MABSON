const Translation = require('../models/translation');

exports.translate = (req, res) => {
  const { text, from, to } = req.body;
  Translation.translate(text, from, to, (err, result) => {
    if (err) res.status(500).send(err);
    res.json(result);
  });
};

// 添加其他翻译相关控制器函数
