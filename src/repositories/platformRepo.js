import prisma from '../config/db.js';

export function findAllPlatforms() {
  return prisma.platform.findMany({
    orderBy: {
      id: 'asc',
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