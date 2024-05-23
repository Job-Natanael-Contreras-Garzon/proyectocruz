import { Request, Response } from 'express';
import { insertar_factura } from '../models/factura';



export const newFactura = async (req:Request, res: Response) => {
    const {nombre_cliente, correo_cliente,ci_cliente,telefono_cliente, nombre_admin, metodo_pago, nombre_categoria_producto, cantidad} = req.body;
    try {
        //console.log("hola");
        await insertar_factura(nombre_cliente, correo_cliente,ci_cliente,telefono_cliente, nombre_admin, metodo_pago, nombre_categoria_producto, cantidad);
        res.json({
            msg: `Factura Añadida`,
        })
    } catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error',
            error
        })
    }
}