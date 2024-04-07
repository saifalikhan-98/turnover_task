import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function decodeAndVerifyJwtToken(token: string): number {
  try {
    const secretKey=String(process.env.JWT_SECRET)
    // Verify the token
    console.log("secret", secretKey)
    console.log("token", token)
    const decodedToken = jwt.verify(token, secretKey) as { userId: number };

    // Extract user ID from the decoded token
    const userId = decodedToken.userId;
    console.log(userId)
    // Return the user ID
    return userId;
  } catch (error) {
    // If an error occurs during token verification, throw an error
    throw new Error('Invalid token');
  }
}