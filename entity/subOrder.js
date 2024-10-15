import DataTypes from "sequelize";
import db from "../case_db.js";
import Case from "./cases.js";
import Order from "./order.js";

const SubOrder = db.define(
  "SubOrder",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "sub_order",
    timestamps: false,
  }
);

SubOrder.belongsTo(Case, { foreignKey: "case_id" });
SubOrder.belongsTo(Order, { foreignKey: "order_id" });

SubOrder.afterCreate((sub_order, options) => {
  return Order.findByPk(sub_order.order_id).then((parentOrder) => {
    Case.findByPk(sub_order.case_id).then((aCase) => {
      parentOrder.price += sub_order.amount * aCase.price;
      parentOrder.save();
      console.log("lesgo ", parentOrder);
    });
  });
});
SubOrder.afterUpdate((sub_order, options) => {
  if (sub_order.changed("amount")) {
    return Order.findByPk(sub_order.order_id).then((parentOrder) => {
      Case.findByPk(sub_order.case_id).then((aCase) => {
        const changedPrice = (sub_order.amount - sub_order.previous().amount) * aCase.price;
        parentOrder.price += changedPrice;
        parentOrder.save();
        console.log("lesgo ", parentOrder);
      });
    });
  }
});
SubOrder.afterDestroy((sub_order, options) => {
    return Order.findByPk(sub_order.order_id).then((parentOrder) => {
      Case.findByPk(sub_order.case_id).then((aCase) => {
        const removedPrice = (0 - sub_order.amount) * aCase.price;
        parentOrder.price += removedPrice;
        parentOrder.save();
        console.log("lesgo ", parentOrder);
      });
    });
});
export default SubOrder;
