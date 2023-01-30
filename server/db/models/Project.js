const Sequelize = require("sequelize");
const db = require("../db");

const Project = db.define("project", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  graphicsFn: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  sectionDuration: {
    type: Sequelize.INTEGER,
  },
  finalAudioFilePath: {
    type: Sequelize.TEXT,
  },
  finalVideoFilePath: {
    type: Sequelize.TEXT,
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "looper",
  },
});

module.exports = Project;
