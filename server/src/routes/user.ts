import { Router } from 'express';
import { loginUser, newUser, newPassword, getUsuarios} from '../controllers/user';


const router = Router();

router.post('/newUser', newUser);
router.post('/newPassword',newPassword);
router.post('/login',loginUser);
router.get('/getusers',getUsuarios);

export default router;