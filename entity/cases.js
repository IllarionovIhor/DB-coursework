import DataTypes from 'sequelize'
import db from "../case_db.js"
import ProtectionRating from "./protectionRating.js";
import CaseStatus from "./caseStatus.js";

const Cases = db.define('Cases', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255)
  },
  description: {
    type: DataTypes.TEXT
  },
  weight: {
    type: DataTypes.INTEGER
  },
  height: {
    type: DataTypes.INTEGER
  },
  width: {
    type: DataTypes.INTEGER
  },
  length: {
    type: DataTypes.INTEGER
  },
  price: {
    type: DataTypes.INTEGER
  },
  phone_id: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'cases',
  timestamps: false
});

// В файлі coctails.js
Cases.belongsTo(ProtectionRating, { as: "protection_rating",  foreignKey: 'protection_rating_id'});
Cases.belongsTo(CaseStatus, { as: "status",   foreignKey: 'status_id'});
//Coctail.hasMany(IngredientCoctail, { foreignKey: 'coctail_id', as: 'coctails' });
export default Cases;
