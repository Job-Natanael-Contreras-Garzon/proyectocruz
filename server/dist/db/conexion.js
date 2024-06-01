"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
/*
const url = process.env.POSTGRES_URL || 'postgresql://usuario:contraseña@localhost:5432/nombre_basedatos';
const sequelize = new Sequelize(url)*/
const sequelize = new sequelize_1.Sequelize('AUTOREPUESTOSCRUZ', 'postgres', '071104', {
    host: 'localhost',
    dialect: 'postgres'
});
exports.default = sequelize;
