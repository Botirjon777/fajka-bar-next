import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images');

    if (!fs.existsSync(imagesDir)) {
      return Response.json([]);
    }

    const files = fs.readdirSync(imagesDir);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const images = files.filter(file =>
      imageExtensions.includes(path.extname(file).toLowerCase())
    );

    return Response.json(images);
  } catch (error) {
    console.error('Error reading images directory:', error);
    return Response.json({ message: 'Failed to list images' }, { status: 500 });
  }
}
