// modules/low-code-platform/dynamic-data-service/src/index.ts

import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { Kafka } from 'kafkajs';
import winston from 'winston';

// Імпорт сервісів
import { ModelManager } from './services/model-manager.service';
import { DynamicDataService } from './services/dynamic-data.service';
import { KafkaHandler } from './services/kafka-handler.service';

// Ініціалізація конфігурації з .env файлу
dotenv.config();

// Налаштування логера
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

// Ініціалізація Express
const app: Application = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Підключення до MongoDB
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/nc-crm-data';
        await mongoose.connect(mongoURI);
        logger.info('MongoDB підключено успішно');
    } catch (error) {
        logger.error('Помилка підключення до MongoDB:', error);
        process.exit(1);
    }
};

// Ініціалізація Kafka клієнта
const kafka = new Kafka({
    clientId: 'dynamic-data-service',
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(',')
});

// Створення Kafka продюсера і консьюмера
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'dynamic-data-service-group' });

// Ініціалізація сервісів
const modelManager = new ModelManager(logger);
const dynamicDataService = new DynamicDataService(modelManager, logger);
const kafkaHandler = new KafkaHandler(modelManager, logger);

// Функція для підключення до Kafka
const connectKafka = async () => {
    try {
        await producer.connect();
        await consumer.connect();
        logger.info('Kafka підключено успішно');

        // Підписка на теми метаданих
        await consumer.subscribe({
            topics: [
                'entity-created', 'entity-updated', 'entity-deleted',
                'field-created', 'field-updated', 'field-deleted'
            ]
        });

        // Обробка повідомлень
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                if (message.value) {
                    const payload = JSON.parse(message.value.toString());
                    logger.info(`Отримано повідомлення з теми ${topic}:`, payload);

                    // Обробка подій
                    try {
                        switch (topic) {
                            case 'entity-created':
                                await kafkaHandler.handleEntityCreated(payload);
                                break;
                            case 'entity-updated':
                                await kafkaHandler.handleEntityUpdated(payload);
                                break;
                            case 'entity-deleted':
                                await kafkaHandler.handleEntityDeleted(payload);
                                break;
                            case 'field-created':
                                await kafkaHandler.handleFieldCreated(payload);
                                break;
                            case 'field-updated':
                                await kafkaHandler.handleFieldUpdated(payload);
                                break;
                            case 'field-deleted':
                                await kafkaHandler.handleFieldDeleted(payload);
                                break;
                        }
                    } catch (error) {
                        logger.error(`Помилка при обробці події ${topic}:`, error);
                    }
                }
            }
        });
    } catch (error) {
        logger.error('Помилка підключення до Kafka:', error);
    }
};

// Імпорт контролера та маршрутів
import { DynamicDataController } from './controllers/dynamic-data.controller';
import { createDynamicDataRoutes } from './routes/dynamic-data.routes';

// Ініціалізація контролера
const dynamicDataController = new DynamicDataController(dynamicDataService);

// Налаштування маршрутів API
app.use('/api/v1/data', createDynamicDataRoutes(dynamicDataController));

// Старт сервера
const startServer = async () => {
    try {
        await connectDB();
        await connectKafka();

        app.listen(port, () => {
            logger.info(`Сервіс динамічних даних запущено на порту ${port}`);
        });
    } catch (error) {
        logger.error('Помилка запуску сервісу:', error);
        process.exit(1);
    }
};

// Запуск сервера
startServer();

// Обробка некоректного закриття додатку
process.on('unhandledRejection', (error) => {
    logger.error('Необроблене відхилення промісу:', error);
    process.exit(1);
});

// Експорт для тестування
export { app, connectDB, connectKafka, modelManager, dynamicDataService };