const User = require("../models/User");

class AuthService {
  // Register user
  static async register(userData) {
    const { name, email, password, phone } = userData;
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return {
        success: false,
        message: "Email or phone already exists",
      };
    }

    const user = new User({ name, email, password, phone });
    await user.save();
    return { success: true, user };
  }

  // Login
  static async login(email, password) {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }
    return { success: true, user };
  }

  static async getCurrentUser(userId) {
    const user = await User.findById(userId).select("-password");
    return user;
  }
}

module.exports = AuthService;
