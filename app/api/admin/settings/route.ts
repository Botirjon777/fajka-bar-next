import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Settings from '@/lib/models/Settings';
import { verifyToken } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  const user = verifyToken(request);
  if (!user) return Response.json({ message: 'Unauthorized' }, { status: 401 });

  await dbConnect();

  try {
    const { key, value } = await request.json();

    if (!key) {
      return Response.json({ message: 'Missing key' }, { status: 400 });
    }

    const setting = await Settings.findOneAndUpdate(
      { key },
      { value },
      { upsert: true, new: true }
    );

    return Response.json({ message: 'Setting updated', setting });
  } catch (error: any) {
    return Response.json({ message: 'Error updating setting', error: error.message }, { status: 500 });
  }
}
