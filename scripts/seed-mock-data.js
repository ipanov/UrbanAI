// Mock Data Seeding Script for UrbanAI Database
// This script populates the database with sample issues for testing and development

const { Pool } = require('pg');
require('dotenv').config();

// Database connection configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'UrbanAIDb',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'your_password',
});

// Sample mock data for issues
const mockIssues = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing damage to vehicles on Main Street near the intersection with Oak Avenue. The hole is approximately 2 feet wide and 6 inches deep, creating a significant hazard for drivers.',
    status: 'Open',
    latitude: 40.7589,
    longitude: -73.9851,
    photoUrl: null,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    title: 'Broken Street Light',
    description: 'Street light not working on Elm Street, making the area unsafe for pedestrians at night. The light has been out for over a week and needs immediate attention.',
    status: 'In Progress',
    latitude: 40.7505,
    longitude: -73.9934,
    photoUrl: null,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    title: 'Graffiti on Public Building',
    description: 'Vandalism on the side of the community center building. Large graffiti tags covering approximately 20 square feet of the brick wall facing the parking lot.',
    status: 'Resolved',
    latitude: 40.7614,
    longitude: -73.9776,
    photoUrl: null,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    title: 'Overflowing Trash Bin',
    description: 'Public trash bin at Central Park entrance is overflowing with garbage scattered around the area. Attracting pests and creating an unsanitary condition.',
    status: 'Open',
    latitude: 40.7831,
    longitude: -73.9712,
    photoUrl: null,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    title: 'Damaged Sidewalk',
    description: 'Cracked and uneven sidewalk on Broadway creating tripping hazards for pedestrians. Several concrete sections are raised and broken, especially dangerous for elderly residents.',
    status: 'In Progress',
    latitude: 40.7580,
    longitude: -73.9855,
    photoUrl: null,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    title: 'Illegal Parking Blocking Fire Hydrant',
    description: 'Vehicle consistently parked in front of fire hydrant on 5th Avenue, blocking emergency access. The car has been there for several days without moving.',
    status: 'Open',
    latitude: 40.7639,
    longitude: -73.9730,
    photoUrl: null,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    title: 'Noise Complaint - Construction',
    description: 'Construction work starting before permitted hours (before 7 AM) on weekdays at the downtown development site. Heavy machinery and loud noises disrupting residents.',
    status: 'Resolved',
    latitude: 40.7549,
    longitude: -73.9840,
    photoUrl: null,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 days ago
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440008',
    title: 'Water Main Leak',
    description: 'Water continuously leaking from underground pipe on Maple Street. Creating a large puddle and potentially wasting significant amounts of water.',
    status: 'In Progress',
    latitude: 40.7692,
    longitude: -73.9442,
    photoUrl: null,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
  }
];

// Sample users data
const mockUsers = [
  {
    id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    username: 'test.user@urbanai.com',
    email: 'test.user@urbanai.com',
    role: 'User',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
  },
  {
    id: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
    username: 'demo.admin@urbanai.com',
    email: 'demo.admin@urbanai.com',
    role: 'Admin',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000) // 45 days ago
  }
];

async function clearExistingData() {
  console.log('🧹 Clearing existing data...');
  
  try {
    // Clear issues first (due to foreign key constraints)
    await pool.query('DELETE FROM "Issues"');
    console.log('   ✅ Cleared Issues table');
    
    // Clear users
    await pool.query('DELETE FROM "Users"');
    console.log('   ✅ Cleared Users table');
    
    console.log('✨ Existing data cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing existing data:', error.message);
    throw error;
  }
}

async function seedUsers() {
  console.log('👥 Seeding users...');
  
  const insertUserQuery = `
    INSERT INTO "Users" ("Id", "Username", "Email", "Role", "CreatedAt", "UpdatedAt")
    VALUES ($1, $2, $3, $4, $5, $6)
  `;
  
  try {
    for (const user of mockUsers) {
      await pool.query(insertUserQuery, [
        user.id,
        user.username,
        user.email,
        user.role,
        user.createdAt,
        new Date()
      ]);
      console.log(`   ✅ Created user: ${user.username}`);
    }
    console.log(`✨ Successfully seeded ${mockUsers.length} users!`);
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
    throw error;
  }
}

async function seedIssues() {
  console.log('📋 Seeding issues...');
  
  const insertIssueQuery = `
    INSERT INTO "Issues" ("Id", "Title", "Description", "Status", "Latitude", "Longitude", "PhotoUrl", "CreatedAt")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `;
  
  try {
    for (const issue of mockIssues) {
      await pool.query(insertIssueQuery, [
        issue.id,
        issue.title,
        issue.description,
        issue.status,
        issue.latitude,
        issue.longitude,
        issue.photoUrl,
        issue.createdAt
      ]);
      console.log(`   ✅ Created issue: ${issue.title}`);
    }
    console.log(`✨ Successfully seeded ${mockIssues.length} issues!`);
  } catch (error) {
    console.error('❌ Error seeding issues:', error.message);
    throw error;
  }
}

async function verifyData() {
  console.log('🔍 Verifying seeded data...');
  
  try {
    const userCount = await pool.query('SELECT COUNT(*) FROM "Users"');
    const issueCount = await pool.query('SELECT COUNT(*) FROM "Issues"');
    
    console.log(`   📊 Users in database: ${userCount.rows[0].count}`);
    console.log(`   📊 Issues in database: ${issueCount.rows[0].count}`);
    
    // Show status distribution
    const statusQuery = await pool.query('SELECT "Status", COUNT(*) FROM "Issues" GROUP BY "Status"');
    console.log('   📊 Issue status distribution:');
    statusQuery.rows.forEach(row => {
      console.log(`      ${row.Status}: ${row.count}`);
    });
    
    console.log('✨ Data verification completed!');
  } catch (error) {
    console.error('❌ Error verifying data:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting UrbanAI mock data seeding...\n');
  
  try {
    // Test database connection
    console.log('🔌 Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('   ✅ Database connection successful!\n');
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    if (process.argv.includes('--clear')) {
      await clearExistingData();
      console.log('');
    }
    
    // Seed data
    await seedUsers();
    console.log('');
    await seedIssues();
    console.log('');
    
    // Verify the seeded data
    await verifyData();
    
    console.log('\n🎉 Mock data seeding completed successfully!');
    console.log('\n💡 Usage:');
    console.log('   - Run with --clear to clear existing data first');
    console.log('   - Use this data to test the UrbanAI dashboard and features');
    console.log('   - The seeded issues include various statuses and realistic scenarios');
    
  } catch (error) {
    console.error('\n💥 Seeding failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('   - Ensure PostgreSQL is running');
    console.error('   - Check database connection settings in .env file');
    console.error('   - Verify database schema is properly migrated');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Handle script arguments
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  mockIssues,
  mockUsers,
  seedUsers,
  seedIssues,
  clearExistingData
};