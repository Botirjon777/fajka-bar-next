import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/lib/models/Category';
import Subcategory from '@/lib/models/Subcategory';
import Product from '@/lib/models/Product';
import { verifyToken } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = verifyToken(request);
  if (!user) return Response.json({ message: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await dbConnect();
  try {
    const body = await request.json();
    const category = await Category.findByIdAndUpdate(id, body, { new: true });
    if (!category) return Response.json({ message: 'Category not found' }, { status: 404 });
    return Response.json(category);
  } catch (error: any) {
    return Response.json({ message: 'Error updating category', error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = verifyToken(request);
  if (!user) return Response.json({ message: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await dbConnect();
  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) return Response.json({ message: 'Category not found' }, { status: 404 });

    // Cascade delete
    await Subcategory.deleteMany({ category: id });
    await Product.deleteMany({ category: id });

    return Response.json({ message: 'Category and all associated items deleted' });
  } catch (error: any) {
    return Response.json({ message: 'Error deleting category', error: error.message }, { status: 500 });
  }
}
