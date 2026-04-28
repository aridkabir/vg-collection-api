import * as gameService from '../services/gameService.js';

export async function getAllGames(req, res, next) {
  try {
    const games = await gameService.getAllGames();
    res.json(games);
  } catch (error) {
    next(error);
  }
}

export async function getGameById(req, res, next) {
  try {
    const game = await gameService.getGameById(Number(req.params.id));
    res.json(game);
  } catch (error) {
    next(error);
  }
}

export async function createGame(req, res, next) {
  try {
    const game = await gameService.createGame(req.body);
    res.status(201).json(game);
  } catch (error) {
    next(error);
  }
}

export async function updateGame(req, res, next) {
  try {
    const game = await gameService.updateGame(Number(req.params.id), req.body);
    res.json(game);
  } catch (error) {
    next(error);
  }
}

export async function deleteGame(req, res, next) {
  try {
    await gameService.deleteGame(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}