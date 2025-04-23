import {postReporte, getReportes, alterReporteStatus, deleteReporte} from '../controllers/ReporteController';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/authMiddleware';
import router from '../config/router';


router.post('/Post-Reporte', postReporte);
router.get('/GetReportes', authMiddleware, adminMiddleware ,getReportes);
router.put('/reportes/:id/estado', authMiddleware, adminMiddleware, alterReporteStatus);
router.delete('/delete-reporte/:id', authMiddleware, adminMiddleware, deleteReporte);

export default router;


