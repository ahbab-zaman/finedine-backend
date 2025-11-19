const User = require("../models/User");

class AuthService {
  // Register user
  static async register(userData) {
    const { name, email, password, phone, birthdate } = userData;
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return {
        success: false,
        message: "Email or phone already exists",
      };
    }

    const user = new User({ name, email, password, phone, birthdate });
    await user.save();
    return { success: true, user: user.toObject() };
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
    return { success: true, user: user.toObject() };
  }

  static async updateProfile(userId, updateData) {
    const { name, email, phone, birthdate } = updateData;

    // Check for conflicts if email or phone is being updated
    const updateQuery = {};
    if (name) updateQuery.name = name;
    if (email) updateQuery.email = email;
    if (phone) updateQuery.phone = phone;
    if (birthdate !== undefined) updateQuery.birthdate = birthdate;

    // Exclude current user from uniqueness check
    const conflictQuery = {};
    if (email && email !== updateData.email) {
      // Wait, need original
      // Better: fetch original first
    }
    const originalUser = await User.findById(userId);
    if (!originalUser) {
      return { success: false, message: "User not found" };
    }

    if (email && email !== originalUser.email) {
      const emailExists = await User.findOne({ email }).where({
        _id: { $ne: userId },
      });
      if (emailExists) {
        return { success: false, message: "Email already exists" };
      }
    }
    if (phone && phone !== originalUser.phone) {
      const phoneExists = await User.findOne({ phone }).where({
        _id: { $ne: userId },
      });
      if (phoneExists) {
        return { success: false, message: "Phone already exists" };
      }
    }

    const user = await User.findByIdAndUpdate(userId, updateQuery, {
      new: true,
      runValidators: true,
    }).select("-password");
    return { success: true, user: user.toObject() };
  }

  static async deleteAccount(userId, password) {
    const user = await User.findById(userId).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return {
        success: false,
        message: "Invalid password",
      };
    }
    await User.findByIdAndDelete(userId);
    return { success: true };
  }

  static async getCurrentUser(userId) {
    const user = await User.findById(userId).select("-password");
    return user ? user.toObject() : null;
  }
}

module.exports = AuthService;
