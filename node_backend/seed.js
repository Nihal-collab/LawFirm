/**
 * Seed Script — Creates initial admin user in MongoDB.
 * Run once: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Video = require('./src/models/Video');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Create SuperAdmin
    const existing = await User.findOne({ email: 'admin@sr4ipr.com' });
    if (!existing) {
      await User.create({
        email: 'admin@sr4ipr.com',
        password: 'adminpassword123',
        role: 'SUPERADMIN',
        firstName: 'SR4IPR',
        lastName: 'Administrator',
        phone: '+91 22 5543-0980',
      });
      console.log('✅ SuperAdmin created: admin@sr4ipr.com / adminpassword123');
    } else {
      console.log('ℹ️  Admin user already exists.');
    }

    // Optional: Create a test CLIENT user
    const testClient = await User.findOne({ email: 'client@example.com' });
    if (!testClient) {
      await User.create({
        email: 'client@example.com',
        password: 'clientpassword123',
        role: 'CLIENT',
        firstName: 'Alex',
        lastName: 'Novak',
      });
      console.log('✅ Test client created: client@example.com / clientpassword123');
    }

    // Seed default videos
    const count = await Video.countDocuments();
    if (count === 0) {
      await Video.create([
        {
          title: "Navigating PCT International Patent Filing",
          description: "A strategic overview on coordinating multi-jurisdictional patent registrations under the Patent Cooperation Treaty.",
          youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          youtube_video_id: "dQw4w9WgXcQ",
          display_order: 1,
          is_active: true
        },
        {
          title: "Brand Protection & Global Trademark Audits",
          description: "Step-by-step procedures for conducting clearance searches and registering marks across multiple classes.",
          youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          youtube_video_id: "dQw4w9WgXcQ",
          display_order: 2,
          is_active: true
        },
        {
          title: "Software Copyright & Code Registration",
          description: "How software startups can lock down proprietary algorithms, API schemas, and database ownership.",
          youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          youtube_video_id: "dQw4w9WgXcQ",
          display_order: 3,
          is_active: true
        }
      ]);
      console.log('✅ Default active YouTube videos seeded successfully.');
    } else {
      console.log('ℹ️  Video library already populated.');
    }

    console.log('\n🎉 Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
