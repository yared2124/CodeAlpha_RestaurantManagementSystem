import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { ValidationError } from '../utils/errors.js';

class AuthService {
  /**
   * Register a new user.
   * @param {string} email
   * @param {string} password
   * @param {string} role – optional, defaults to 'customer'
   * @returns {Promise<{id, email, role}>}
   */
  async register(email, password, role = 'customer') {
    // Check if user already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      throw new ValidationError('Email already registered');
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({ email, passwordHash, role });
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  /**
   * Login – verify credentials and return a JWT.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{token, user: {id, email, role}}>}
   */
  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new ValidationError('Invalid credentials');
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      throw new ValidationError('Invalid credentials');
    }

    // Generate JWT
    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }
}

export default new AuthService();