require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const { routes } = require("./src/routes");
const { join } = require("path");

// настроим подключение к бд
const mongoHost = process.env.MONGO_HOST;
const mongoPort = process.env.MONGO_PORT;
const mongoDbname = process.env.DB_NAME;

mongoose.connect(`mongodb://${mongoHost}:${mongoPort}/${mongoDbname}`, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// инициализируем приложение
const app = express();
app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

routes.forEach((item) => {
  app.use(`/api/v1/${item}`, require(`./src/routes/${item}`));
});

// объявим наши  роуты
const PORT = process.env.PORT;
http.createServer({}, app).listen(PORT);

console.log(`Server running at ${PORT}`);
