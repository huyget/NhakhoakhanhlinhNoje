'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class clinic extends Model {
   
    static associate(models) {
     
    }
  };
  clinic.init({
    name : DataTypes.STRING,
    address: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    
  }, {
    sequelize,
    modelName: 'clinic',
  });
  return clinic;
};