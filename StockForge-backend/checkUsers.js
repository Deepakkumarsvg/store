const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const checkAllUsers = async () => {
  try {
    console.log('\n=== All Users in Database ===\n');
    const allUsers = await User.find().select('+password');
    
    if (allUsers.length === 0) {
      console.log('No users found in database');
      process.exit(0);
    }

    allUsers.forEach((user, index) => {
      console.log(`User ${index + 1}:`);
      console.log(`  Email: "${user.email}" (length: ${user.email.length})`);
      console.log(`  Name: ${user.name}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Status: ${user.status}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

checkAllUsers();
