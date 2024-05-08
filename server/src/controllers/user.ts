import { Request, Response } from 'express';
import bycrypt from 'bcrypt';
import { User } from '../models/User';
import jwt from 'jsonwebtoken'

export const newUser = async (req: Request, res: Response) => {
    
    const { username, password } = req.body;

    //codificacion de la contraseña
    const hashedPassword = await bycrypt.hash(password,10)

    //validar si el Usuario ya existe en la Base de Datos
    const user = await User.findOne({where: { username: username }})
    if(user){
        return res.status(400).json({
            msg: `Ya existe un usuario con el nombre ${username}`
        })
    }

    try {
        //Guardar Usuario en la base de datos
        await User.create({
            username: username,
            password: hashedPassword
        })
    
        res.json({
            msg: `Usuario ${username} creado exitosamente`,
        })
    } catch (error) {
        res.status(400).json({
            msg: 'Ups Ocurrio Un error',
            error
        })
    }

}

export const loginUser = async (req: Request, res: Response) => {
    
    const {username, password} = req.body;
    //validamos si el usuario existe en la base
    const user: any = await User.findOne({where: { username: username }});
    if(!user){
        return res.status(400).json({
            msg: `No existe un usuario con el nombre ${username} en la base de datos`
        })
    }

    //validamos el password
    const passwordValido = await bycrypt.compare(password,user.password);
    if(!passwordValido){
        return res.status(400).json({
            msg: 'Password Incorrecta'
        })
    }

    //generar token
    const token = jwt.sign({
                    username: username
                  }, process.env.SECRET_KEY || 'SuperPutz')


    res.json(token)

}