import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userRepo from '../repositories/userRepo.js';

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
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
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