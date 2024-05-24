import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('AUTOREPUESTOSCRUZ','postgres','contreras123',{
    host: 'localhost',
    dialect: 'postgres'
})

export default sequelize;