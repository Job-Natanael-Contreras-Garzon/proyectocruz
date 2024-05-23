import { Router } from 'express';
import { loginUser, newUser, newPassword, UserPer} from '../controllers/user';


const router = Router();

router.post('/newUser', newUser);
router.post('/newPassword',newPassword);
router.post('/login',loginUser);
router.post('/permiso',UserPer);

export default router;