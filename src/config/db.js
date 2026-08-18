const mysql = require('mysql2/promise');
const config = require('./env');

const pool = mysql.createPool({
    ...config.db,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function withConnection(callback) {
    const connection = await pool.getConnection();

    try {
        return await callback(connection);
    } finally {
        connection.release();
    }
}

async function withTransaction(callback) {
    return withConnection(async connection => {
        await connection.beginTransaction();

        try {
            const result = await callback(connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    });
}

module.exports = {
    pool,
    withConnection,
    withTransaction
};
