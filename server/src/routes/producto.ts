import { Router } from 'express';
import { getProducto } from '../controllers/producto';
import validar_token from './validar_token';

const router = Router();

router.get('/',validar_token, getProducto)

export default router;