# Migration `20200620170427-create_financial_movements_table`

This migration has been generated at 6/20/2020, 5:04:27 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "MovementTypes" AS ENUM ('income', 'outcome');

CREATE TABLE "public"."financial_movements" (
"cashier_id" text  NOT NULL ,"created_at" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"description" text  NOT NULL ,"due_date" timestamp(3)  NOT NULL ,"id" text  NOT NULL ,"type" "MovementTypes" NOT NULL ,"updated_at" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"value" Decimal(65,30)  NOT NULL ,
    PRIMARY KEY ("id"))

ALTER TABLE "public"."financial_movements" ADD FOREIGN KEY ("cashier_id")REFERENCES "public"."cashiers"("id") ON DELETE CASCADE  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200620010257-create_cashiers_table..20200620170427-create_financial_movements_table
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
@@ -15,8 +15,13 @@
   checking
   savings
 }
+enum MovementTypes {
+  income
+  outcome
+}
+
 model User {
   id                  String                @id @default(uuid())
   name                String
   email               String                @unique
@@ -40,17 +45,32 @@
   @@map("password_tokens")
 }
 model Cashier {
-  id              String       @id @default(uuid())
-  user_id         String
-  name            String?
-  is_bank_account Boolean      @default(false)
-  bank_name       String?
-  bank_branch     String?
-  bank_account    String?
-  account_type    AccountType?
-  balance         Float        @default(0)
-  user            User         @relation(fields: [user_id], references: [id])
+  id                String              @id @default(uuid())
+  user_id           String
+  name              String?
+  is_bank_account   Boolean             @default(false)
+  bank_name         String?
+  bank_branch       String?
+  bank_account      String?
+  account_type      AccountType?
+  balance           Float               @default(0)
+  user              User                @relation(fields: [user_id], references: [id])
+  FinancialMovement FinancialMovement[]
   @@map("cashiers")
 }
+
+model FinancialMovement {
+  id          String        @id @default(uuid())
+  cashier_id  String
+  description String
+  type        MovementTypes
+  due_date    DateTime
+  value       Float
+  cashier     Cashier       @relation(fields: [cashier_id], references: [id])
+  created_at  DateTime      @default(now())
+  updated_at  DateTime      @default(now())
+
+  @@map("financial_movements")
+}
```


