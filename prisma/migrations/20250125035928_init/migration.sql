/*
  Warnings:

  - You are about to drop the column `coverUrl` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Video` table. All the data in the column will be lost.
  - Added the required column `coverURL` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoURL` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "coverUrl",
DROP COLUMN "videoUrl",
ADD COLUMN     "coverURL" TEXT NOT NULL,
ADD COLUMN     "videoURL" TEXT NOT NULL;
