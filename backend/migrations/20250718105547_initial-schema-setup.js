exports.shorthands = undefined;

exports.up = (pgm) => {
  // Create users table
  pgm.createTable('users', {
    id: 'id',
    email: { type: 'varchar(255)', notNull: true, unique: true },
    password_hash: { type: 'varchar(255)', notNull: true },
    role: { type: 'varchar(50)', notNull: true, default: 'user' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Create projects table
  pgm.createTable('projects', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Create tasks table
  pgm.createTable('tasks', {
    id: 'id',
    title: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    status: { type: 'varchar(50)', notNull: true, default: 'todo' },
    project_id: {
      type: 'integer',
      notNull: true,
      references: '"projects"',
      onDelete: 'cascade',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Create indexes for better performance
  pgm.createIndex('users', 'email');
  pgm.createIndex('projects', 'user_id');
  pgm.createIndex('tasks', 'project_id');
  pgm.createIndex('tasks', 'status');
};

exports.down = (pgm) => {
  
  pgm.dropTable('tasks');
  pgm.dropTable('projects');
  pgm.dropTable('users');
};
