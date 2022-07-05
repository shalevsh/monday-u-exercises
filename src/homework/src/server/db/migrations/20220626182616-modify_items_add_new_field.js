"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn(
			"Items", // table name
			"status", // new field name
			{
				type: Sequelize.BOOLEAN,
				allowNull: true
			}
		);
		/**
		 * Add altering commands here.
		 *
		 * Example:
		 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
		 */
	},

	async down(queryInterface, Sequelize) {
		return await queryInterface.removeColumn("Items", "status");
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
	}
};
