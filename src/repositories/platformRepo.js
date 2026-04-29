import prisma from '../config/db.js';

export function findAllPlatforms(options = {}) {
  const { sortBy = 'id', order = 'asc', manufacturer, releaseYear, search } = options;

  return prisma.platform.findMany({
    where: {
      ...(manufacturer && {
        manufacturer: {
          contains: manufacturer,
          mode: 'insensitive',
        },
      }),
      ...(releaseYear && {
        releaseYear,
      }),
      ...(search && {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      }),
    },
    orderBy: {
      [sortBy]: order,
    },
    include: {
      _count: {
        select: {
          games: true,
        },
      },
    },
  });
}

export function findPlatformById(id) {
  return prisma.platform.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          games: true,
        },
      },
    },
  });
}

export function createPlatform(data) {
  return prisma.platform.create({
    data,
    include: {
      _count: {
        select: {
          games: true,
        },
      },
    },
  });
}

export function updatePlatform(id, data) {
  return prisma.platform.update({
    where: { id },
    data,
    include: {
      _count: {
        select: {
          games: true,
        },
      },
    },
  });
}

export function deletePlatform(id) {
  return prisma.platform.delete({
    where: { id },
  });
}