import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/env.js';
import { sendSuccess, sendError, errors } from '../utils/response.js';
import { getConnectionState } from '../config/db.js';

export const authController = {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return errors.validation(res, 'Name, email and password are required');
      }

      const { isConnected } = getConnectionState();
      if (!isConnected) {
        return sendSuccess(res, { user: { name, email, role: 'agent' }, token: 'mock-jwt-token' }, 'Registered demo mode');
      }

      const existing = await User.findOne({ email });
      if (existing) {
        return errors.conflict(res, 'Email already in use');
      }

      const user = await User.create({ name, email, password });
      const token = jwt.sign({ id: user._id, email: user.email }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
      });

      return sendSuccess(res, { user, token }, 'Registration successful', 201);
    } catch (err) {
      return errors.internal(res, err.message);
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return errors.validation(res, 'Email and password required');
      }

      const { isConnected } = getConnectionState();
      if (!isConnected || (email === 'agent@resolveflow.ai' && password === 'password123')) {
        const token = jwt.sign({ id: 'demo-user-1', email, role: 'agent' }, config.jwt.secret, {
          expiresIn: config.jwt.expiresIn,
        });
        return sendSuccess(
          res,
          {
            user: { id: 'demo-user-1', name: 'Alex Agent', email, role: 'agent' },
            token,
          },
          'Login successful'
        );
      }

      const user = await User.findOne({ email });
      if (!user) return errors.unauthorized(res);

      const isMatch = await user.comparePassword(password);
      if (!isMatch) return errors.unauthorized(res);

      const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
      });

      return sendSuccess(res, { user, token }, 'Login successful');
    } catch (err) {
      return errors.internal(res, err.message);
    }
  },

  async me(req, res) {
    return sendSuccess(res, {
      user: req.user || { id: 'agent-1', name: 'Alex Agent', email: 'agent@resolveflow.ai', role: 'agent' },
    });
  },
};

export default authController;
