import 'dotenv/config';
import bcrypt from 'bcrypt';
import prisma from '../src/config/db.js';

async function main() {
  // Clear existing data
  await prisma.collectionGame.deleteMany();
  await prisma.gamePlatform.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.game.deleteMany();
  await prisma.platform.deleteMany();
  await prisma.user.deleteMany();

  // Hash password
  const password = await bcrypt.hash('Password123!', 10);

  // Users
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password,
      role: 'user',
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password,
      role: 'admin',
    },
  });

  // Platforms
  const pc = await prisma.platform.create({
    data: { name: 'PC', manufacturer: 'Various' },
  });

  const ps5 = await prisma.platform.create({
    data: { name: 'PlayStation 5', manufacturer: 'Sony' },
  });

  // Games
  const game1 = await prisma.game.create({
    data: {
      title: 'Elden Ring',
      genre: 'RPG',
      releaseYear: 2022,
    },
  });

  const game2 = await prisma.game.create({
    data: {
      title: 'Spider-Man 2',
      genre: 'Action',
      releaseYear: 2023,
    },
  });

  // Game ↔ Platform
  await prisma.gamePlatform.createMany({
    data: [
      { gameId: game1.id, platformId: pc.id },
      { gameId: game1.id, platformId: ps5.id },
      { gameId: game2.id, platformId: ps5.id },
    ],
  });

  // Collection
  const collection = await prisma.collection.create({
    data: {
      name: 'My Collection',
      userId: user.id,
    },
  });

  // Collection ↔ Game
  await prisma.collectionGame.createMany({
    data: [
      { collectionId: collection.id, gameId: game1.id },
      { collectionId: collection.id, gameId: game2.id },
    ],
  });

  console.log('🌱 Seeded database successfully');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });