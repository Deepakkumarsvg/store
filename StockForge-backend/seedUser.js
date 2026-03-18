const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const seedUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@stockforge.com';
    const adminName = process.env.ADMIN_NAME || 'Admin User';
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error('ADMIN_PASSWORD env var is required to seed admin user.');
      process.exit(1);
    }

    // Check if admin user already exists
    const existingUser = await User.findOne({ email: adminEmail });
    
    if (existingUser) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword, // This will be hashed automatically by the model
      role: 'admin',
      status: 'Active',
    });

    console.log('✅ Admin user created successfully');
    console.log(`Email: ${adminUser.email}`);
    console.log('Password: [hidden] (value from ADMIN_PASSWORD env var)');
    console.log('\nYou can now login with the configured credentials.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding user:', error);
    process.exit(1);
  }
};

seedUser();
