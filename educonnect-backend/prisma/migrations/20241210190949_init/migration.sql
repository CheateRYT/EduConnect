/*
  Warnings:

  - Added the required column `updatedAt` to the `Vacancy` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vacancy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "employerId" INTEGER NOT NULL,
    "salary" REAL,
    "workFormat" TEXT,
    "address" TEXT,
    "schedule" TEXT,
    "employmentType" TEXT,
    CONSTRAINT "Vacancy_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Vacancy" ("createdAt", "description", "employerId", "id", "title") SELECT "createdAt", "description", "employerId", "id", "title" FROM "Vacancy";
DROP TABLE "Vacancy";
ALTER TABLE "new_Vacancy" RENAME TO "Vacancy";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
