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
      defaultValue:"criado"
    },
    total: {
      type: DataTypes.NUMERIC,
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
  onDelete: 'NO ACTION',
  onUpdate: 'NO ACTION',
  foreignKey: {
    name: 'idUserCostumer',
    allowNull: false,
    field: 'id_user_costumer'
  }
})

Order.belongsTo(User, {
  as: 'userDeliver',
  onDelete: 'NO ACTION',
  onUpdate: 'NO ACTION',
  foreignKey: {
    name: 'idUserDeliver',
    allowNull: true,
    field: 'id_user_deliver'
  }
})

Order.belongsTo(Payment, {
  as: 'payment',
  onDelete: 'NO ACTION',
  onUpdate: 'NO ACTION',
  foreignKey: {
    name: 'idPayment',
    allowNull: false,
    field: 'id_payment'
  }
})

Order.belongsTo(Cupom, {
  as: 'cupom',
  onDelete: 'NO ACTION',
  onUpdate: 'NO ACTION',
  foreignKey: {
    name: 'idCupom',
    allowNull: true,
    field: 'id_cupom'
  }
})




export default Order;
