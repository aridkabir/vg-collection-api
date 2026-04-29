import prisma from '../config/db.js';

export function findAllGames(options = {}) {
  const { sortBy = 'id', order = 'asc', genre, platformId, search } = options;

  return prisma.game.findMany({
    where: {
      ...(genre && {
        genre: {
          contains: genre,
          mode: 'insensitive',
        },
      }),
      ...(search && {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      }),
      ...(platformId && {
        platforms: {
          some: {
            platformId,
          },
        },
      }),
    },
    orderBy: {
      [sortBy]: order,
    },
    include: {
      platforms: {
        include: {
          platform: true,
        },
      },
    },
  });
}

export function findGameById(id) {
  return prisma.game.findUnique({
    where: { id },
    include: {
      platforms: {
        include: {
          platform: true,
        },
      },
    },
  });
}

export function createGame(data) {
  return prisma.game.create({
    data,
    include: {
      platforms: {
        include: {
          platform: true,
        },
      },
    },
  });
}

export function updateGame(id, data) {
  return prisma.game.update({
    where: { id },
    data,
    include: {
      platforms: {
        include: {
          platform: true,
        },
      },
    },
  });
}

export function deleteGame(id) {
  return prisma.game.delete({
    where: { id },
  });
}