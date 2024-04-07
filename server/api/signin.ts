// server/api/login.ts
import { PrismaClient, User } from "@prisma/client";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


const prisma = new PrismaClient();

export const loginHandler = async (email: string, password: string): Promise<string> => {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  
  // If user not found or password doesn't match, throw an error
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid email or password');
  }

  const secretKey=String(process.env.JWT_SECRET)

  // Issue JWT token
  const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' }); // Replace 'your-secret-key' with your actual secret key

  return token;
};
