const { PrismaClient } = require('@prisma/client');

// Create a single instance of Prisma Client to be used across the application
const prisma = new PrismaClient();

module.exports = { prisma };