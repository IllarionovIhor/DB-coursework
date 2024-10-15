import DataTypes from 'sequelize'
import db from "../case_db.js"

const OrderStatus = db.define('OrderStatus', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(50)
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'order_status',
  timestamps: false
});

export default OrderStatus;
