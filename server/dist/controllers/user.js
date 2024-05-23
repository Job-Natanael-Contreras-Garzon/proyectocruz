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
exports.UserPer = exports.loginUser = exports.newPassword = exports.newUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_2 = require("../models/User");
const newUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombreAdministrador, telefono, correoElectronico, username, password, tipoPermiso } = req.body;
    //codificacion de la contraseña
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    //validar si el Usuario ya existe en la Base de Datos
    const user = yield User_1.User.findOne({ where: { username: username } });
    if (user) {
        return res.status(400).json({
            msg: `Ya existe un usuario con el nombre ${username}`
        });
    }
    try {
        //Guardar Usuario en la base de datos
        // await User.create({
        //     username: username,
        //     password: hashedPassword
        // })
        //console.log(nombreAdministrador);
        yield (0, User_2.callCrearUsuarioProcedure)(nombreAdministrador, telefono, correoElectronico, username, hashedPassword, tipoPermiso);
        res.json({
            msg: `Usuario ${username} creado exitosamente`,
        });
    }
    catch (error) {
        res.status(400).json({
            msg: 'Ups Ocurrio Un error',
            error
        });
    }
});
exports.newUser = newUser;
const newPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    //Encriptamos el password
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    //validamos si el usuario existe en la base
    const user = yield User_1.User.findOne({ where: { username: username } });
    if (!user) {
        return res.status(400).json({
            msg: `No existe un usuario con el nombre ${username} en la base de datos`
        });
    }
    try {
        yield (0, User_1.callActualizarPassword)(username, hashedPassword);
        res.json({
            msg: `Password actualizado exitosamente`,
        });
    }
    catch (error) {
        res.status(400).json({
            msg: 'Ups Ocurrio Un error',
            error
        });
    }
});
exports.newPassword = newPassword;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    //validamos si el usuario existe en la base
    const user = yield User_1.User.findOne({ where: { username: username } });
    if (!user) {
        return res.status(400).json({
            msg: `No existe un usuario con el nombre ${username} en la base de datos`
        });
    }
    //validamos el password
    const passwordValido = yield bcrypt_1.default.compare(password, user.password);
    if (!passwordValido) {
        return res.status(400).json({
            msg: 'Password Incorrecta'
        });
    }
    //generar token
    const token = jsonwebtoken_1.default.sign({
        username: username
    }, process.env.SECRET_KEY || 'SuperPutz');
    res.json(token);
});
exports.loginUser = loginUser;
const UserPer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body;
    //validamos si el usuario existe en la base
    const user = yield User_1.User.findOne({ where: { username: username } });
    if (!user) {
        return res.status(400).json({
            msg: `No existe un usuario con el nombre ${username} en la base de datos`
        });
    }
    try {
        const permiso = yield (0, User_1.obtener_categoria_permiso)(username);
        res.json(permiso);
    }
    catch (error) {
        res.status(400).json({
            msg: 'Ups Ocurrio Un error',
            error
        });
    }
});
exports.UserPer = UserPer;
