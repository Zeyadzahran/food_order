import { Request, Response, Router } from 'express';
import dotenv from 'dotenv';
import { User } from '../modules/auth/auth.model';
import { Category } from '../modules/menu/category.model';
import { MenuItem } from '../modules/menu/menu.model';
import { ApiResponse } from './ApiResponse';
import { connectDB } from '../config/db';

dotenv.config();

export const seedDatabase = async () => {
  await User.deleteMany({});
  await Category.deleteMany({});
  await MenuItem.deleteMany({});

  await User.create({
    name: 'Admin',
    email: 'admin@food.com',
    password: 'admin123',
    role: 'admin'
  });

  const pizza = await Category.create({ name: { en: 'Pizza', ar: 'بيتزا' }, description: { en: 'Delicious pizzas', ar: 'بيتزا لذيذة' } });
  const burger = await Category.create({ name: { en: 'Burgers', ar: 'برجر' }, description: { en: 'Juicy burgers', ar: 'برجر لذيذ' } });
  const drinks = await Category.create({ name: { en: 'Drinks', ar: 'مشروبات' }, description: { en: 'Refreshing drinks', ar: 'مشروبات منعشة' } });

  const items = await MenuItem.insertMany([
    { name: { en: 'Margherita', ar: 'مارجريتا' }, description: { en: 'Classic cheese and tomato', ar: 'جبنة وطماطم' }, price: 40, category: pizza._id, imageUrl: 'https://source.unsplash.com/400x300/?pizza,cheese', isAvailable: true },
    { name: { en: 'Pepperoni', ar: 'بيبروني' }, description: { en: 'Beef pepperoni pizza', ar: 'بيتزا بيبروني' }, price: 60, category: pizza._id, imageUrl: 'https://source.unsplash.com/400x300/?pizza,pepperoni', isAvailable: true },
    { name: { en: 'BBQ Chicken', ar: 'دجاج باربيكيو' }, description: { en: 'Grilled chicken with BBQ', ar: 'دجاج مشوي مع الباربيكيو' }, price: 75, category: pizza._id, imageUrl: 'https://source.unsplash.com/400x300/?pizza,chicken', isAvailable: true },
    { name: { en: 'Classic Burger', ar: 'برجر كلاسيك' }, description: { en: 'Beef patty with lettuce', ar: 'لحم بقري مع خس' }, price: 50, category: burger._id, imageUrl: 'https://source.unsplash.com/400x300/?burger,beef', isAvailable: true },
    { name: { en: 'Cheese Burger', ar: 'تشيز برجر' }, description: { en: 'Beef patty with cheddar', ar: 'لحم بقري مع شيدر' }, price: 65, category: burger._id, imageUrl: 'https://source.unsplash.com/400x300/?burger,cheese', isAvailable: true },
    { name: { en: 'Double Burger', ar: 'دبل برجر' }, description: { en: 'Double beef patty', ar: 'دبل لحم بقري' }, price: 90, category: burger._id, imageUrl: 'https://source.unsplash.com/400x300/?burger,double', isAvailable: true },
    { name: { en: 'Cola', ar: 'كولا' }, description: { en: 'Cold refreshing cola', ar: 'كولا باردة منعشة' }, price: 20, category: drinks._id, imageUrl: 'https://source.unsplash.com/400x300/?cola,drink', isAvailable: true },
    { name: { en: 'Orange Juice', ar: 'عصير برتقال' }, description: { en: 'Freshly squeezed', ar: 'عصرة طازجة' }, price: 30, category: drinks._id, imageUrl: 'https://source.unsplash.com/400x300/?juice,orange', isAvailable: true },
  ]);

  return { users: 1, categories: 3, menuItems: items.length };
};

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Seed
 *   description: Database seeding operations (Dev only)
 * 
 * /api/seed:
 *   post:
 *     summary: Seed the database with initial data
 *     tags: [Seed]
 *     responses:
 *       201:
 *         description: Seeded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const counts = await seedDatabase();
    ApiResponse.success(res, { counts }, 'Seeded successfully', 201);
  } catch (error: any) {
    ApiResponse.error(res, error.message, 500, error);
  }
});

export default router;

if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      console.log('Seeding Database...');
      await seedDatabase();
      console.log('Seeded successfully!');
      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  })();
}
