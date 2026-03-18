const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const cleanAndSeed = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@stockforge.com';
    const adminName = process.env.ADMIN_NAME || 'Admin User';
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error('ADMIN_PASSWORD env var is required');
      process.exit(1);
    }

    // Delete existing admin user if it exists
    console.log('Deleting existing admin user...');
    const deleteResult = await User.deleteMany({ email: adminEmail });
    console.log(`Deleted ${deleteResult.deletedCount} existing user(s)`);

    // Create new admin user
    console.log('Creating new admin user...');
    const adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      status: 'Active',
    });

    console.log('✅ Admin user created successfully!');
    console.log(`Email: ${adminUser.email}`);
    console.log('Password: [hidden from output]');
    console.log('\nYou can now login with these credentials.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

cleanAndSeed();
