const AuthService = require("../services/authService");
const jwt = require("jsonwebtoken");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    // Server-side validation (complements frontend)
    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters",
      });
    }
    if (!email || !email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }
    if (!phone || !phone.match(/^\+[1-9]\d{1,14}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number (must include country code like +1)",
      });
    }

    const result = await AuthService.register({ name, email, password, phone });
    if (result.success) {
      const token = generateToken(result.user._id);
      res.status(201).json({
        success: true,
        token,
        user: {
          id: result.user._id,
          name: result.user.name,
          email: result.user.email,
          phone: result.user.phone,
        },
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Server-side validation
    if (!email || !email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const result = await AuthService.login(email, password);
    if (result.success) {
      const token = generateToken(result.user._id);
      res.json({
        success: true,
        token,
        user: {
          id: result.user._id,
          name: result.user.name,
          email: result.user.email,
          phone: result.user.phone,
        },
      });
    } else {
      res.status(401).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await AuthService.getCurrentUser(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Removed sendOTP and verifyOTP
