import DataTypes from 'sequelize'
import db from "../case_db.js"
// import Cases from './cases.js';

const ProtectionRating = db.define('ProtectionRating', {
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
  },
  water: {
    type: DataTypes.STRING(50)
  },
  kenetic: {
    type: DataTypes.STRING(255)
  },
  coverage: {
    type: DataTypes.STRING(255)
  }
}, {
  tableName: 'protection_rating',
  timestamps: false
});

// ProtectionRating.hasMany(Cases);

export default ProtectionRating;
