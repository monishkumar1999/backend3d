'use strict';

export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('user_designs', 'customerId', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Customer',
                key: 'id',
            },
            onDelete: 'SET NULL',
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('user_designs', 'customerId');
    },
};
