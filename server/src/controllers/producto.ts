import { Request, Response } from 'express';

export const getProducto = (req:Request, res:Response) => {

    res.json({
        msg: "Get producto"
    })

}