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
      type: DataTypes.FLOAT,
      allowNull: false
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
  as: 'order',
  foreignKey:{
    name: 'idOrder',
    field: 'id_order',
    allowNull: false
  }
})
Product.belongsToMany(Order, {
  through: OrderProducts,
  as: 'product',
  foreignKey:{
    name: 'idProduct',
    field: 'id_product',
    allowNull: false
  }
})
export default OrderProducts;
