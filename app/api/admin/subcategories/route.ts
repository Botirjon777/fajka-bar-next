import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Subcategory from '@/lib/models/Subcategory';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const user = verifyToken(request);
  if (!user) return Response.json({ message: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  try {
    const body = await request.json();
    const subcategory = await Subcategory.create(body);
    return Response.json(subcategory, { status: 201 });
  } catch (error: any) {
    return Response.json({ message: 'Error creating subcategory', error: error.message }, { status: 500 });
  }
}
