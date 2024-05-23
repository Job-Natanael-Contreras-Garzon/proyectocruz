"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertar_factura = exports.Factura = void 0;
const sequelize_1 = require("sequelize");
const conexion_1 = __importDefault(require("../db/conexion"));
exports.Factura = conexion_1.default.define('Factura', {
    codigo: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
}, {
    tableName: 'factura', // Nombre de la tabla existente en la base de datos
    timestamps: false // Indica que no hay columnas 'createdAt' y 'updatedAt' en la tabla
});
//Llamada de los procedimientos almacenador
function insertar_factura(nombre_cliente, correo_cliente, ci_cliente, telefono_cliente, nombre_admin, metodo_pago, nombre_categoria_producto, cantidad) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [results, metadata] = yield conexion_1.default.query(`CALL insertar_factura('${nombre_cliente}', '${correo_cliente}', '${ci_cliente}','${telefono_cliente}','${nombre_admin}', 
                               '${metodo_pago}', '${nombre_categoria_producto}', '${cantidad}')`);
            //console.log(results);
        }
        catch (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
        }
    });
}
exports.insertar_factura = insertar_factura;
