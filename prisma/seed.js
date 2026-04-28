import 'dotenv/config';
import bcrypt from 'bcrypt';
import prisma from '../src/config/db.js';

async function main() {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "CollectionGame",
      "GamePlatform",
      "Collection",
      "Game",
      "Platform",
      "User"
    RESTART IDENTITY CASCADE;
  `);

  const password = await bcrypt.hash('Password123!', 10);

  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password,
      role: 'user',
    },
  });

  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password,
      role: 'admin',
    },
  });

  await prisma.platform.createMany({
    data: [
      { name: 'Sega Master System™', manufacturer: 'Sega' },
      { name: 'Nintendo Entertainment System™ (NES) / Family Computer (Famicom)', manufacturer: 'Nintendo' },
      { name: 'Game Boy®', manufacturer: 'Nintendo' },
      { name: 'Sega Genesis™ / Mega Drive', manufacturer: 'Sega' },
      { name: 'Super Nintendo Entertainment System™ (SNES) / Super Famicom', manufacturer: 'Nintendo' },
      { name: 'Sega CD™ / Mega CD', manufacturer: 'Sega' },
      { name: 'PlayStation®', manufacturer: 'Sony' },
      { name: 'Sega Saturn™', manufacturer: 'Sega' },
      { name: 'Microsoft Windows 95®', manufacturer: 'Microsoft' },
      { name: 'Nintendo 64™', manufacturer: 'Nintendo' },
      { name: 'Game Boy Color®', manufacturer: 'Nintendo' },
      { name: 'Dreamcast™', manufacturer: 'Sega' },
      { name: 'PlayStation®2', manufacturer: 'Sony' },
      { name: 'Game Boy Advance®', manufacturer: 'Nintendo' },
      { name: 'Nintendo GameCube™', manufacturer: 'Nintendo' },
      { name: 'Xbox®', manufacturer: 'Microsoft' },
      { name: 'Microsoft Windows XP®', manufacturer: 'Microsoft' },
      { name: 'Nintendo DS™', manufacturer: 'Nintendo' },
      { name: 'Xbox 360®', manufacturer: 'Microsoft' },
      { name: 'PlayStation®3', manufacturer: 'Sony' },
      { name: 'Wii™', manufacturer: 'Nintendo' },
      { name: 'Microsoft Windows 7®', manufacturer: 'Microsoft' },
      { name: 'Nintendo 3DS™', manufacturer: 'Nintendo' },
      { name: 'Wii U™', manufacturer: 'Nintendo' },
      { name: 'PlayStation®4', manufacturer: 'Sony' },
      { name: 'Xbox One®', manufacturer: 'Microsoft' },
      { name: 'New Nintendo 3DS™', manufacturer: 'Nintendo' },
      { name: 'Microsoft Windows 10+®', manufacturer: 'Microsoft' },
      { name: 'Nintendo Switch™', manufacturer: 'Nintendo' },
      { name: 'Mac OS X (Pre-10.14)', manufacturer: 'Apple' },
      { name: 'macOS 10.15+ (Intel)', manufacturer: 'Apple' },
      { name: 'PlayStation®5', manufacturer: 'Sony' },
      { name: 'Xbox Series X®', manufacturer: 'Microsoft' },
      { name: 'macOS (Apple Silicon)', manufacturer: 'Apple' },
      { name: 'Nintendo Switch™ 2', manufacturer: 'Nintendo' },
    ],
  });

  const platforms = await prisma.platform.findMany();

  const platformMap = {};

  platforms.forEach((platform) => {
    platformMap[platform.name] = platform.id;
  });

  const eldenRing = await prisma.game.create({
    data: {
      title: 'Elden Ring',
      genre: 'RPG',
      releaseYear: 2022,
    },
  });

  const spiderMan2 = await prisma.game.create({
    data: {
      title: 'Spider-Man 2',
      genre: 'Action',
      releaseYear: 2023,
    },
  });

  const breathOfTheWild = await prisma.game.create({
    data: {
      title: 'The Legend of Zelda: Breath of the Wild',
      genre: 'Action-Adventure',
      releaseYear: 2017,
    },
  });

  await prisma.gamePlatform.createMany({
  data: [
    // Elden Ring
    {
      gameId: eldenRing.id,
      platformId: platformMap['PlayStation®4'],
    },
    {
      gameId: eldenRing.id,
      platformId: platformMap['Xbox One®'],
    },
    {
      gameId: eldenRing.id,
      platformId: platformMap['Microsoft Windows 10+®'],
    },
    {
      gameId: eldenRing.id,
      platformId: platformMap['PlayStation®5'],
    },
    {
      gameId: eldenRing.id,
      platformId: platformMap['Xbox Series X®'],
    },

    // Spider-Man 2
    {
      gameId: spiderMan2.id,
      platformId: platformMap['PlayStation®5'],
    },
    {
      gameId: spiderMan2.id,
      platformId: platformMap['Microsoft Windows 10+®'],
    },

    // Breath of the Wild
    {
      gameId: breathOfTheWild.id,
      platformId: platformMap['Nintendo Switch™'],
    },
    {
      gameId: breathOfTheWild.id,
      platformId: platformMap['Nintendo Switch™ 2'],
    },
  ],
});

  const collection = await prisma.collection.create({
    data: {
      name: 'My Collection',
      userId: user.id,
    },
  });

  await prisma.collectionGame.createMany({
    data: [
      {
        collectionId: collection.id,
        gameId: eldenRing.id,
      },
      {
        collectionId: collection.id,
        gameId: spiderMan2.id,
      },
      {
        collectionId: collection.id,
        gameId: breathOfTheWild.id,
      },
    ],
  });

  console.log('🌱 Seeded database successfully');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });