import { Router } from 'express';
import { newFactura } from '../controllers/factura';

const router = Router();


router.post('/newFactura',newFactura);

export default router;