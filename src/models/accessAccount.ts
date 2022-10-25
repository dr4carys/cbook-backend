import { STRING, TINYINT } from 'sequelize';

import db from '../configs/database';

const AccessModel = db.define(
  'Access',
  {
    userRef: {
      type: STRING,
    },
    isActive: {
      type: TINYINT,
    },
  },
  {
    freezeTableName: true,
  }
);

export default AccessModel;
