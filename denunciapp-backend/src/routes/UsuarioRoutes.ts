import {Router} from 'express';
import { registerUser, loginUser, getUserByID, getAllUsers} from '../controllers/UsuarioController';

const router = Router();

router.post('/register', registerUser); // Register a new user
router.post('/login', loginUser); // Login a user
router.get('/user/:Usuario_ID', getUserByID); // Get user by ID
router.get('/GetUsers', getAllUsers); // Get all users

export default router;