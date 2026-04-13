import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/lib/models/Category';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const user = verifyToken(request);
  if (!user) return Response.json({ message: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  try {
    const body = await request.json();
    const category = await Category.create(body);
    return Response.json(category, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return Response.json({ message: 'Anchor ID must be unique' }, { status: 400 });
    }
    return Response.json({ message: 'Error creating category', error: error.message }, { status: 500 });
  }
}
