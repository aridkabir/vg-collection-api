import * as platformService from '../services/platformService.js';

export async function getAllPlatforms(req, res, next) {
  try {
    const platforms = await platformService.getAllPlatforms();
    res.json(platforms);
  } catch (error) {
    next(error);
  }
}

export async function getPlatformById(req, res, next) {
  try {
    const platform = await platformService.getPlatformById(Number(req.params.id));
    res.json(platform);
  } catch (error) {
    next(error);
  }
}

export async function createPlatform(req, res, next) {
  try {
    const platform = await platformService.createPlatform(req.body);
    res.status(201).json(platform);
  } catch (error) {
    next(error);
  }
}

export async function updatePlatform(req, res, next) {
  try {
    const platform = await platformService.updatePlatform(Number(req.params.id), req.body);
    res.json(platform);
  } catch (error) {
    next(error);
  }
}

export async function deletePlatform(req, res, next) {
  try {
    await platformService.deletePlatform(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}