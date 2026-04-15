import dbConnect from '@/lib/db';
import Settings from '@/lib/models/Settings';

export async function GET() {
  await dbConnect();

  try {
    const settings = await Settings.find({});
    
    // Transform to simple object { key: value }
    const settingsObj = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, any>);

    // If phone is missing, add default from translation as fallback
    if (!settingsObj.phone) {
      settingsObj.phone = "+48 123 456 789";
    }

    return Response.json(settingsObj);
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Server error' }, { status: 500 });
  }
}
