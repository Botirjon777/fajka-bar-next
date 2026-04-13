import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
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
    const product = await Product.findByIdAndUpdate(id, body, { new: true });
    if (!product) return Response.json({ message: 'Product not found' }, { status: 404 });
    return Response.json(product);
  } catch (error: any) {
    return Response.json({ message: 'Error updating product', error: error.message }, { status: 500 });
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
    const product = await Product.findByIdAndDelete(id);
    if (!product) return Response.json({ message: 'Product not found' }, { status: 404 });
    return Response.json({ message: 'Product deleted' });
  } catch (error: any) {
    return Response.json({ message: 'Error deleting product', error: error.message }, { status: 500 });
  }
}
