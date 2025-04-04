import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { crearReporte } from '../services/ReporteService';
import { reverseGeocoding } from '../services/GeocodingService';

export const postReporte = async (req: Request, res: Response):Promise<void> => {
    try{
        const { descripcion, fecha_suceso, ubicacion, categoria, usuario_id } = req.body;

        if(!descripcion || !fecha_suceso || !ubicacion || !categoria || !usuario_id) {
            res.status(400).json({ error: 'Faltan datos obligatorios' });
            return 
        }
        
        // Validación de coordenadas en el objeto `ubicacion`
        const { latitud, longitud } = ubicacion;
        if (!latitud || !longitud) {
            res.status(400).json({ error: 'Faltan las coordenadas de la ubicación' });
            return;
        }

        // Llama al servicio de geocodificación para obtener detalles de la ubicación
        const geocodedLocation = await reverseGeocoding(latitud, longitud);
        console.log('Ubicación geocodificada:', geocodedLocation);
        
        // Combina los datos de ubicación proporcionados con los obtenidos del servicio
        const ubicacionCompleta = {
            ...ubicacion, // Datos originales
            ...geocodedLocation, // Datos obtenidos del servicio
        };

        // Crea el reporte con la ubicacion completa
        const reporte = await crearReporte({
            descripcion, 
            fecha_suceso, 
            ubicacion: ubicacionCompleta, 
            categoria, 
            usuario_id
        });

        res.status(201).json(reporte);
    } catch (error) {
        console.error('Error al crear el reporte:', error);
        res.status(500).json({ error: 'no se pudo crear el reporte' });
    }
}

export const getReportes = async (req: Request, res: Response) => {
    try {
        const reportes = await prisma.reporte.findMany({
            include: {
            Usuario: { select: { Nombre: true, Correo: true } },
            Categoria: { select: { Nombre: true } },
            Ubicacion: {
                select: {
                Calle: true,
                Latitud: true,
                Longitud: true,
                Sector: {
                    select: {
                    Nombre_Sector: true,
                    Distrito: {
                        select: {
                        Nombre_Distrito: true,
                        Municipio: {
                            select: {
                                Nombre_Municipio: true,
                                Provincia: {
                                select: { Nombre_Provincia: true, Region: { select: { Nombre_Region: true } } },
                            },
                            },
                        },
                        },
                    },
                    },
                },
                },
            },
            },
        });
            res.json(reportes);
        } catch (error) {
            console.error("Error al obtener reportes:", error);
            res.status(500).json({ error: "No se pudieron obtener los reportes" });
    }
};