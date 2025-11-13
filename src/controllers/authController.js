const AuthService = require('../services/authService');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone.match(/^\+[1-9]\d{1,14}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid phone format' });
    }
    const result = await AuthService.sendOTP(phone);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!otp || otp.length !== 6) {
      return res.status(400).json({ success: false, message: 'Invalid OTP format' });
    }
    const result = await AuthService.verifyOTP(phone, otp);
    if (result.success) {
      const token = generateToken(result.user._id);
      res.json({ success: true, token, user: { id: result.user._id, name: result.user.name, email: result.user.email, phone: result.user.phone } });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    // Strict validation
    if (!name || name.length < 2) return res.status(400).json({ success: false, message: 'Name must be at least 2 characters' });
    if (!email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) return res.status(400).json({ success: false, message: 'Invalid email' });
    if (password.length < 8) return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    if (!phone.match(/^\+[1-9]\d{1,14}$/)) return res.status(400).json({ success: false, message: 'Invalid phone' });

    const result = await AuthService.register({ name, email, password, phone });
    if (result.success) {
      const token = generateToken(result.user._id);
      res.status(201).json({ success: true, token, user: { id: result.user._id, name: result.user.name, email: result.user.email, phone: result.user.phone } });
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
    
    // Strict validation
    if (!email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) return res.status(400).json({ success: false, message: 'Invalid email' });
    if (password.length < 8) return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });

    const result = await AuthService.login(email, password);
    if (result.success) {
      const token = generateToken(result.user._id);
      res.json({ success: true, token, user: { id: result.user._id, name: result.user.name, email: result.user.email, phone: result.user.phone } });
    } else {
      res.status(401).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};