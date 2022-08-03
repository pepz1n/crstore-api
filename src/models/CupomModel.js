import { DataTypes } from "sequelize";
import { sequelize } from "../config";

const Cupom = sequelize.define(
  'cupoms',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:"percent"
    },
    value: {
      type: DataTypes.NUMERIC,
      allowNull:false
    },
    uses: {
      type: DataTypes.INTEGER,
      allowNull:true,
      defaultValue: 999
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default Cupom;
