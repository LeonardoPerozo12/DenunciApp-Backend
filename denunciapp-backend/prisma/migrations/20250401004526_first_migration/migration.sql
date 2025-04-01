-- CreateEnum
CREATE TYPE "Estado_Reporte" AS ENUM ('PENDIENTE', 'EN_PROCESO', 'RESUELTO');

-- CreateTable
CREATE TABLE "Usuario" (
    "Usuario_ID" SERIAL NOT NULL,
    "Nombre" TEXT NOT NULL,
    "Cedula" TEXT NOT NULL,
    "Correo" TEXT NOT NULL,
    "Contrasena" TEXT NOT NULL,
    "Activo" BOOLEAN NOT NULL DEFAULT true,
    "Fecha_Registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Administrador" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("Usuario_ID")
);

-- CreateTable
CREATE TABLE "Reporte" (
    "Reporte_ID" SERIAL NOT NULL,
    "Fecha_Registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Fecha_cierre" TIMESTAMP(3),
    "Fecha_Ultima_Actualizacion" TIMESTAMP(3),
    "Estado" "Estado_Reporte" NOT NULL DEFAULT 'PENDIENTE',
    "Descripcion" TEXT NOT NULL,
    "Usuario_ID" INTEGER NOT NULL,
    "Ubicacion_ID" INTEGER NOT NULL,
    "Categoria_ID" INTEGER NOT NULL,

    CONSTRAINT "Reporte_pkey" PRIMARY KEY ("Reporte_ID")
);

-- CreateTable
CREATE TABLE "Categoria_Reporte" (
    "Categoria_ID" SERIAL NOT NULL,
    "Nombre" TEXT NOT NULL,
    "Descripcion" TEXT NOT NULL,

    CONSTRAINT "Categoria_Reporte_pkey" PRIMARY KEY ("Categoria_ID")
);

-- CreateTable
CREATE TABLE "Ubicacion" (
    "Ubicacion_ID" SERIAL NOT NULL,
    "Calle" TEXT NOT NULL,
    "Latitud" DOUBLE PRECISION NOT NULL,
    "Longitud" DOUBLE PRECISION NOT NULL,
    "Sector_ID" INTEGER NOT NULL,

    CONSTRAINT "Ubicacion_pkey" PRIMARY KEY ("Ubicacion_ID")
);

-- CreateTable
CREATE TABLE "Sector" (
    "Sector_ID" SERIAL NOT NULL,
    "Nombre_Sector" TEXT NOT NULL,
    "Distrito_ID" INTEGER NOT NULL,

    CONSTRAINT "Sector_pkey" PRIMARY KEY ("Sector_ID")
);

-- CreateTable
CREATE TABLE "Distrito" (
    "Distrito_ID" SERIAL NOT NULL,
    "Nombre_Distrito" TEXT NOT NULL,
    "Municipio_ID" INTEGER NOT NULL,

    CONSTRAINT "Distrito_pkey" PRIMARY KEY ("Distrito_ID")
);

-- CreateTable
CREATE TABLE "Municipio" (
    "Municipio_ID" SERIAL NOT NULL,
    "Nombre_Municipio" TEXT NOT NULL,
    "Provincia_ID" INTEGER NOT NULL,

    CONSTRAINT "Municipio_pkey" PRIMARY KEY ("Municipio_ID")
);

-- CreateTable
CREATE TABLE "Provincia" (
    "Provincia_ID" SERIAL NOT NULL,
    "Nombre_Provincia" TEXT NOT NULL,
    "Region_ID" INTEGER NOT NULL,

    CONSTRAINT "Provincia_pkey" PRIMARY KEY ("Provincia_ID")
);

-- CreateTable
CREATE TABLE "Region" (
    "Region_ID" SERIAL NOT NULL,
    "Nombre_Region" TEXT NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("Region_ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_Cedula_key" ON "Usuario"("Cedula");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_Correo_key" ON "Usuario"("Correo");

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_Usuario_ID_fkey" FOREIGN KEY ("Usuario_ID") REFERENCES "Usuario"("Usuario_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_Categoria_ID_fkey" FOREIGN KEY ("Categoria_ID") REFERENCES "Categoria_Reporte"("Categoria_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_Ubicacion_ID_fkey" FOREIGN KEY ("Ubicacion_ID") REFERENCES "Ubicacion"("Ubicacion_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ubicacion" ADD CONSTRAINT "Ubicacion_Sector_ID_fkey" FOREIGN KEY ("Sector_ID") REFERENCES "Sector"("Sector_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sector" ADD CONSTRAINT "Sector_Distrito_ID_fkey" FOREIGN KEY ("Distrito_ID") REFERENCES "Distrito"("Distrito_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Distrito" ADD CONSTRAINT "Distrito_Municipio_ID_fkey" FOREIGN KEY ("Municipio_ID") REFERENCES "Municipio"("Municipio_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Municipio" ADD CONSTRAINT "Municipio_Provincia_ID_fkey" FOREIGN KEY ("Provincia_ID") REFERENCES "Provincia"("Provincia_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Provincia" ADD CONSTRAINT "Provincia_Region_ID_fkey" FOREIGN KEY ("Region_ID") REFERENCES "Region"("Region_ID") ON DELETE RESTRICT ON UPDATE CASCADE;
