const User = require("../models/User");
const twilio = require("twilio");
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

class AuthService {
  // Generate 6-digit OTP
  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP via SMS
  static async sendOTP(phone) {
    const otp = this.generateOTP();
    await client.messages.create({
      body: `Your OTP is ${otp}. It expires in 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    // Save OTP to user (create temp user or update if exists)
    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone, otp });
    } else {
      user.otp = otp;
    }
    await user.save();

    return { success: true, message: "OTP sent successfully" };
  }

  // Verify OTP
  static async verifyOTP(phone, otp) {
    const user = await User.findOne({ phone, otp });
    if (!user) return { success: false, message: "Invalid OTP" };

    // Clear OTP after verification
    user.otp = null;
    await user.save();
    return { success: true, user };
  }

  // Register user (after OTP verification)
  static async register(userData) {
    const { name, email, password, phone } = userData;
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return { success: false, message: "Email or phone already exists" };
    }

    const user = new User({ name, email, password, phone });
    await user.save();
    return { success: true, user };
  }

  // Login
  static async login(email, password) {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return { success: false, message: "Invalid email or password" };
    }
    return { success: true, user };
  }
}

module.exports = AuthService;
