const redisClient = require('../../config/redis');

function createCacheKey(req) {
  const { userId, role } = req.user;
  
  if (role === 'admin') {
    return 'projects:admin:all';
  } else {
    return `projects:user:${userId}`;
  }
}

function cacheProjects() {
  return async (req, res, next) => {
    try {
      if (!redisClient.isReady) {
        console.log('Redis not ready, skipping cache');
        return next();
      }

      const cacheKey = createCacheKey(req);
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        console.log(`Cache HIT for key: ${cacheKey}`);
        const projects = JSON.parse(cachedData);
        return res.json({
          projects,
          count: projects.length,
          cached: true
        });
      }

      console.log(`Cache MISS for key: ${cacheKey}`);
      
      const originalJson = res.json;
      res.json = function(body) {
        if (body.projects && !body.error) {
          const ttl = parseInt(process.env.CACHE_TTL) || 300;
          redisClient.setEx(cacheKey, ttl, JSON.stringify(body.projects))
            .then(() => console.log(`Cached projects for key: ${cacheKey}, TTL: ${ttl}s`))
            .catch(err => console.error('Error caching projects:', err.message));
        }
        
        originalJson.call(this, body);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error.message);
      next();
    }
  };
}

async function invalidateProjectsCache(userId = null) {
  try {
    if (!redisClient.isReady) {
      console.log('Redis not ready, skipping cache invalidation');
      return;
    }

    const keysToDelete = ['projects:admin:all'];
    
    if (userId) {
      keysToDelete.push(`projects:user:${userId}`);
    }

    for (const key of keysToDelete) {
      await redisClient.del(key);
      console.log(`Invalidated cache for key: ${key}`);
    }
  } catch (error) {
    console.error('Error invalidating cache:', error.message);
  }
}

module.exports = {
  cacheProjects,
  invalidateProjectsCache
}; 
