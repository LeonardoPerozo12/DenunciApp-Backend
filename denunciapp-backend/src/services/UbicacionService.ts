import prisma from '../config/prisma';

export const obtenerOInsertarUbicacion = async (data: {
    calle: string;
    latitud: number;
    longitud: number;
    sector: string;
    distrito: string;
    municipio: string;
    provincia: string;
    region: string;
}) => {
    try {
        // 1. Buscar si la región existe
        let region = await prisma.region.findFirst({
        where: { Nombre_Region: data.region },
        });
        if (!region) {
        region = await prisma.region.create({
            data: { Nombre_Region: data.region },
        });
        }

        // 2. Buscar si la provincia existe
        let provincia = await prisma.provincia.findFirst({
        where: { Nombre_Provincia: data.provincia, Region_ID: region.Region_ID },
        });
        if (!provincia) {
        provincia = await prisma.provincia.create({
            data: { Nombre_Provincia: data.provincia, Region_ID: region.Region_ID },
        });
        }

        // 3. Buscar si el municipio existe
        let municipio = await prisma.municipio.findFirst({
        where: {
            Nombre_Municipio: data.municipio,
            Provincia_ID: provincia.Provincia_ID,
        },
        });
        if (!municipio) {
        municipio = await prisma.municipio.create({
            data: {
            Nombre_Municipio: data.municipio,
            Provincia_ID: provincia.Provincia_ID,
            },
        });
        }

        // 4. Buscar si el distrito existe
        let distrito = await prisma.distrito.findFirst({
        where: {
            Nombre_Distrito: data.distrito,
            Municipio_ID: municipio.Municipio_ID,
        },
        });
        if (!distrito) {
        distrito = await prisma.distrito.create({
            data: {
            Nombre_Distrito: data.distrito,
            Municipio_ID: municipio.Municipio_ID,
            },
        });
        }

        // 5. Buscar si el sector existe
        let sector = await prisma.sector.findFirst({
        where: { Nombre_Sector: data.sector, Distrito_ID: distrito.Distrito_ID },
        });
        if (!sector) {
        sector = await prisma.sector.create({
            data: { Nombre_Sector: data.sector, Distrito_ID: distrito.Distrito_ID },
        });
        }

        // 6. Buscar si la ubicación ya existe
        let ubicacion = await prisma.ubicacion.findFirst({
        where: {
            Calle: data.calle,
            Latitud: data.latitud,
            Longitud: data.longitud,
            Sector_ID: sector.Sector_ID,
        },
        });

        // 7. Si no existe, crear la ubicación
        if (!ubicacion) {
        ubicacion = await prisma.ubicacion.create({
            data: {
            Calle: data.calle,
            Latitud: data.latitud,
            Longitud: data.longitud,
            Sector_ID: sector.Sector_ID,
            },
        });
        }

        return ubicacion.Ubicacion_ID;
    } catch (error) {
        console.error("Error procesando ubicación:", error);
        throw new Error("No se pudo registrar la ubicación");
    }
};
