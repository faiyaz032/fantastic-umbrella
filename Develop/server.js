const express = require('express');
const dotenv = require('dotenv').config();
const routes = require('./routes');

// import sequelize connection
const sequelize = require('./config/connection');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// sync sequelize models to the database, then turn on the server

sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true }).then(function (results) {
   sequelize.sync().then((res) => {
      app.listen(PORT, () => console.log(`App is alive on ${PORT}`));
   });
});
