import { Router } from 'express';
import { loginUser, newUser, newPassword} from '../controllers/user';


const router = Router();

router.post('/newUser', newUser);
router.post('/newPassword',newPassword);
router.post('/login',loginUser);

export default router;