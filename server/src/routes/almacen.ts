import { Router } from 'express';
import { deleteAlamcen, getAlamcenes, getAlmacen, newAlmacen, updateAlamcen } from '../controllers/almacen';

const router = Router();

router.get('/',getAlamcenes);
router.get('/:id',getAlmacen);
router.delete('/:id',deleteAlamcen);
router.post('/',newAlmacen);
router.put('/:id',updateAlamcen);
export default router;