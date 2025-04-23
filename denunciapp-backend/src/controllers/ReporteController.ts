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

export const deleteReporte = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Obtén el ID del reporte desde los parámetros de la solicitud

        // Verifica si el reporte existe
        const reporte = await prisma.reporte.findUnique({
            where: { Reporte_ID: parseInt(id) },
        });

        if (!reporte) {
            res.status(404).json({ error: "Reporte no encontrado" });
            return;
        }

        // Elimina el reporte
        await prisma.reporte.delete({
            where: { Reporte_ID: parseInt(id) },
        });

        res.status(200).json({ message: "Reporte eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el reporte:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const alterReporteStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Obtén el ID del reporte desde los parámetros de la solicitud
        const { estado } = req.body; // Obtén el nuevo estado del cuerpo de la solicitud

        // Validar que el estado sea uno de los valores permitidos
        const estadosPermitidos = ["PENDIENTE", "EN_PROCESO", "RESUELTO"];
        if (!estadosPermitidos.includes(estado)) {
            res.status(400).json({ error: `Estado no válido. Los estados permitidos son: ${estadosPermitidos.join(", ")}` });
            return;
        }

        // Verifica si el reporte existe
        const reporte = await prisma.reporte.findUnique({
            where: { Reporte_ID: parseInt(id) },
        });

        if (!reporte) {
            res.status(404).json({ error: "Reporte no encontrado" });
            return;
        }

        // Actualiza el estado del reporte
        const reporteActualizado = await prisma.reporte.update({
            where: { Reporte_ID: parseInt(id) },
            data: { Estado: estado },
        });

        res.status(200).json({
            message: "El estado del reporte ha sido actualizado",
            reporte: reporteActualizado,
        });
    } catch (error) {
        console.error("Error al actualizar el estado del reporte:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};