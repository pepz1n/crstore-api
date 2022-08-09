import { DataTypes } from "sequelize";
import { sequelize } from "../config";
import Category from "./CategoryModel";

const Product = sequelize.define(
  'products',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.NUMERIC(15,2),
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(2000)
    },
    description: {
      type: DataTypes.STRING(300),
    }
  },



  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

Product.belongsTo(Category,{
  as: 'category',
  onDelete: 'NO ACTION',
  onUpdate: 'NO ACTION',
  foreignKey: {
    name: 'idCategory',
    allowNull: false,
    field: 'id_category'
  }
})

export default Product;
