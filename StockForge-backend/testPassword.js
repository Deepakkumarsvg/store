const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');

dotenv.config();
connectDB();

const testPasswordLogin = async () => {
  try {
    const adminEmail = 'admin@stockforge.com';
    const testPassword = 'Admin@123456';

    console.log('\n=== Testing Password Authentication ===');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password to test: ${testPassword}`);

    // Find user
    const user = await User.findOne({ email: adminEmail }).select('+password');
    
    if (!user) {
      console.log('\n❌ User not found!');
      process.exit(1);
    }

    console.log(`\n✅ User found: ${user.name}`);
    console.log(`Stored password hash: ${user.password.substring(0, 20)}...`);

    // Test password comparison
    const isMatch = await user.comparePassword(testPassword);
    console.log(`\nPassword comparison result: ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);

    if (!isMatch) {
      console.log('\n⚠️  Password does not match!');
      console.log('Delete and reseed the user with: node cleanAndSeed.js');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

testPasswordLogin();
