import * as gameRepo from '../repositories/gameRepo.js';

function createError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

export async function getAllGames() {
  return gameRepo.findAllGames();
}

export async function getGameById(id) {
  if (!Number.isInteger(id) || id <= 0) {
    throw createError(400, 'Invalid game ID');
  }

  const game = await gameRepo.findGameById(id);

  if (!game) {
    throw createError(404, 'Game not found');
  }

  return game;
}

export async function createGame(data) {
  if (!data.title) {
    throw createError(400, 'Title is required');
  }

  if (!Array.isArray(data.platformIds) || data.platformIds.length === 0) {
    throw createError(400, 'At least one platform is required');
  }

  return gameRepo.createGame({
    title: data.title,
    genre: data.genre,
    releaseYear: data.releaseYear,
    platforms: {
      create: data.platformIds.map((platformId) => ({
        platform: {
          connect: { id: platformId },
        },
      })),
    },
  });
}

export async function updateGame(id, data) {
  if (!Number.isInteger(id) || id <= 0) {
    throw createError(400, 'Invalid game ID');
  }

  const existingGame = await gameRepo.findGameById(id);

  if (!existingGame) {
    throw createError(404, 'Game not found');
  }

  if (!data.title) {
    throw createError(400, 'Title is required');
  }
  
  if (!data.releaseYear) {
  throw createError(400, 'Release year is required');
}

  if (!Array.isArray(data.platformIds) || data.platformIds.length === 0) {
    throw createError(400, 'At least one platform is required');
  }

  return gameRepo.updateGame(id, {
    title: data.title,
    genre: data.genre,
    releaseYear: data.releaseYear,
    platforms: {
      deleteMany: {},
      create: data.platformIds.map((platformId) => ({
        platform: {
          connect: { id: platformId },
        },
      })),
    },
  });
}

export async function deleteGame(id) {
  if (!Number.isInteger(id) || id <= 0) {
    throw createError(400, 'Invalid game ID');
  }

  const existingGame = await gameRepo.findGameById(id);

  if (!existingGame) {
    throw createError(404, 'Game not found');
  }

  await gameRepo.deleteGame(id);
}