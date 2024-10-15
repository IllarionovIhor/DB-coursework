import DataTypes from 'sequelize'
import db from "../case_db.js"

const CaseStatus = db.define('CaseStatus', {
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
  tableName: 'case_status',
  timestamps: false
});

export default CaseStatus;
