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

  await prisma.user.create({
    data: {
      email: 'user2@example.com',
      password,
      role: 'user',
    },
  });

  await prisma.platform.createMany({
    data: [
      { name: 'Atari 2600™', manufacturer: 'Atari', releaseYear: 1977 },
      { name: 'Atari 5200™', manufacturer: 'Atari', releaseYear: 1982 },
      { name: 'Sega Master System™', manufacturer: 'Sega', releaseYear: 1985 },
      { name: 'Nintendo Entertainment System™ (NES) / Family Computer (Famicom)', manufacturer: 'Nintendo', releaseYear: 1985 },
      { name: 'Atari 7800™', manufacturer: 'Atari', releaseYear: 1986 },
      { name: 'PC Engine™ / TurboGrafx-16™', manufacturer: 'NEC', releaseYear: 1987 },
      { name: 'PC Engine CD-ROM²™ / TurboGrafx-CD™', manufacturer: 'NEC', releaseYear: 1988 },
      { name: 'Game Boy®', manufacturer: 'Nintendo', releaseYear: 1989 },
      { name: 'Sega Genesis™ / Mega Drive', manufacturer: 'Sega', releaseYear: 1989 },
      { name: 'Super Nintendo Entertainment System™ (SNES) / Super Famicom', manufacturer: 'Nintendo', releaseYear: 1990 },
      { name: 'Neo Geo AES™', manufacturer: 'SNK', releaseYear: 1990 },
      { name: 'Sega CD™ / Mega CD', manufacturer: 'Sega', releaseYear: 1991 },
      { name: 'Atari Jaguar™', manufacturer: 'Atari', releaseYear: 1993 },
      { name: 'PlayStation®', manufacturer: 'Sony', releaseYear: 1994 },
      { name: 'Sega Saturn™', manufacturer: 'Sega', releaseYear: 1994 },
      { name: 'Neo Geo CD™', manufacturer: 'SNK', releaseYear: 1994 },
      { name: 'Microsoft Windows 95®', manufacturer: 'Microsoft', releaseYear: 1995 },
      { name: 'Nintendo 64™', manufacturer: 'Nintendo', releaseYear: 1996 },
      { name: 'Game Boy Color®', manufacturer: 'Nintendo', releaseYear: 1998 },
      { name: 'Dreamcast™', manufacturer: 'Sega', releaseYear: 1998 },
      { name: 'Neo Geo Pocket™', manufacturer: 'SNK', releaseYear: 1998 },
      { name: 'Neo Geo Pocket Color™', manufacturer: 'SNK', releaseYear: 1999 },
      { name: 'PlayStation®2', manufacturer: 'Sony', releaseYear: 2000 },
      { name: 'Game Boy Advance®', manufacturer: 'Nintendo', releaseYear: 2001 },
      { name: 'Nintendo GameCube™', manufacturer: 'Nintendo', releaseYear: 2001 },
      { name: 'Xbox®', manufacturer: 'Microsoft', releaseYear: 2001 },
      { name: 'Microsoft Windows XP®', manufacturer: 'Microsoft', releaseYear: 2001 },
      { name: 'Mac OS X (Pre-10.14)', manufacturer: 'Apple', releaseYear: 2001 },
      { name: 'Nintendo DS™', manufacturer: 'Nintendo', releaseYear: 2004 },
      { name: 'PlayStation Portable™ (PSP)', manufacturer: 'Sony', releaseYear: 2004 },
      { name: 'Xbox 360®', manufacturer: 'Microsoft', releaseYear: 2005 },
      { name: 'PlayStation®3', manufacturer: 'Sony', releaseYear: 2006 },
      { name: 'Wii™', manufacturer: 'Nintendo', releaseYear: 2006 },
      { name: 'Microsoft Windows 7®', manufacturer: 'Microsoft', releaseYear: 2009 },
      { name: 'Nintendo 3DS™', manufacturer: 'Nintendo', releaseYear: 2011 },
      { name: 'PlayStation Vita™', manufacturer: 'Sony', releaseYear: 2011 },
      { name: 'Wii U™', manufacturer: 'Nintendo', releaseYear: 2012 },
      { name: 'PlayStation®4', manufacturer: 'Sony', releaseYear: 2013 },
      { name: 'Xbox One®', manufacturer: 'Microsoft', releaseYear: 2013 },
      { name: 'New Nintendo 3DS™', manufacturer: 'Nintendo', releaseYear: 2014 },
      { name: 'Microsoft Windows 10+®', manufacturer: 'Microsoft', releaseYear: 2015 },
      { name: 'Nintendo Switch™', manufacturer: 'Nintendo', releaseYear: 2017 },
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

  async function createGame(title, genre, releaseYear, platformNames) {
    const game = await prisma.game.create({
      data: {
        title,
        genre,
        releaseYear,
      },
    });

    await prisma.gamePlatform.createMany({
      data: platformNames.map((platformName) => ({
        gameId: game.id,
        platformId: platformMap[platformName],
      })),
    });

    return game;
  }

  const eldenRing = await createGame('Elden Ring', 'RPG', 2022, [
    'PlayStation®4',
    'Xbox One®',
    'Microsoft Windows 10+®',
    'PlayStation®5',
    'Xbox Series X®',
  ]);

  const spiderMan2 = await createGame('Spider-Man 2', 'Action', 2023, [
    'PlayStation®5',
    'Microsoft Windows 10+®',
  ]);

  const breathOfTheWild = await createGame(
    'The Legend of Zelda: Breath of the Wild',
    'Action-Adventure',
    2017,
    ['Nintendo Switch™', 'Nintendo Switch™ 2']
  );

  const minecraft = await createGame('Minecraft', 'Sandbox', 2011, [
    'Microsoft Windows 10+®',
    'PlayStation®4',
    'Xbox One®',
    'Nintendo Switch™',
    'PlayStation®5',
    'Xbox Series X®',
  ]);

  const gta5 = await createGame('Grand Theft Auto V', 'Action-Adventure', 2013, [
    'PlayStation®3',
    'Xbox 360®',
    'PlayStation®4',
    'Xbox One®',
    'Microsoft Windows 10+®',
    'PlayStation®5',
    'Xbox Series X®',
  ]);

  const wiiSports = await createGame('Wii Sports', 'Sports', 2006, ['Wii™']);

  const marioKart8 = await createGame('Mario Kart 8 Deluxe', 'Racing', 2017, [
    'Nintendo Switch™',
  ]);

  const redDead2 = await createGame('Red Dead Redemption 2', 'Action-Adventure', 2018, [
    'PlayStation®4',
    'Xbox One®',
    'Microsoft Windows 10+®',
  ]);

  const terraria = await createGame('Terraria', 'Sandbox', 2011, [
    'Microsoft Windows 10+®',
    'PlayStation®4',
    'Xbox One®',
    'Nintendo Switch™',
  ]);

  const witcher3 = await createGame('The Witcher 3: Wild Hunt', 'RPG', 2015, [
    'PlayStation®4',
    'Xbox One®',
    'Microsoft Windows 10+®',
    'Nintendo Switch™',
    'PlayStation®5',
    'Xbox Series X®',
  ]);

  const superMarioBros = await createGame('Super Mario Bros.', 'Platformer', 1985, [
    'Nintendo Entertainment System™ (NES) / Family Computer (Famicom)',
  ]);

  const tetris = await createGame('Tetris', 'Puzzle', 1989, ['Game Boy®']);

  const pokemonRedBlue = await createGame('Pokémon Red and Blue', 'RPG', 1996, [
    'Game Boy®',
  ]);

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
      { collectionId: collection.id, gameId: minecraft.id },
      { collectionId: collection.id, gameId: gta5.id },
      { collectionId: collection.id, gameId: wiiSports.id },
      { collectionId: collection.id, gameId: marioKart8.id },
      { collectionId: collection.id, gameId: redDead2.id },
      { collectionId: collection.id, gameId: terraria.id },
      { collectionId: collection.id, gameId: witcher3.id },
      { collectionId: collection.id, gameId: superMarioBros.id },
      { collectionId: collection.id, gameId: tetris.id },
      { collectionId: collection.id, gameId: pokemonRedBlue.id },
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