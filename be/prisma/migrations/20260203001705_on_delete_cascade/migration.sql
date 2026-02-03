-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InvoiceDetail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    CONSTRAINT "InvoiceDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InvoiceDetail_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_InvoiceDetail" ("id", "invoiceId", "productId", "qty", "total") SELECT "id", "invoiceId", "productId", "qty", "total" FROM "InvoiceDetail";
DROP TABLE "InvoiceDetail";
ALTER TABLE "new_InvoiceDetail" RENAME TO "InvoiceDetail";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
