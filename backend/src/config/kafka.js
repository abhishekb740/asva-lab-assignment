const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'project-management-api',
  brokers: [`${process.env.KAFKA_HOST || 'localhost'}:${process.env.KAFKA_PORT || 9092}`],
  retry: {
    retries: 5,
    initialRetryTime: 300,
    maxRetryTime: 30000
  }
});

const producer = kafka.producer({
  allowAutoTopicCreation: true,
  transactionTimeout: 30000
});

let isKafkaConnected = false;

async function connectKafka() {
  try {
    await producer.connect();
    isKafkaConnected = true;
    console.log('Kafka producer connected successfully');
  } catch (error) {
    console.error('Failed to connect to Kafka:', error.message);
    console.log('Kafka will retry connection in background...');
    
    setTimeout(connectKafka, 5000);
  }
}

async function disconnectKafka() {
  try {
    if (isKafkaConnected) {
      await producer.disconnect();
      console.log('Kafka producer disconnected');
    }
  } catch (error) {
    console.error('Error disconnecting Kafka:', error.message);
  }
}

function isConnected() {
  return isKafkaConnected;
}

process.on('SIGINT', async () => {
  await disconnectKafka();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectKafka();
  process.exit(0);
});

module.exports = { kafka, producer, connectKafka, disconnectKafka, isConnected }; 
