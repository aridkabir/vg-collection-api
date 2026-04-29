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
      { name: 'Sega Master System™', manufacturer: 'Sega', releaseYear: 1985 },
      { name: 'Nintendo Entertainment System™ (NES) / Family Computer (Famicom)', manufacturer: 'Nintendo', releaseYear: 1985 },
      { name: 'Game Boy®', manufacturer: 'Nintendo', releaseYear: 1989 },
      { name: 'Sega Genesis™ / Mega Drive', manufacturer: 'Sega', releaseYear: 1989 },
      { name: 'Super Nintendo Entertainment System™ (SNES) / Super Famicom', manufacturer: 'Nintendo', releaseYear: 1990 },
      { name: 'Sega CD™ / Mega CD', manufacturer: 'Sega', releaseYear: 1991 },
      { name: 'PlayStation®', manufacturer: 'Sony', releaseYear: 1994 },
      { name: 'Sega Saturn™', manufacturer: 'Sega', releaseYear: 1994 },
      { name: 'Microsoft Windows 95®', manufacturer: 'Microsoft', releaseYear: 1995 },
      { name: 'Nintendo 64™', manufacturer: 'Nintendo', releaseYear: 1996 },
      { name: 'Game Boy Color®', manufacturer: 'Nintendo', releaseYear: 1998 },
      { name: 'Dreamcast™', manufacturer: 'Sega', releaseYear: 1998 },
      { name: 'PlayStation®2', manufacturer: 'Sony', releaseYear: 2000 },
      { name: 'Game Boy Advance®', manufacturer: 'Nintendo', releaseYear: 2001 },
      { name: 'Nintendo GameCube™', manufacturer: 'Nintendo', releaseYear: 2001 },
      { name: 'Xbox®', manufacturer: 'Microsoft', releaseYear: 2001 },
      { name: 'Microsoft Windows XP®', manufacturer: 'Microsoft', releaseYear: 2001 },
      { name: 'Nintendo DS™', manufacturer: 'Nintendo', releaseYear: 2004 },
      { name: 'Xbox 360®', manufacturer: 'Microsoft', releaseYear: 2005 },
      { name: 'PlayStation®3', manufacturer: 'Sony', releaseYear: 2006 },
      { name: 'Wii™', manufacturer: 'Nintendo', releaseYear: 2006 },
      { name: 'Microsoft Windows 7®', manufacturer: 'Microsoft', releaseYear: 2009 },
      { name: 'Nintendo 3DS™', manufacturer: 'Nintendo', releaseYear: 2011 },
      { name: 'Wii U™', manufacturer: 'Nintendo', releaseYear: 2012 },
      { name: 'PlayStation®4', manufacturer: 'Sony', releaseYear: 2013 },
      { name: 'Xbox One®', manufacturer: 'Microsoft', releaseYear: 2013 },
      { name: 'New Nintendo 3DS™', manufacturer: 'Nintendo', releaseYear: 2014 },
      { name: 'Microsoft Windows 10+®', manufacturer: 'Microsoft', releaseYear: 2015 },
      { name: 'Nintendo Switch™', manufacturer: 'Nintendo', releaseYear: 2017 },
      { name: 'Mac OS X (Pre-10.14)', manufacturer: 'Apple', releaseYear: 2018 },
      { name: 'macOS 10.15+ (Intel)', manufacturer: 'Apple', releaseYear: 2019 },
      { name: 'PlayStation®5', manufacturer: 'Sony', releaseYear: 2020 },
      { name: 'Xbox Series X®', manufacturer: 'Microsoft', releaseYear: 2020 },
      { name: 'macOS (Apple Silicon)', manufacturer: 'Apple', releaseYear: 2020 },
      { name: 'Nintendo Switch™ 2', manufacturer: 'Nintendo', releaseYear: 2025 },
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
      { gameId: eldenRing.id, platformId: platformMap['PlayStation®4'] },
      { gameId: eldenRing.id, platformId: platformMap['Xbox One®'] },
      { gameId: eldenRing.id, platformId: platformMap['Microsoft Windows 10+®'] },
      { gameId: eldenRing.id, platformId: platformMap['PlayStation®5'] },
      { gameId: eldenRing.id, platformId: platformMap['Xbox Series X®'] },

      { gameId: spiderMan2.id, platformId: platformMap['PlayStation®5'] },
      { gameId: spiderMan2.id, platformId: platformMap['Microsoft Windows 10+®'] },

      { gameId: breathOfTheWild.id, platformId: platformMap['Nintendo Switch™'] },
      { gameId: breathOfTheWild.id, platformId: platformMap['Nintendo Switch™ 2'] },
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
      { collectionId: collection.id, gameId: eldenRing.id },
      { collectionId: collection.id, gameId: spiderMan2.id },
      { collectionId: collection.id, gameId: breathOfTheWild.id },
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