"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Item extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Item.init(
		{
			isPokemon: DataTypes.BOOLEAN,
			item: DataTypes.STRING,
			isDisplay: DataTypes.BOOLEAN,
			status: DataTypes.BOOLEAN,
			// updatedAt: DataTypes.DATE
		},
		{
			sequelize,
			modelName: "Item",
			tableName: "Items",
			timestamps: false
		}
	);
	return Item;
};
