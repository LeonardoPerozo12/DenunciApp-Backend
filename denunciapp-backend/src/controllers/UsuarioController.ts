import prisma from '../config/prisma';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (req: Request, res: Response) => {
    try {
        const {Nombre, Cedula, Correo, Contraseña} = req.body; //parsing from the request body
        const existingUser = await prisma.usuario.findUnique({
            where: { 
                Correo, // Check if the email already exists
                Cedula, // Check if the ID already exists
            },
        });
        // Check if the user already exists
        if (existingUser) {
            res.status(400).json({ message: 'el usuario ya existe'});
            return;
        }

        const hashedPassword = await bcrypt.hash(Contraseña, 10); // Hashing the password
        const newUser = await prisma.usuario.create({ 
            //creates new user
            data: {
                Nombre,
                Cedula,
                Correo,
                Contraseña: hashedPassword,
            },
        });
        res.status(201).json({ message: 'Usario creado ', newUser });

    }
    catch (error) {
        console.error('Error creando usuario: ', error);
        res.status(500).json({ message: 'Error creando usuario' });
    }
}

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try{
        const { Correo, Contraseña } = req.body; //parsing from the request body

        // Check if the user exists by email
        const user = await prisma.usuario.findUnique({ 
            where: { Correo },
        });
        if(!user){
            res.status(400).json({ message: 'Usuario no encontrado' });
            return;
        }
        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(Contraseña, user.Contraseña);
        if(!isPasswordValid){
            res.status(400).json({ message: 'Contraseña incorrecta' });
            return;
        }
        // Ensure that JWT is defined
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            res.status(500).json({ message: 'JWT_SECRET no esta definido en las variables de entorno' });
            return;
        }


        // Generate JWT token with user ID and expiration time        
        const token = jwt.sign({ Usuario_ID: user.Usuario_ID }, secret, { expiresIn: '1d' });
        res.status(200).json({ message: 'Inicio de sesion exitoso', token, user });
        return 
    } catch (error) {
        console.error('Error iniciando sesion:', error);
        res.status(500).json({ message: 'Error iniciando sesion' });
    }
}

export const getUserByID = async (req: Request, res: Response) => {
    try{
        const { Usuario_ID } = req.params; //parsing from the request body

        if(!Usuario_ID){
            res.status(400).json({ message: 'Usuario_ID no existe' });
            return;
        }
        const user = await prisma.usuario.findUnique({
            where: { Usuario_ID: Number(Usuario_ID) },
        })
        if(!user){
            res.status(400).json({ message: 'Usuario no encontrado' });
            return;
        }
        res.status(200).json({ message: 'Usuario encontrado', user });
    } catch (error) {
        console.error('Error buscando usuario:', error);
        res.status(500).json({ message: 'Error buscando usuario' });
    }
}

export const getAllUsers = async (req: Request, res: Response) => {
    try{
        const users = await prisma.usuario.findMany();
        res.json(users);
    }catch(error){
        console.error('Error buscando usuarios:', error);
        res.status(500).json({ message: 'Error buscando usuarios' });
    }
}