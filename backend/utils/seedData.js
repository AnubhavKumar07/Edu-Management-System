// Seed script — populates the database with demo data
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load env from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const University = require('../models/University');
const Student = require('../models/Student');
const Announcement = require('../models/Announcement');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data — drop collections to reset indexes
    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const col of collections) {
      await mongoose.connection.db.dropCollection(col.name);
    }
    console.log('🗑️  Dropped all collections');

    // Create universities
    const universities = await University.create([
      { name: 'Indian Institute of Technology Delhi', location: 'New Delhi' },
      { name: 'Indian Institute of Technology Bombay', location: 'Mumbai' },
      { name: 'Delhi University', location: 'New Delhi' },
      { name: 'Jawaharlal Nehru University', location: 'New Delhi' },
      { name: 'University of Mumbai', location: 'Mumbai' },
      { name: 'Anna University', location: 'Chennai' },
      { name: 'Banaras Hindu University', location: 'Varanasi' },
      { name: 'Indian Institute of Science', location: 'Bangalore' },
    ]);
    console.log(`🏫 Created ${universities.length} universities`);

    // Create admin user
    const adminUser = await User.create({
      name: 'Government Admin',
      email: 'admin@gov.in',
      password: 'Admin@123!',
      role: 'admin',
    });
    console.log('👤 Created admin user: admin@gov.in / Admin@123!');

    // Create university users
    const universityUsers = [];
    for (const uni of universities.slice(0, 4)) {
      const slug = uni.name.toLowerCase().replace(/\s+/g, '').slice(0, 10);
      const user = await User.create({
        name: `${uni.name} Admin`,
        email: `${slug}@university.edu`,
        password: 'University@123!',
        role: 'university',
        universityId: uni._id,
      });
      uni.userId = user._id;
      await uni.save();
      universityUsers.push(user);
    }
    console.log(`👤 Created ${universityUsers.length} university users`);

    // Courses and skills data
    const courses = [
      'Computer Science',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Data Science',
      'Artificial Intelligence',
      'Business Administration',
      'Physics',
      'Mathematics',
      'Chemistry',
    ];

    const skillSets = [
      ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis'],
      ['Java', 'Spring Boot', 'MySQL', 'Docker'],
      ['C++', 'Algorithms', 'Data Structures', 'System Design'],
      ['HTML', 'CSS', 'JavaScript', 'UI/UX Design'],
      ['Python', 'Django', 'PostgreSQL', 'REST APIs'],
      ['R', 'Statistics', 'Data Visualization', 'Excel'],
      ['AWS', 'DevOps', 'Kubernetes', 'CI/CD'],
      ['Flutter', 'Dart', 'Firebase', 'Mobile Dev'],
      ['Blockchain', 'Solidity', 'Web3', 'Cryptography'],
    ];

    const companies = [
      'Google',
      'Microsoft',
      'Amazon',
      'Infosys',
      'TCS',
      'Wipro',
      'Flipkart',
      'Paytm',
      'Razorpay',
      'Zomato',
      null,
      null,
      null,
    ];

    const firstNames = [
      'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun',
      'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
      'Ananya', 'Diya', 'Myra', 'Sara', 'Aadhya',
      'Isha', 'Riya', 'Priya', 'Neha', 'Kavya',
      'Rohan', 'Rahul', 'Amit', 'Suresh', 'Vikram',
      'Pooja', 'Sneha', 'Divya', 'Meera', 'Tanvi',
    ];

    const lastNames = [
      'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar',
      'Patel', 'Reddy', 'Nair', 'Joshi', 'Mehta',
      'Iyer', 'Pillai', 'Das', 'Chatterjee', 'Banerjee',
    ];

    // Create students
    const students = [];
    let studentUserCount = 0;

    for (let i = 0; i < 120; i++) {
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[i % lastNames.length];
      const name = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@student.edu`;
      const university = universities[i % universities.length];
      const course = courses[i % courses.length];
      const marks = Math.floor(Math.random() * 60) + 40; // 40-100
      const skills = skillSets[i % skillSets.length];
      const company = companies[Math.floor(Math.random() * companies.length)];
      const isPlaced = company !== null;

      // Create student user for first 8 students
      let userId = null;
      if (i < 8) {
        const studentUser = await User.create({
          name,
          email: `student${i + 1}@student.edu`,
          password: 'Student@123!',
          role: 'student',
          universityId: university._id,
        });
        userId = studentUser._id;
        studentUserCount++;
      }

      students.push({
        name,
        email,
        course,
        marks,
        skills,
        universityId: university._id,
        userId,
        isPlaced,
        placementCompany: company,
      });
    }

    await Student.insertMany(students);
    console.log(`🎓 Created ${students.length} students (${studentUserCount} with login accounts)`);

    // Create announcements
    await Announcement.create([
      {
        title: 'Annual Data Submission Deadline',
        message:
          'All universities are required to submit their annual student data by March 31, 2025. Please ensure all records are up to date.',
        createdBy: adminUser._id,
        priority: 'high',
        targetUniversities: [],
      },
      {
        title: 'New Skill Development Program',
        message:
          'The government is launching a new skill development initiative. Universities are encouraged to identify students who would benefit from additional training in emerging technologies.',
        createdBy: adminUser._id,
        priority: 'medium',
        targetUniversities: [],
      },
      {
        title: 'Placement Data Update Required',
        message:
          'Please update placement statistics for the current academic year. This data is crucial for policy planning.',
        createdBy: adminUser._id,
        priority: 'high',
        targetUniversities: universities.slice(0, 4).map((u) => u._id),
      },
    ]);
    console.log('📢 Created sample announcements');

    console.log('\n========================================');
    console.log('🎉 Database seeded successfully!');
    console.log('========================================');
    console.log('\nLogin Credentials:');
    console.log('─────────────────');
    console.log('Admin:      admin@gov.in / Admin@123!');
    console.log('University: indianinst@university.edu / University@123!');
    console.log('Student:    student1@student.edu / Student@123!');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Error:', error);
    process.exit(1);
  }
};

seedData();
