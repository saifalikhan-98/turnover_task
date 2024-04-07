// server/api/userCategory.ts
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUserCategory = async (input: {
  userId: number;
  categoryIds: number[];
}) => {
  const { userId, categoryIds } = input;

  // Check if user exists
  const userExists = await prisma.user.findUnique({ where: { id: userId } });
  if (!userExists) {
    throw new Error(`User with ID ${userId} does not exist`);
  }

  // Check if all categories exist
  const categoriesExist = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
  });
  if (categoriesExist.length !== categoryIds.length) {
    throw new Error('One or more categories do not exist');
  }

  // Create UserCategory entries
  const userCategoryEntries = categoryIds.map((categoryId) => ({
    userId,
    categoryId,
  }));
  await prisma.userCategory.createMany({ data: userCategoryEntries });

  return { success: true };
};

// Define schema for input
export const createUserCategoryInputSchema = z.object({
  userId: z.number(),
  categoryIds: z.array(z.number()),
});
