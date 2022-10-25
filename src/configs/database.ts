import { Sequelize } from 'sequelize';

const db = new Sequelize('credibook', 'root', 'M4dem@de', {
  host: 'localhost',
  dialect: 'mysql',
});

export const dbConnect = async () => {
  try {
    await db.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export default db;
