"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const producto_1 = require("../controllers/producto");
const validar_token_1 = __importDefault(require("./validar_token"));
const router = (0, express_1.Router)();
router.get('/', validar_token_1.default, producto_1.getProducto);
exports.default = router;
