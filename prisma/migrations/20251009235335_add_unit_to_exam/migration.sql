/*
  Warnings:

  - You are about to drop the column `LeftArm` on the `Anthropometry` table. All the data in the column will be lost.
  - You are about to drop the column `LeftCalf` on the `Anthropometry` table. All the data in the column will be lost.
  - You are about to drop the column `LeftLet` on the `Anthropometry` table. All the data in the column will be lost.
  - You are about to drop the column `RightArm` on the `Anthropometry` table. All the data in the column will be lost.
  - You are about to drop the column `RightCalf` on the `Anthropometry` table. All the data in the column will be lost.
  - You are about to drop the column `RightLeg` on the `Anthropometry` table. All the data in the column will be lost.
  - You are about to drop the column `Waist` on the `Anthropometry` table. All the data in the column will be lost.
  - You are about to drop the column `Weight` on the `Anthropometry` table. All the data in the column will be lost.
  - Added the required column `unit` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoInscricao" AS ENUM ('Principal', 'Secundaria');

-- CreateEnum
CREATE TYPE "Situacao" AS ENUM ('Ativo', 'Inativo');

-- AlterTable
ALTER TABLE "Anthropometry" DROP COLUMN "LeftArm",
DROP COLUMN "LeftCalf",
DROP COLUMN "LeftLet",
DROP COLUMN "RightArm",
DROP COLUMN "RightCalf",
DROP COLUMN "RightLeg",
DROP COLUMN "Waist",
DROP COLUMN "Weight",
ADD COLUMN     "leftArm" DOUBLE PRECISION,
ADD COLUMN     "leftCalf" DOUBLE PRECISION,
ADD COLUMN     "leftLeg" DOUBLE PRECISION,
ADD COLUMN     "rightArm" DOUBLE PRECISION,
ADD COLUMN     "rightCalf" DOUBLE PRECISION,
ADD COLUMN     "rightLeg" DOUBLE PRECISION,
ADD COLUMN     "waist" DOUBLE PRECISION,
ADD COLUMN     "weight" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "unit" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Exam_data" ADD COLUMN     "lab" TEXT;

-- CreateTable
CREATE TABLE "Medico" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "crm" TEXT NOT NULL,
    "tipo" "TipoInscricao",
    "situacao" "Situacao",
    "especialidade" TEXT,
    "area" TEXT,
    "uf" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Medico_email_key" ON "Medico"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Medico_crm_uf_key" ON "Medico"("crm", "uf");
