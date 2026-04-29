import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userRepo from '../repositories/userRepo.js';

function createError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

export async function signup(email, password) {
  const existingUser = await userRepo.findUserByEmail(email);

  if (existingUser) {
    const error = new Error('Email already exists');
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepo.createUser({
    email,
    password: hashedPassword,
    role: 'user',
  });

  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}

export async function login(email, password) {
  const user = await userRepo.findUserByEmail(email);

  if (!user) {
    throw createError(401, 'Invalid email or password');
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw createError(401, 'Invalid email or password');
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
}