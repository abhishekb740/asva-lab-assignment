const pool = require('../config/database');

class Task {
  static async create({ title, description, status = 'todo', project_id }) {
    const query = `
      INSERT INTO tasks (title, description, status, project_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, title, description, status, project_id, created_at, updated_at
    `;
    
    const result = await pool.query(query, [title, description, status, project_id]);
    return result.rows[0];
  }

  static async findByProjectId(project_id) {
    const query = `
      SELECT id, title, description, status, project_id, created_at, updated_at
      FROM tasks
      WHERE project_id = $1
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query, [project_id]);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT id, title, description, status, project_id, created_at, updated_at
      FROM tasks
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async update(id, { title, description, status }) {
    const query = `
      UPDATE tasks 
      SET title = $1, description = $2, status = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, title, description, status, project_id, created_at, updated_at
    `;

    const result = await pool.query(query, [title, description, status, id]);
    return result.rows[0] || null;
  }

  static async delete(id) {
    const query = `DELETE FROM tasks WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }
}

module.exports = Task; 
