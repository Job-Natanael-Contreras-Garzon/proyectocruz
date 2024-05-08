import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('AUTOREPUESTOSCRUZ','postgres','071104',{
    host: 'localhost',
    dialect: 'postgres'
})

export default sequelize;