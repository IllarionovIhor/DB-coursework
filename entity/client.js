import DataTypes from 'sequelize'
import db from "../case_db.js"
const Client = db.define('Client', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  first_name: {
    type: DataTypes.STRING(255)
  },
  last_name: {
    type: DataTypes.STRING(255)
  },
  email: {
    type: DataTypes.STRING(255)
  },
  address: {
    type: DataTypes.STRING(255)
  },
  password: {
    type: DataTypes.STRING(50)
  }
}, {
  tableName: 'client',
  timestamps: false
});

export default Client;
