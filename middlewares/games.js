const games = require("../models/game");

const findAllGames = async (req, res, next) => {
  if(req.query["categories.name"]) { 
    req.gamesArray = await games.findGameByCategory(req.query["categories.name"]);
    next();
    return;
  }
  req.gamesArray = await games.find({}).populate("categories").populate({path: "users", select: "-password" });
  next();
};

const createGame = async (req, res, next) => {
  console.log("POST /games");
  try {
    console.log(req.body);
    req.game = await games.create(req.body);
    next();
  } catch (error) {
    res.status(400).send("Error creating game");
  }
};

const findGameById = async (req, res, next) => {
  try {
    req.game = await games.findById(req.params.id).populate("categories").populate({path: "users", select: "-password" });
    next();
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(404).send(JSON.stringify({ message: "Игра не найдена" }));
  }
};

const updateGame = async (req, res, next) => {
  try {
    req.game = await games.findByIdAndUpdate(req.params.id, req.body);
    next();
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(400).send(JSON.stringify({ message: "Ошибка обновления игры" }));
  }
}; 

const deleteGame = async (req, res, next) => {
  try {
    req.game = await games.findByIdAndDelete(req.params.id);
    next();
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
        res.status(400).send(JSON.stringify({ message: "Ошибка удаления игры" }));
  }
}; 

const checkEmptyFields = async (req, res, next) => {
		if (req.isVoteRequest) {
			next();
			return;
		}
		if (!req.body.title || !req.body.description || !req.body.image || !req.body.link || !req.body.developer) {
			// Если какое-то из полей отсутствует, то не будем обрабатывать запрос дальше,
			// а ответим кодом 400 — данные неверны.
			res.setHeader("Content-Type", "application/json");
			res.status(400).send(JSON.stringify({ message: "Заполни все поля" }));
		} else {
			// Если всё в порядке, то передадим управление следующим миддлварам
			next();
		}
	};

	const checkIfCategoriesAvaliable = async (req, res, next) => {
		if (req.isVoteRequest) {
			next();
			return;
		}
		// Проверяем наличие жанра у игры
		if (!req.body.categories || req.body.categories.length === 0) {
			res.setHeader("Content-Type", "application/json");
			res.status(400).send(JSON.stringify({ message: "Выбери хотя бы одну категорию" }));
		} else {
			next();
		}
	};

	const checkIfUsersAreSafe = async (req, res, next) => {
		// Проверим, есть ли users в теле запроса
		if (!req.body.users) {
			next();
			return;
		}
		// Cверим, на сколько изменился массив пользователей в запросе
		// с актуальным значением пользователей в объекте game
		// Если больше чем на единицу, вернём статус ошибки 400 с сообщением
		if (req.body.users.length - 1 === req.game.users.length) {
			next();
			return;
		} else {
			res.setHeader("Content-Type", "application/json");
			res.status(400).send(
				JSON.stringify({ message: "Нельзя удалять пользователей или добавлять больше одного пользователя" })
			);
		}
	};

	// change in practicum
	const checkIsVoteRequest = async (req, res, next) => {
		// Если в запросе присылают только поле users
		if (Object.keys(req.body).length === 1 && req.body.users) {
			req.isVoteRequest = true;
		}
		next();
	};

  const checkIsGameExists = async (req, res, next) => {
    //console.log(req.gamesArray);
    const isInArray = req.gamesArray.find((game) => {
        return req.body.title === game.title;
    });
    //console.log(isInArray);
    if (isInArray) {
        res.status(400).send({ message: "Игра с таким названием уже существует" });
    } else {
        next();
    }
};

module.exports = {
  findAllGames,
  createGame,
  findGameById,
  updateGame,
  deleteGame,
  checkEmptyFields,
  checkIfCategoriesAvaliable,
  checkIfUsersAreSafe,
  checkIsGameExists,
  checkIsVoteRequest
}



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