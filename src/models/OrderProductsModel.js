import { DataTypes } from "sequelize";
import { sequelize } from "../config";
import Order from "./OrderModel";
import Product from "./ProductModel";

const OrderProducts = sequelize.define(
  'orders_products',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    price_products: {
      type: DataTypes.NUMERIC,
      allowNull: false
    },
    quantity :{
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);


Order.belongsToMany(Product, {
  through: OrderProducts,
  as: 'products',
  onDelete: 'NO ACTION',
  onUpdate: 'NO ACTION',
  foreignKey:{
    name: 'idOrder',
    field: 'id_order',
    allowNull: false
  }
})

Product.belongsToMany(Order, {
  through: OrderProducts,
  as: 'order',
  onDelete: 'NO ACTION',
  onUpdate: 'NO ACTION',
  foreignKey:{
    name: 'idProduct',
    field: 'id_product',
    allowNull: false
  }
})

export default OrderProducts;
