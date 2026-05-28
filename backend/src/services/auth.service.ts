import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User, IUser } from '../models/User';

export class AuthService {
  static async login(
    email: string,
    password: string
  ): Promise<{ token: string; user: IUser }> {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated. Contact your administrator.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      config.jwtSecret,
      { expiresIn: 86400 }
    );

    return { token, user };
  }

  static async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'admin' | 'general';
    department?: string;
  }): Promise<IUser> {
    const existingUser = await User.findOne({
      email: userData.email.toLowerCase(),
    });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const user = new User(userData);
    await user.save();
    return user;
  }
}
