import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
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
    const subcategory = await Subcategory.findByIdAndUpdate(id, body, { new: true });
    if (!subcategory) return Response.json({ message: 'Subcategory not found' }, { status: 404 });
    return Response.json(subcategory);
  } catch (error: any) {
    return Response.json({ message: 'Error updating subcategory', error: error.message }, { status: 500 });
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
    const subcategory = await Subcategory.findByIdAndDelete(id);
    if (!subcategory) return Response.json({ message: 'Subcategory not found' }, { status: 404 });

    // Cascade delete products in this subcategory
    await Product.deleteMany({ subcategory: id });

    return Response.json({ message: 'Subcategory and associated products deleted' });
  } catch (error: any) {
    return Response.json({ message: 'Error deleting subcategory', error: error.message }, { status: 500 });
  }
}
