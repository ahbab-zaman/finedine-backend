const AuthService = require("../services/authService");
const jwt = require("jsonwebtoken");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, birthdate } = req.body;
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
    // Optional birthdate validation
    if (birthdate) {
      const parsedDate = new Date(birthdate);
      if (isNaN(parsedDate.getTime()) || parsedDate > new Date()) {
        return res.status(400).json({
          success: false,
          message: "Invalid birthdate",
        });
      }
    }

    const result = await AuthService.register({
      name,
      email,
      password,
      phone,
      birthdate,
    });
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
          birthdate: result.user.birthdate,
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
          birthdate: result.user.birthdate,
        },
      });
    } else {
      res.status(401).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, birthdate } = req.body;
    // Server-side validation
    if (name && (name.trim().length < 2 || name.trim().length > 50)) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 50 characters",
      });
    }
    if (email && !email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
    if (phone && !phone.match(/^\+[1-9]\d{1,14}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number (must include country code like +1)",
      });
    }
    if (birthdate) {
      const parsedDate = new Date(birthdate);
      if (isNaN(parsedDate.getTime()) || parsedDate > new Date()) {
        return res.status(400).json({
          success: false,
          message: "Invalid birthdate",
        });
      }
    }

    const result = await AuthService.updateProfile(req.user.id, {
      name,
      email,
      phone,
      birthdate,
    });
    if (result.success) {
      res.json({
        success: true,
        user: result.user,
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body; // Require password for security
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required to delete account",
      });
    }

    const result = await AuthService.deleteAccount(req.user.id, password);
    if (result.success) {
      res.json({
        success: true,
        message: "Account deleted successfully",
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
