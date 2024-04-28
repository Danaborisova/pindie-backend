const games = require("../models/game");

const findAllGames = async (req, res, next) => {
  // По GET-запросу на эндпоинт /games найдём все документы категорий
  req.gamesArray = await games.find({}).populate("categories").populate("users");
  next();
};

module.exports = findAllGames; 


/* old code:
 const { readData } = require("../utils/data");

const getAllGames = async (req, res, next) => {
    const games = await readData("./data/games.json");
    if (!games) {
        res.status(400);
        res.send({
        status: "error",
        message: "Нет игр в базе данных. Добавьте игру.",
        });
        return;
    }
    req.games = games;
    next();
}
module.exports = getAllGames; */