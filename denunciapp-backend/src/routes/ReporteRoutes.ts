import {postReporte, getReportes} from '../controllers/ReporteController';
import router from '../config/router';


router.post('/Post-Reporte', postReporte);
router.get('/GetReportes', getReportes);

export default router;


