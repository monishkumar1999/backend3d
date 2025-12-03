export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('products', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    base_model_url: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    configuration: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    thumbnail_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("products");
}
