import {postReporte, getReportes, alterReporteStatus} from '../controllers/ReporteController';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/authMiddleware';
import router from '../config/router';


router.post('/Post-Reporte', postReporte);
router.get('/GetReportes', authMiddleware, adminMiddleware ,getReportes);
router.put('/reportes/:id/estado', authMiddleware, adminMiddleware, alterReporteStatus);

export default router;


