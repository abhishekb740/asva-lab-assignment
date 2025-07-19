const { validationResult } = require('express-validator');
const Task = require('../../models/Task');
const Project = require('../../models/Project');
const EventPublisher = require('../../services/eventPublisher');

const taskController = {
  async getTasks(req, res) {
    try {
      const { userId, role } = req.user;
      const { projectId } = req.params;

      const project = await Project.findById(projectId);
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

      const tasks = await Task.findByProjectId(projectId);

      res.json({
        tasks,
        count: tasks.length
      });
    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  },

  async getTask(req, res) {
    try {
      const { userId, role } = req.user;
      const { projectId, id } = req.params;

      const project = await Project.findById(projectId);
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

      const task = await Task.findById(id);
      if (!task || task.project_id != projectId) {
        return res.status(404).json({
          error: 'Task not found'
        });
      }

      res.json({ task });
    } catch (error) {
      console.error('Get task error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  },

  async createTask(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { userId, role } = req.user;
      const { projectId } = req.params;
      const { title, description, status } = req.body;

      const project = await Project.findById(projectId);
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

      const newTask = await Task.create({
        title,
        description: description || null,
        status: status || 'todo',
        project_id: projectId
      });

      await EventPublisher.taskCreated(newTask);

      res.status(201).json({
        message: 'Task created successfully',
        task: newTask
      });
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  },

  async updateTask(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { userId, role } = req.user;
      const { projectId, id } = req.params;
      const { title, description, status } = req.body;

      const project = await Project.findById(projectId);
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

      const task = await Task.findById(id);
      if (!task || task.project_id != projectId) {
        return res.status(404).json({
          error: 'Task not found'
        });
      }

      const updatedTask = await Task.update(id, { title, description, status });

      await EventPublisher.taskUpdated(updatedTask);

      res.json({
        message: 'Task updated successfully',
        task: updatedTask
      });
    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  },

  async deleteTask(req, res) {
    try {
      const { userId, role } = req.user;
      const { projectId, id } = req.params;

      const project = await Project.findById(projectId);
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

      const task = await Task.findById(id);
      if (!task || task.project_id != projectId) {
        return res.status(404).json({
          error: 'Task not found'
        });
      }

      await Task.delete(id);

      await EventPublisher.taskDeleted(parseInt(id), parseInt(projectId));

      res.json({
        message: 'Task deleted successfully'
      });
    } catch (error) {
      console.error('Delete task error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
};

module.exports = taskController; 
