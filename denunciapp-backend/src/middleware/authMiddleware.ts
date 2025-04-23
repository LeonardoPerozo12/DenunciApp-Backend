import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import prisma from '../config/prisma';

dotenv.config();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.header('Authorization');

    // Verifica si el encabezado Authorization está presente
    if (!authHeader) {
        res.status(401).set('WWW-Authenticate', 'Bearer').json({ message: 'No token provided' });
        return;
    }

    // Verifica si el encabezado tiene el formato correcto
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        res.status(401).json({ message: 'Invalid token format. Use "Bearer <token>"' });
        return;
    }

    const token = parts[1];

    try {
        // Verifica el token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { Usuario_ID: number };

        // Busca el usuario en la base de datos
        const user = await prisma.usuario.findUnique({
            where: { Usuario_ID: decoded.Usuario_ID },
        });

        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }

        // Adjunta el usuario al objeto `req` para usarlo en los controladores
        (req as any).user = user;
        next();
    } catch (error) {
        console.error('Error al verificar el token:', error);
        res.status(400).json({ message: 'Token inválido o expirado' });
    }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    // Verifica si el usuario es administrador
    if (!user?.Administrador) {
        res.status(403).json({ message: 'Acceso denegado: solo administradores' });
        return;
    }

    next();
};