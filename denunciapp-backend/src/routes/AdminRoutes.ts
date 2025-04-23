import router from '../config/router';
import { setAdmin } from '../controllers/AdminController';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/authMiddleware';

router.put('/set-admin/:id', authMiddleware , adminMiddleware ,setAdmin); // Middleware de autenticación para proteger la ruta

export default router;