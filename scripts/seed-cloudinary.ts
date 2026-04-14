import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import Category from '../lib/models/Category';
import Product from '../lib/models/Product';
import dbConnect from '../lib/db';

// Configure Cloudinary
const cleanEnvVar = (val?: string) => val?.replace(/^["']|["']$/g, '');

cloudinary.config({
  cloud_name: cleanEnvVar(process.env.CLOUDINARY_CLOUD_NAME),
  api_key: cleanEnvVar(process.env.CLOUDINARY_API_KEY),
  api_secret: cleanEnvVar(process.env.CLOUDINARY_API_SECRET),
  secure: true,
});

async function seedCloudinary() {
  console.log('🚀 Starting Cloudinary migration...');

  try {
    // 1. Connect to Database
    await dbConnect();
    console.log('✅ Connected to MongoDB');

    // 2. Read local images
    const imagesDir = path.join(process.cwd(), 'public', 'images');
    if (!fs.existsSync(imagesDir)) {
      console.error('❌ Images directory not found:', imagesDir);
      process.exit(1);
    }

    const files = fs.readdirSync(imagesDir);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const imageFiles = files.filter(file =>
      imageExtensions.includes(path.extname(file).toLowerCase())
    );

    console.log(`📸 Found ${imageFiles.length} images to migrate`);

    const urlMapping: Record<string, string> = {};

    // 3. Upload images to Cloudinary
    for (const file of imageFiles) {
      const filePath = path.join(imagesDir, file);
      const publicId = path.parse(file).name;
      const localPath = `/images/${file}`;

      console.log(`📤 Uploading ${file}...`);
      
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'fajka-bar',
          public_id: publicId,
          use_filename: true,
          unique_filename: false,
          overwrite: true,
        });

        urlMapping[localPath] = result.secure_url;
        console.log(`   ✅ Success: ${result.secure_url}`);
      } catch (uploadError) {
        console.error(`   ❌ Failed to upload ${file}:`, uploadError);
      }
    }

    // 4. Update Database Records
    console.log('\n🔄 Updating database records...');

    let categoryUpdates = 0;
    let productUpdates = 0;

    // Update Categories
    const categories = await Category.find({});
    for (const category of categories) {
      if (category.image && urlMapping[category.image]) {
        category.image = urlMapping[category.image];
        await category.save();
        categoryUpdates++;
      }
    }

    // Update Products
    const products = await Product.find({});
    for (const product of products) {
      if (product.image && urlMapping[product.image]) {
        product.image = urlMapping[product.image];
        await product.save();
        productUpdates++;
      }
    }

    console.log(`\n🎉 Migration complete!`);
    console.log(`📊 Stats:`);
    console.log(`   - Images uploaded: ${Object.keys(urlMapping).length}`);
    console.log(`   - Categories updated: ${categoryUpdates}`);
    console.log(`   - Products updated: ${productUpdates}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);
  }
}

seedCloudinary();
