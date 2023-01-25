const Sequelize = require("sequelize");
const db = require("../db");

const File = db.define("file", {
  name: {
    type: Sequelize.STRING,
  }, 
});

// how to connnect files to users?
// does this need to be explicitly stated?
// or can we just make the association upon querying?

module.exports = File;
