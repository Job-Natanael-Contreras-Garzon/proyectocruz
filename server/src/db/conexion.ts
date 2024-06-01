import { Sequelize } from 'sequelize';
/*
const url = process.env.POSTGRES_URL || 'postgresql://usuario:contraseña@localhost:5432/nombre_basedatos';
const sequelize = new Sequelize(url)*/

const sequelize = new Sequelize('AUTOREPUESTOSCRUZ','postgres','071104',{
    host: 'localhost',
    dialect: 'postgres'
})
export default sequelize;