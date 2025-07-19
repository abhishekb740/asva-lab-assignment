const { validationResult } = require('express-validator');
const Project = require('../../models/Project');
const { invalidateProjectsCache } = require('../middleware/cache');
const EventPublisher = require('../../services/eventPublisher');

const projectController = {
  async getProjects(req, res) {
    try {
      const { userId, role } = req.user;

      let projects;
      if (role === 'admin') {
        projects = await Project.findAll();
      } else {
        projects = await Project.findByUserId(userId);
      }

      res.json({
        projects,
        count: projects.length
      });
    } catch (error) {
      console.error('Get projects error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  },

  async getProject(req, res) {
    try {
      const { userId, role } = req.user;
      const { id } = req.params;

      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({
          error: 'Project not found'
        });
      }

      if (role !== 'admin' && project.user_id !== userId) {
        return res.status(403).json({
          error: 'Access denied'
        });
      }

      res.json({ project });
    } catch (error) {
      console.error('Get project error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  },

  async createProject(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { userId } = req.user;
      const { name, description } = req.body;

      const newProject = await Project.create({
        name,
        description: description || null,
        user_id: userId
      });

      await EventPublisher.projectCreated(newProject);

      await invalidateProjectsCache(userId);

      res.status(201).json({
        message: 'Project created successfully',
        project: newProject
      });
    } catch (error) {
      console.error('Create project error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  },

  async updateProject(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { userId, role } = req.user;
      const { id } = req.params;
      const { name, description } = req.body;

      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({
          error: 'Project not found'
        });
      }

      if (role !== 'admin' && project.user_id !== userId) {
        return res.status(403).json({
          error: 'Access denied'
        });
      }

      const updatedProject = await Project.update(id, { name, description });

      await EventPublisher.projectUpdated(updatedProject);

      await invalidateProjectsCache(project.user_id);

      res.json({
        message: 'Project updated successfully',
        project: updatedProject
      });
    } catch (error) {
      console.error('Update project error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  },

  async deleteProject(req, res) {
    try {
      const { userId, role } = req.user;
      const { id } = req.params;

      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({
          error: 'Project not found'
        });
      }

      if (role !== 'admin' && project.user_id !== userId) {
        return res.status(403).json({
          error: 'Access denied'
        });
      }

      await Project.delete(id);

      await EventPublisher.projectDeleted(parseInt(id), project.user_id);

      await invalidateProjectsCache(project.user_id);

      res.json({
        message: 'Project deleted successfully'
      });
    } catch (error) {
      console.error('Delete project error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
};

module.exports = projectController; 
