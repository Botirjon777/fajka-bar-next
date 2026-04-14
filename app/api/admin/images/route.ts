import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function GET() {
  try {
    // Fetch images from Cloudinary
    // We can use the Search API or the Resources API
    // Using resources API to list assets in the root or a specific folder
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'fajka-bar/', // Optional: filter by folder
      max_results: 100,
    });

    // Extract secure_urls for the picker
    const images = result.resources.map((resource: any) => resource.secure_url);

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching images from Cloudinary:', error);
    return NextResponse.json({ message: 'Failed to list images from Cloudinary' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'fajka-bar',
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
  }
}
