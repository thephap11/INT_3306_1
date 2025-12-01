import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function createAdminAccount() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '123456789',
        database: process.env.DB_NAME || 'quanlysanbong'
    });

    try {
        console.log('🔌 Connected to database');

        // Delete old account if exists (username: babyh21007)
        const [deleted] = await connection.execute(
            'DELETE FROM person WHERE username = ? OR username = ?',
            ['babyh21007', 'babyh21007@gmail.com']
        );

        if (deleted.affectedRows > 0) {
            console.log('🗑️  Deleted old admin account(s)');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash('monmoncute@123', 10);

        // Insert new admin account with email as username
        const [result] = await connection.execute(
            `INSERT INTO person (person_name, username, password, role, email) 
             VALUES (?, ?, ?, ?, ?)`,
            ['Admin', 'babyh21007@gmail.com', hashedPassword, 'admin', 'babyh21007@gmail.com']
        );

        console.log('✅ Admin account created successfully!');
        console.log('📝 Details:');
        console.log('   - Username: babyh21007@gmail.com');
        console.log('   - Email: babyh21007@gmail.com');
        console.log('   - Password: monmoncute@123');
        console.log('   - Role: admin');
        console.log('   - Person ID:', result.insertId);

    } catch (error) {
        console.error('❌ Error creating admin account:', error.message);
        throw error;
    } finally {
        await connection.end();
        console.log('🔌 Database connection closed');
    }
}

// Run the function
createAdminAccount()
    .then(() => {
        console.log('\n✅ Script completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Script failed:', error);
        process.exit(1);
    });
