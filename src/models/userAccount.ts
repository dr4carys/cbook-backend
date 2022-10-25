import { STRING, TINYINT } from 'sequelize';
// import connection
import db from '../configs/database';

const UserModel = db.define(
  'user',
  {
    username: {
      type: STRING,
    },
    password: {
      type: STRING,
    },
    isRemoved: {
      type: TINYINT,
    },
  },
  {
    freezeTableName: true,
  }
);


export default UserModel;
