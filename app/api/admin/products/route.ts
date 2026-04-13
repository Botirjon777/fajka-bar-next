import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const user = verifyToken(request);
  if (!user) return Response.json({ message: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  try {
    const body = await request.json();
    const product = await Product.create(body);
    return Response.json(product, { status: 201 });
  } catch (error: any) {
    return Response.json({ message: 'Error creating product', error: error.message }, { status: 500 });
  }
}
