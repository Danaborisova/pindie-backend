const gamesRouter = require('express').Router();

const { findAllGames, createGame, findGameById, updateGame, deleteGame, 
checkEmptyFields, checkIfCategoriesAvaliable, checkIfUsersAreSafe, checkIsGameExists } = require('../middlewares/games');

const { sendAllGames, sendGameCreated, sendGameById, sendGameUpdated, sendGameDeleted } = require('../controllers/games');

gamesRouter.get('/games', findAllGames, sendAllGames);
gamesRouter.get("/games/:id", findGameById, sendGameById); 
gamesRouter.post("/games", findAllGames, checkEmptyFields, checkIsGameExists , createGame, sendGameCreated);
gamesRouter.put("/games/:id", findGameById, checkIfUsersAreSafe, checkIfCategoriesAvaliable, 
checkEmptyFields, updateGame, sendGameUpdated); 
gamesRouter.delete("/games/:id", deleteGame, sendGameDeleted ); 


module.exports = gamesRouter; 


/* old code:
const gamesRouter = require("express").Router(); // Создали роутер
const {sendAllGames, deleteGame, addGameController} = require("../controllers/games");
const { getAllGames } = require ("../middlewares/games");

gamesRouter.get("/games", getAllGames, sendAllGames)
gamesRouter.post("/games", getAllGames, addGameController) 
gamesRouter.delete("/games/:id", getAllGames, deleteGame);

module.exports = gamesRouter; */