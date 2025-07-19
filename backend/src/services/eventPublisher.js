const { producer, isConnected } = require('../config/kafka');

class EventPublisher {
  static async publishEvent(topic, eventType, data) {
    try {
      if (!isConnected()) {
        console.log(`Kafka not connected, skipping event: ${eventType}`);
        return;
      }

      const event = {
        eventType,
        eventId: `${eventType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        data
      };

      await producer.send({
        topic,
        messages: [{
          key: data.id?.toString() || 'unknown',
          value: JSON.stringify(event),
          headers: {
            eventType,
            timestamp: event.timestamp
          }
        }]
      });

      console.log(`Event published: ${eventType} - ID: ${data.id}`);
    } catch (error) {
      console.error(`Failed to publish event ${eventType}:`, error.message);
    }
  }

  static async userRegistered(user) {
    await this.publishEvent('user-events', 'user.registered', {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.created_at
    });
  }

  static async projectCreated(project) {
    await this.publishEvent('project-events', 'project.created', {
      id: project.id,
      name: project.name,
      description: project.description,
      userId: project.user_id,
      createdAt: project.created_at
    });
  }

  static async projectUpdated(project) {
    await this.publishEvent('project-events', 'project.updated', {
      id: project.id,
      name: project.name,
      description: project.description,
      userId: project.user_id,
      updatedAt: project.updated_at
    });
  }

  static async projectDeleted(projectId, userId) {
    await this.publishEvent('project-events', 'project.deleted', {
      id: projectId,
      userId: userId,
      deletedAt: new Date().toISOString()
    });
  }

  static async taskCreated(task) {
    await this.publishEvent('task-events', 'task.created', {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      projectId: task.project_id,
      createdAt: task.created_at
    });
  }

  static async taskUpdated(task) {
    await this.publishEvent('task-events', 'task.updated', {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      projectId: task.project_id,
      updatedAt: task.updated_at
    });
  }

  static async taskDeleted(taskId, projectId) {
    await this.publishEvent('task-events', 'task.deleted', {
      id: taskId,
      projectId: projectId,
      deletedAt: new Date().toISOString()
    });
  }
}

module.exports = EventPublisher; 
