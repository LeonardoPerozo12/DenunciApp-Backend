/*
  Warnings:

  - You are about to drop the column `Contrasena` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `Contraseña` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "Contrasena",
ADD COLUMN     "Contraseña" TEXT NOT NULL;
