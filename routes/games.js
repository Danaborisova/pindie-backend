const gamesRouter = require('express').Router();

const findAllGames = require('../middlewares/games');
const sendAllGames = require('../controllers/games');

gamesRouter.get('/games', findAllGames, sendAllGames);

module.exports = gamesRouter; 


/* old code:
const gamesRouter = require("express").Router(); // Создали роутер
const {sendAllGames, deleteGame, addGameController} = require("../controllers/games");
const { getAllGames } = require ("../middlewares/games");

gamesRouter.get("/games", getAllGames, sendAllGames)
gamesRouter.post("/games", getAllGames, addGameController) 
gamesRouter.delete("/games/:id", getAllGames, deleteGame);

module.exports = gamesRouter; */