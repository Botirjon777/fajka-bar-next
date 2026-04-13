import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/lib/models/Category';
import Subcategory from '@/lib/models/Subcategory';
import Product from '@/lib/models/Product';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const user = verifyToken(request);
  if (!user) return Response.json({ message: 'Unauthorized' }, { status: 401 });

  await dbConnect();

  try {
    const { type, items } = await request.json();

    if (!type || !items || !Array.isArray(items)) {
      return Response.json({ message: 'Invalid request body' }, { status: 400 });
    }

    const Model =
      type === 'category' ? Category :
      type === 'subcategory' ? Subcategory :
      Product;

    const updates = items.map((item: { id: string; order: number }) =>
      Model.findByIdAndUpdate(item.id, { order: item.order })
    );

    await Promise.all(updates);

    return Response.json({ message: 'Reorder successful' });
  } catch (error: any) {
    return Response.json({ message: 'Error reordering items', error: error.message }, { status: 500 });
  }
}
