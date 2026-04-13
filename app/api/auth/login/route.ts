import dbConnect from '@/lib/db';
import Admin from '@/lib/models/Admin';
import { signToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, password } = await request.json();

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return Response.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return Response.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({ id: admin._id.toString(), username: admin.username });

    return Response.json({
      token,
      user: { id: admin._id, username: admin.username },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Server error' }, { status: 500 });
  }
}
