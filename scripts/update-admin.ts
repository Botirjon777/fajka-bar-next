import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../lib/models/Admin';
import dbConnect from '../lib/db';

async function updateAdmin() {
  console.log('🔐 Starting Admin credentials update...');

  try {
    const newUsername = process.env.ADMIN_USERNAME?.trim();
    const newPassword = process.env.ADMIN_PASSWORD?.trim();

    if (!newUsername || !newPassword) {
      console.error('❌ Missing ADMIN_USERNAME or ADMIN_PASSWORD in .env');
      process.exit(1);
    }

    // 1. Connect to Database
    await dbConnect();
    console.log('✅ Connected to MongoDB');

    // 2. Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Update existing admin or create if not exists
    // We assume there's only one admin, or we update the one with 'admin' username
    // But better to just update the first one found or create a new one if none exists.
    const adminCount = await Admin.countDocuments();

    if (adminCount === 0) {
      console.log('ℹ️ No admin found. Creating new admin...');
      await Admin.create({
        username: newUsername,
        password: hashedPassword,
      });
      console.log(`✅ Admin created: ${newUsername}`);
    } else {
      console.log(`ℹ️ Found ${adminCount} admin(s). Updating...`);
      // Update all admins to the same secure credentials for now, 
      // or we can just update the first one.
      await Admin.updateOne({}, {
        $set: {
          username: newUsername,
          password: hashedPassword,
        }
      });
      console.log(`✅ Admin credentials updated successfully to: ${newUsername}`);
    }

  } catch (error) {
    console.error('❌ Update failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);
  }
}

updateAdmin();
