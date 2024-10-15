import DataTypes from 'sequelize'
import db from "../case_db.js"
import Client from "./client.js";
import OrderStatus from "./orderStatus.js";

const Order = db.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ordering_date: {
    type: DataTypes.DATE
  },
  price: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'order',
  timestamps: false
});

Order.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });
Order.belongsTo(OrderStatus, { foreignKey: 'status_id', as: 'order_status' });

export default Order;
