const User = require('../models/user.model');

const register = async (req, res) => {
  try {
    const { username, phone } = req.body;

    const user = await User.createUser({
      username,
      phone,
    });

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
};