const pool = require('../config/database');

class Project {
  static async create({ name, description, user_id }) {
    const query = `
      INSERT INTO projects (name, description, user_id)
      VALUES ($1, $2, $3)
      RETURNING id, name, description, user_id, created_at, updated_at
    `;
    
    const result = await pool.query(query, [name, description, user_id]);
    return result.rows[0];
  }

  static async findByUserId(user_id) {
    const query = `
      SELECT id, name, description, user_id, created_at, updated_at
      FROM projects
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query, [user_id]);
    return result.rows;
  }

  static async findAll() {
    const query = `
      SELECT id, name, description, user_id, created_at, updated_at
      FROM projects
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT id, name, description, user_id, created_at, updated_at
      FROM projects
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async update(id, { name, description }) {
    const query = `
      UPDATE projects 
      SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, name, description, user_id, created_at, updated_at
    `;

    const result = await pool.query(query, [name, description, id]);
    return result.rows[0] || null;
  }

  static async delete(id) {
    const query = `DELETE FROM projects WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }
}

module.exports = Project; 
