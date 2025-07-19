const express = require('express');
const { body, param } = require('express-validator');
const { authenticateToken, requireAnyRole } = require('../middleware/auth');
const taskController = require('../controllers/taskController');

const router = express.Router({ mergeParams: true });

router.get('/', [
  authenticateToken,
  param('projectId').isInt().withMessage('Project ID must be a valid integer')
], taskController.getTasks);

router.get('/:id', [
  authenticateToken,
  param('projectId').isInt().withMessage('Project ID must be a valid integer'),
  param('id').isInt().withMessage('Task ID must be a valid integer')
], taskController.getTask);

router.post('/', [
  authenticateToken,
  requireAnyRole('user', 'admin'),
  param('projectId').isInt().withMessage('Project ID must be a valid integer'),
  body('title').trim().isLength({ min: 1, max: 255 }).withMessage('Task title is required and must be less than 255 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('status').optional().isIn(['todo', 'in_progress', 'completed']).withMessage('Status must be todo, in_progress, or completed')
], taskController.createTask);

router.put('/:id', [
  authenticateToken,
  requireAnyRole('user', 'admin'),
  param('projectId').isInt().withMessage('Project ID must be a valid integer'),
  param('id').isInt().withMessage('Task ID must be a valid integer'),
  body('title').trim().isLength({ min: 1, max: 255 }).withMessage('Task title is required and must be less than 255 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('status').isIn(['todo', 'in_progress', 'completed']).withMessage('Status must be todo, in_progress, or completed')
], taskController.updateTask);

router.delete('/:id', [
  authenticateToken,
  requireAnyRole('user', 'admin'),
  param('projectId').isInt().withMessage('Project ID must be a valid integer'),
  param('id').isInt().withMessage('Task ID must be a valid integer')
], taskController.deleteTask);

module.exports = router; 
