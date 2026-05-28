import { User, IUser } from '../models/User';

export class UserService {
  static async getUserById(userId: string): Promise<IUser | null> {
    return User.findById(userId).select('-password');
  }

  static async getAllUsers(): Promise<IUser[]> {
    return User.find().select('-password').sort({ createdAt: -1 });
  }

  static async updateUser(
    userId: string,
    updates: Partial<Pick<IUser, 'firstName' | 'lastName' | 'role' | 'department' | 'isActive'>>
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select('-password');
  }

  static async deleteUser(userId: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(userId);
    return !!result;
  }

  static async getUserCount(): Promise<{ total: number; active: number; admins: number }> {
    const [total, active, admins] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'admin' }),
    ]);
    return { total, active, admins };
  }
}
