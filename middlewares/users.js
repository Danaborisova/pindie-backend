const users = require('../models/user');
const bcrypt = require("bcryptjs"); 

const findAllUsers = async (req, res, next) => {
    // По GET-запросу на эндпоинт /users найдём все документы пользователей
    console.log("Миддлвар! Ищем всех юзеров!")
  req.usersArray = await users.find({}, { password: 0 });
  next();
}

const createUser = async (req, res, next) => {
  console.log("POST /users");
  try {
    console.log(req.body);
    req.user = await users.create(req.body);
    next();
  } catch (error) {
    res.status(400).send("Error creating user");
  }
}; 

const findUserById = async (req, res, next) => {
  try {
    req.user = await users.findById(req.params.id, { password: 0 });
    next();
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(404).send(JSON.stringify({ message: "Пользователь не найден" }));
  }
};

const updateUser = async (req, res, next) => {
  try {
    req.user = await users.findByIdAndUpdate(req.params.id, req.body);
    next();
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(400).send(JSON.stringify({ message: "Ошибка обновления пользователей" }));
  }
}; 

const deleteUser = async (req, res, next) => {
  try {
    req.user = await users.findByIdAndDelete(req.params.id);
    next();
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
        res.status(400).send(JSON.stringify({ message: "Ошибка удаления пользователя" }));
  }
}; 

const checkEmptyNameAndEmailAndPassword = async (req, res, next) => {
  if (
    !req.body.email ||
    !req.body.password ||
    !req.body.username 
  ) {
    res.setHeader("Content-Type", "application/json");
        res.status(400).send(JSON.stringify({ message: "Заполните все поля" }));
  } else {
    next();
  }
}; 

const checkEmptyNameAndEmail = async (req, res, next) => {
  if (
    !req.body.username ||
    !req.body.email
  ) {
    res.setHeader("Content-Type", "application/json");
        res.status(400).send(JSON.stringify({ message: "Заполните все поля" }));
  } else {
    next();
  }
}; 

const hashPassword = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    req.body.password = hash;
    next();
  } catch (error) {
    res.status(400).send({ message: "Ошибка хеширования пароля" });
  }
};


const checkIsUserExists = async (req, res, next) => {
  //console.log(req.gamesArray);
  const isInArray = req.usersArray.find((user) => {
      return req.body.email === user.email;
  });
  //console.log(isInArray);
  if (isInArray) {
      res.status(400).send({ message: "Пользователь с таким названием уже существует" });
  } else {
      next();
  }
};


module.exports = {
  findAllUsers,
  createUser,
  findUserById,
  updateUser,
  deleteUser,
  checkEmptyNameAndEmailAndPassword,
  checkEmptyNameAndEmail,
  hashPassword,
  checkIsUserExists
}