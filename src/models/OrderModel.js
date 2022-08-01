import { DataTypes } from "sequelize";
import { sequelize } from "../config";
import Cupom from "./CupomModel";
import Payment from "./PaymentsModel";
import User from "./UserModel";

const Order = sequelize.define(
  'orders',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    status: {
      type: DataTypes.STRING,
    },
    total: {
      type: DataTypes.FLOAT,
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

Order.belongsTo(User, {
  as: 'userCostumer',
  foreignKey: {
    name: 'idUserCostumer',
    allowNull: false,
    field: 'id_user_costumer'
  }
})

Order.belongsTo(User, {
  as: 'userDeliver',
  foreignKey: {
    name: 'idUserDeliver',
    allowNull: false,
    field: 'id_user_deliver'
  }
})

Order.belongsTo(Payment, {
  as: 'payment',
  foreignKey: {
    name: 'idPayment',
    allowNull: false,
    field: 'id_payment'
  }
})

Order.belongsTo(Cupom, {
  as: 'cupom',
  foreignKey: {
    name: 'idCupom',
    allowNull: true,
    field: 'id_cupom'
  }
})




export default Order;
