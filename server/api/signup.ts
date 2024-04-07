// server/api/signup.ts
import { PrismaClient, User } from "@prisma/client";
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

export const signupHandler = async (input: {
  name: string;
  email: string;
  password: string;
}): Promise<User> => {
  // Check if user with the given email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Generate verification code
  const verificationCode = generateVerificationCode();

  // Hash the verification code
  const hashedVerificationCode = await bcrypt.hash(verificationCode, 10); // 10 is the number of salt rounds

  // Hash the password
  const hashedPassword = await bcrypt.hash(input.password, 10); // 10 is the number of salt rounds

  // Create user in the database
  const newUser = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
      verification_code: hashedVerificationCode
    },
  });

  // Send verification code via email
  await sendVerificationEmail(input.email, verificationCode);

  return newUser;
};

async function sendVerificationEmail(email: string, verificationCode: string): Promise<void> {
    // Create a nodemailer transporter using your email service credentials
    const transporter = nodemailer.createTransport({
      // Configure your email service here
      // Example for Gmail:
      service: 'gmail',
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });
  
    // Send email with verification code
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Verification Code',
      text: `Your verification code is: ${verificationCode}`,
    });
  }
  
  function generateVerificationCode(): string {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code.padStart(8, '0'); // Ensure code is always 8 digits long
  }