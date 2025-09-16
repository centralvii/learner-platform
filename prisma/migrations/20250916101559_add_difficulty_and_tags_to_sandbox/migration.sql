/*
  Warnings:

  - Added the required column `difficulty` to the `sandbox_tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."sandbox_tasks" ADD COLUMN     "difficulty" TEXT NOT NULL DEFAULT 'medium',
ADD COLUMN     "tags" TEXT[];
