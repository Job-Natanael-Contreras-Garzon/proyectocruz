import { Request, Response } from 'express';
import { callNuevaBitacora, obtenerBitacoras } from '../models/bitacora';

export const newBitacora = async (req:Request, res: Response) => {
    const {username,IP,FechaHora,descripcion} = req.body;
    try {
        await callNuevaBitacora(username,IP,FechaHora,descripcion);
        res.json({
            msg: `Bitacora Añadida`,
        })
    } catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error',
            error
        })
    }
}

export const getBitacora = async (req:Request, res:Response) => {
    try {
        const listBitacora = await obtenerBitacoras();
        res.json(listBitacora);
    } catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error',
            error
        })
    }
}