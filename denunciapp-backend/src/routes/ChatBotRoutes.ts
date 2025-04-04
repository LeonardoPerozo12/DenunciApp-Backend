import { chatBot } from '../controllers/ChatBotController';
import router from '../config/router';

router.post('/Chat', chatBot);


export default router;