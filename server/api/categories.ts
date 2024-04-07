// server/api/fetchCategories.ts
import { PrismaClient, Category } from "@prisma/client";

const prisma = new PrismaClient();

export const fetchCategoriesHandler = async (page: number, pageSize: number): Promise<Category[]> => {
 
  // Calculate offset based on page and pageSize for pagination
  console.log(page, pageSize)
  const offset = (page - 1) * pageSize;

  // Fetch categories from the database with pagination
  const categories = await prisma.category.findMany({
    skip: offset,
    take: pageSize,
  });

  return categories;
};

export const populateCategories = async () => {
    try {
      // Define dummy categories
      const categories = [
        'Electronics',
        'Clothing',
        'Books',
        'Home & Kitchen',
        'Toys & Games',
        'Sports & Outdoors',
        'Beauty & Personal Care',
        'Health & Household',
        'Automotive',
        'Tools & Home Improvement',
        'Baby',
        'Pet Supplies',
        'Grocery & Gourmet Food',
        // Add more categories as needed
      ];
  
      // Loop through the categories and create each in the database if it doesn't already exist
      await Promise.all(
        categories.map(async (categoryName) => {
          // Check if the category with the same name already exists in the database
          const existingCategory = await prisma.category.findFirst({
            where: { name: categoryName },
          });
  
          // If the category doesn't already exist, create it
          if (!existingCategory) {
            await prisma.category.create({
              data: {
                name: categoryName,
                // Add other category fields if needed
              },
            });
          }
        })
      );
  
      return { success: true };
    } catch (error) {
      console.error('Error populating categories:', error);
      return { success: false };
    }
  };