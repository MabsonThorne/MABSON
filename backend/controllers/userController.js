const User = require('../models/user');

exports.getAllUsers = (req, res) => {
  User.getAll((err, users) => {
    if (err) res.status(500).send(err);
    res.json(users);
  });
};
