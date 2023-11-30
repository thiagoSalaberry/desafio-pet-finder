import { Sequelize } from "sequelize";
import "dotenv/config";
const SEQUELIZE_KEY:string = process.env.SEQUELIZE_KEY
export const sequelize = new Sequelize(SEQUELIZE_KEY);

(async()=>{
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (e) {
        console.error('Unable to connect to the database:', e);
    };
})();