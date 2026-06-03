const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/bookleaf');

const seed = async () => {
  await User.deleteMany({});

  const hashedPass = await bcrypt.hash('123456', 10);

  await User.create([
    {
      name: 'Priya Sharma',
      email: 'student@test.com',
      password: hashedPass,
      role: 'student',
      college: 'Delhi University',
      cgpa: 8.5,
      booksIssued: 3,
      dues: 0
    },
    {
      name: 'Admin Sir',
      email: 'admin@test.com',
      password: hashedPass, 
      role: 'admin' 
    }
  ]);
  
  console.log('Data seeded - Student + Admin ready');
  process.exit();
};

seed();