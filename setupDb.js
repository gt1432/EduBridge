const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setup() {
    try {
        console.log('Connecting to MySQL (XAMPP)...');
        // Connect to MySQL server first (without specifying a database)
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            multipleStatements: true // This allows us to run the entire init.sql file at once
        });

        console.log('Connected successfully!');
        
        // Read the SQL file
        const sqlPath = path.join(__dirname, 'init.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        
        console.log('Executing database queries... Please wait.');
        
        // Execute the script
        await connection.query(sql);

        console.log('\n✅ SUCCESS! The database "edubridge" and all tables have been completely set up.');
        console.log('You can now start the main server by running: npm run dev');
        
        await connection.end();
    } catch (err) {
        console.error('\n❌ ERROR setting up the database:', err.message);
        console.error('Please ensure XAMPP MySQL is turned ON.');
    }
}

setup();
