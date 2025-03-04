import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { Kafka } from 'kafkajs';
import winston from 'winston';

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
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Маршрути API будуть додані пізніше
// app.use('/api/v1/entities', entityRoutes);
// app.use('/api/v1/fields', fieldRoutes);

// Підключення до MongoDB
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/nc-crm-metadata';
        await mongoose.connect(mongoURI);
        logger.info('MongoDB підключено успішно');
    } catch (error) {
        logger.error('Помилка підключення до MongoDB:', error);
        process.exit(1);
    }
};

// Ініціалізація Kafka клієнта
const kafka = new Kafka({
    clientId: 'metadata-service',
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(',')
});

// Створення Kafka продюсера і консьюмера
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'metadata-service-group' });

// Функція для підключення до Kafka
const connectKafka = async () => {
    try {
        await producer.connect();
        await consumer.connect();
        logger.info('Kafka підключено успішно');

        // Підписка на теми
        await consumer.subscribe({ topics: ['entity-created', 'entity-updated', 'entity-deleted'] });

        // Обробка повідомлень
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                if (message.value) {
                    const payload = JSON.parse(message.value.toString());
                    logger.info(`Отримано повідомлення з теми ${topic}:`, payload);
                    // Логіка обробки повідомлень буде додана пізніше
                }
            }
        });
    } catch (error) {
        logger.error('Помилка підключення до Kafka:', error);
    }
};

// Старт сервера
const startServer = async () => {
    try {
        await connectDB();
        await connectKafka();

        app.listen(port, () => {
            logger.info(`Сервіс метаданих запущено на порту ${port}`);
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
export { app, connectDB, connectKafka };