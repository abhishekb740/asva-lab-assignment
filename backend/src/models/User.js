const pool = require('../config/database');

class User {
  static async create({ email, password_hash, role = 'user' }) {
    const query = `
      INSERT INTO users (email, password_hash, role)
      VALUES ($1, $2, $3)
      RETURNING id, email, role, created_at, updated_at
    `;
    
    const result = await pool.query(query, [email, password_hash, role]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = `
      SELECT id, email, password_hash, role, created_at, updated_at
      FROM users
      WHERE email = $1
    `;
    
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  static async findById(id) {
    const query = `
      SELECT id, email, role, created_at, updated_at
      FROM users
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async emailExists(email) {
    const query = `
      SELECT COUNT(*) as count
      FROM users
      WHERE email = $1
    `;
    
    const result = await pool.query(query, [email]);
    return parseInt(result.rows[0].count) > 0;
  }
}

module.exports = User;
