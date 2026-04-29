import * as platformRepo from '../repositories/platformRepo.js';

function createError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

export async function getAllPlatforms(query) {
  const allowedSortFields = ['id', 'name', 'manufacturer', 'releaseYear'];
  const allowedOrders = ['asc', 'desc'];

  const sortBy = allowedSortFields.includes(query.sortBy) ? query.sortBy : 'id';
  const order = allowedOrders.includes(query.order) ? query.order : 'asc';

  const releaseYear = query.releaseYear ? Number(query.releaseYear) : undefined;

  if (query.releaseYear && (!Number.isInteger(releaseYear) || releaseYear <= 0)) {
    throw createError(400, 'Invalid release year');
  }

  return platformRepo.findAllPlatforms({
    sortBy,
    order,
    manufacturer: query.manufacturer,
    releaseYear,
    search: query.search,
  });
}

export async function getPlatformById(id) {
  if (!Number.isInteger(id) || id <= 0) {
    throw createError(400, 'Invalid platform ID');
  }

  const platform = await platformRepo.findPlatformById(id);

  if (!platform) {
    throw createError(404, 'Platform not found');
  }

  return platform;
}

export async function createPlatform(data) {
  if (!data.name) {
    throw createError(400, 'Name is required');
  }

  return platformRepo.createPlatform({
    name: data.name,
    manufacturer: data.manufacturer,
  });
}

export async function updatePlatform(id, data) {
  if (!Number.isInteger(id) || id <= 0) {
    throw createError(400, 'Invalid platform ID');
  }

  const existingPlatform = await platformRepo.findPlatformById(id);

  if (!existingPlatform) {
    throw createError(404, 'Platform not found');
  }

  if (!data.name) {
    throw createError(400, 'Name is required');
  }

  return platformRepo.updatePlatform(id, {
    name: data.name,
    manufacturer: data.manufacturer,
  });
}

export async function deletePlatform(id) {
  if (!Number.isInteger(id) || id <= 0) {
    throw createError(400, 'Invalid platform ID');
  }

  const existingPlatform = await platformRepo.findPlatformById(id);

  if (!existingPlatform) {
    throw createError(404, 'Platform not found');
  }

  await platformRepo.deletePlatform(id);
}