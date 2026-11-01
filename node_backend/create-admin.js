require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const emailArg = process.argv[2];
const passwordArg = process.argv[3];

async function main() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.ATLAS_MONGO_URI;
    if (!mongoUri) {
      console.error('❌ MONGO_URI not found in .env');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // If email and password arguments provided: create or update user
    if (emailArg && passwordArg) {
      const email = emailArg.trim().toLowerCase();
      const password = passwordArg.trim();

      let user = await User.findOne({ email }).select('+password');
      if (user) {
        user.password = password;
        user.role = 'SUPERADMIN';
        await user.save();
        console.log(`✅ Updated existing user "${email}" to SUPERADMIN with the new password.`);
      } else {
        user = new User({
          email,
          password,
          role: 'SUPERADMIN',
          firstName: 'Admin',
          lastName: 'User',
        });
        await user.save();
        console.log(`✅ Created new SUPERADMIN user "${email}" with your password.`);
      }
      console.log('\nYou can now log in with:');
      console.log(`  Email:    ${email}`);
      console.log(`  Password: ${password}\n`);
    } else {
      console.log('--- Current Users in Database ---');
      const users = await User.find({}, 'email role firstName lastName createdAt');
      if (users.length === 0) {
        console.log('⚠️  No users found in the database! Run "node seed.js" or create one below.');
      } else {
        users.forEach((u) => {
          console.log(`• [${u.role}] ${u.email} (${u.firstName || ''} ${u.lastName || ''})`);
        });
      }

      console.log('\n💡 To create or reset an admin user, run:');
      console.log('   node create-admin.js <email> <password>');
      console.log('Example:');
      console.log('   node create-admin.js admin@rootsip.com adminpassword123\n');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();

