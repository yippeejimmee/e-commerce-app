const express = require('express');
const routes = require('./routes');
// import sequelize connection
const sequelize = require('./config/connection')

const app = express();
const PORT = process.env.PORT || 3001;

//tells the app to use express.json any time a request is sent to server
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//tells app to use the imported routes
app.use(routes);

// sync sequelize models to the database, then turn on the server
sequelize.sync({
  force: false
}).then(() => {
  app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
})