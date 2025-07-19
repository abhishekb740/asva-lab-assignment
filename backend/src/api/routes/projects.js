const express = require('express');
const { body, param } = require('express-validator');
const { authenticateToken, requireAnyRole } = require('../middleware/auth');
const { cacheProjects } = require('../middleware/cache');
const projectController = require('../controllers/projectController');

const router = express.Router();

router.get('/', authenticateToken, cacheProjects(), projectController.getProjects);

router.get('/:id', [
  authenticateToken,
  param('id').isInt().withMessage('Project ID must be a valid integer')
], projectController.getProject);

router.post('/', [
  authenticateToken,
  requireAnyRole('user', 'admin'),
  body('name').trim().isLength({ min: 1, max: 255 }).withMessage('Project name is required and must be less than 255 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters')
], projectController.createProject);

router.put('/:id', [
  authenticateToken,
  requireAnyRole('user', 'admin'),
  param('id').isInt().withMessage('Project ID must be a valid integer'),
  body('name').trim().isLength({ min: 1, max: 255 }).withMessage('Project name is required and must be less than 255 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters')
], projectController.updateProject);

router.delete('/:id', [
  authenticateToken,
  requireAnyRole('user', 'admin'),
  param('id').isInt().withMessage('Project ID must be a valid integer')
], projectController.deleteProject);

module.exports = router; 
