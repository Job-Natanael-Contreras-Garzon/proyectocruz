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
Object.defineProperty(exports, "__esModule", { value: true });
exports.newFactura = void 0;
const factura_1 = require("../models/factura");
const newFactura = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre_cliente, correo_cliente, ci_cliente, telefono_cliente, nombre_admin, metodo_pago, nombre_categoria_producto, cantidad } = req.body;
    try {
        //console.log("hola");
        yield (0, factura_1.insertar_factura)(nombre_cliente, correo_cliente, ci_cliente, telefono_cliente, nombre_admin, metodo_pago, nombre_categoria_producto, cantidad);
        res.json({
            msg: `Factura Añadida`,
        });
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error',
            error
        });
    }
});
exports.newFactura = newFactura;
