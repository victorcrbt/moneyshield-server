# Migration `20200620171702-add_status_to_financial_movements`

This migration has been generated at 6/20/2020, 5:17:02 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "MovementStatus" AS ENUM ('pending', 'paid_out');

ALTER TABLE "public"."financial_movements" ADD COLUMN "status" "MovementStatus" NOT NULL ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200620170536-add_created_at_and_updated_at_to_cashiers_table..20200620171702-add_status_to_financial_movements
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url      = env("DATABASE_URL")
 }
 generator client {
   provider = "prisma-client-js"
@@ -20,8 +20,13 @@
   income
   outcome
 }
+enum MovementStatus {
+  pending
+  paid_out
+}
+
 model User {
   id                  String                @id @default(uuid())
   name                String
   email               String                @unique
@@ -63,16 +68,17 @@
   @@map("cashiers")
 }
 model FinancialMovement {
-  id          String        @id @default(uuid())
+  id          String         @id @default(uuid())
   cashier_id  String
   description String
   type        MovementTypes
   due_date    DateTime
   value       Float
-  cashier     Cashier       @relation(fields: [cashier_id], references: [id])
-  created_at  DateTime      @default(now())
-  updated_at  DateTime      @default(now())
+  status      MovementStatus
+  cashier     Cashier        @relation(fields: [cashier_id], references: [id])
+  created_at  DateTime       @default(now())
+  updated_at  DateTime       @default(now())
   @@map("financial_movements")
 }
```


