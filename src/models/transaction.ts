import { STRING, INTEGER } from 'sequelize';

import db from '../configs/database';

const Transaction = db.define(
  'Transaction',
  {
    amount: {
      type: INTEGER,
    },
    note: {
      type: STRING,
    },
    userRef: {
      type: STRING,
    },
    type: {
      type: STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Transaction;
