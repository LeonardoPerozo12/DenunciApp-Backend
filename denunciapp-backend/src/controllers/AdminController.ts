import prisma from '../config/prisma';
import { Request, Response } from 'express';

export const setAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params; // Obtén el ID del usuario desde los parámetros de la solicitud

        // Verifica si el usuario existe
        const usuario = await prisma.usuario.findUnique({
            where: { Usuario_ID: parseInt(id) },
        });

        if (!usuario) {
            res.status(404).json({ error: "Usuario no encontrado" });
            return 
        }

        // Actualiza el campo Administrador a `true`
        const usuarioActualizado = await prisma.usuario.update({
            where: { Usuario_ID: parseInt(id) },
            data: { Administrador: true },
        });

        res.status(200).json({
            message: "El usuario ha sido promovido a administrador",
            usuario: usuarioActualizado,
        });
        return 
    } catch (error) {
        console.error("Error al promover al usuario a administrador:", error);
        res.status(500).json({ error: "Error interno del servidor" });
        return 
    }
};