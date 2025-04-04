import prisma from '../config/prisma';
import { obtenerOInsertarUbicacion } from "./UbicacionService";


export const crearReporte = async (data: {
  descripcion: string;
  fecha_suceso: string;
  ubicacion: {
    calle: string;
    latitud: number;
    longitud: number;
    sector: string;
    distrito: string;
    municipio: string;
    provincia: string;
    region: string;
  };
  categoria: string;
  usuario_id: number;
}) => {
  try {
    // Obtener o insertar la ubicación
    const ubicacion_ID = await obtenerOInsertarUbicacion(data.ubicacion);

    // Verificar si la categoría existe
    const categoria = await prisma.categoria_Reporte.findFirst({
      where: { Nombre: data.categoria },
    });

    if (!categoria) {
      throw new Error("Categoría no encontrada");
    }

    // Crear el reporte
    const reporte = await prisma.reporte.create({
      data: {
        Descripcion: data.descripcion,
        Fecha_Registro: new Date(),
        Fecha_cierre: null,
        Fecha_Ultima_Actualizacion: new Date(),
        Estado: "PENDIENTE",
        Usuario_ID: data.usuario_id,
        Ubicacion_ID: ubicacion_ID,
        Categoria_ID: categoria.Categoria_ID,
      },
    });

    return reporte;
  } catch (error) {
    console.error("Error creando reporte:", error);
    throw new Error("No se pudo crear el reporte");
  }
};