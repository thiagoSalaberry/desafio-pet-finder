import { sequelize } from "../models/connection";
(async()=>{
    await sequelize.sync({force: true});
})();