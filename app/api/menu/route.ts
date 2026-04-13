import dbConnect from '@/lib/db';
import Category from '@/lib/models/Category';
import Subcategory from '@/lib/models/Subcategory';
import Product from '@/lib/models/Product';

export async function GET() {
  await dbConnect();

  try {
    const categories = await Category.find({}).sort({ order: 1 });
    const subcategories = await Subcategory.find({}).sort({ order: 1 });
    const products = await Product.find({}).sort({ order: 1 });

    const menu = categories.map(cat => {
      const catSubcategories = subcategories.filter(
        sub => sub.category.toString() === cat._id.toString()
      );

      const subcategoryData = catSubcategories.map(sub => ({
        ...sub.toObject(),
        products: products.filter(
          p => p.subcategory?.toString() === sub._id.toString()
        ),
      }));

      const productsWithoutSubcategory = products.filter(
        p => p.category.toString() === cat._id.toString() && !p.subcategory
      );

      return {
        ...cat.toObject(),
        subcategories: subcategoryData,
        products: productsWithoutSubcategory,
      };
    });

    return Response.json(menu);
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Server error' }, { status: 500 });
  }
}
