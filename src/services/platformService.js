import * as platformRepo from '../repositories/platformRepo.js';

function createError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

export async function getAllPlatforms() {
  return platformRepo.findAllPlatforms();
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