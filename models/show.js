'use strict';
module.exports = (sequelize, DataTypes) => {
  var Show = sequelize.define('Show', {
    name: DataTypes.STRING,
    nbSeason: DataTypes.INTEGER,
    nbEpisodes: DataTypes.INTEGER,
    beginYear: DataTypes.DATE
  }, {});
  Show.associate = function(models) {
    // associations can be defined here
  };
  return Show;
};