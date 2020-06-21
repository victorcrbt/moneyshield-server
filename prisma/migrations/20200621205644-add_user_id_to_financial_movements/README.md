# Migration `20200621205644-add_user_id_to_financial_movements`

This migration has been generated at 6/21/2020, 8:56:44 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "AccountType" AS ENUM ('not_applied', 'checking', 'savings');

CREATE TYPE "MovementTypes" AS ENUM ('income', 'outcome');

CREATE TYPE "MovementStatus" AS ENUM ('pending', 'paid_out');

CREATE TABLE "public"."users" (
"created_at" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"email" text  NOT NULL ,"id" text  NOT NULL ,"name" text  NOT NULL ,"password" text  NOT NULL ,"updated_at" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."password_tokens" (
"content" text  NOT NULL ,"created_at" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"id" text  NOT NULL ,"updated_at" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"user_id" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."cashiers" (
"account_type" "AccountType"  ,"balance" Decimal(65,30)  NOT NULL DEFAULT 0,"bank_account" text   ,"bank_branch" text   ,"bank_name" text   ,"created_at" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"id" text  NOT NULL ,"is_bank_account" boolean  NOT NULL DEFAULT false,"name" text   ,"updated_at" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"user_id" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."financial_movements" (
"cashier_id" text  NOT NULL ,"created_at" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"description" text  NOT NULL ,"due_date" timestamp(3)  NOT NULL ,"id" text  NOT NULL ,"status" "MovementStatus" NOT NULL ,"type" "MovementTypes" NOT NULL ,"updated_at" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"user_id" text  NOT NULL ,"value" Decimal(65,30)  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE UNIQUE INDEX "users.email" ON "public"."users"("email")

CREATE UNIQUE INDEX "password_tokens.content" ON "public"."password_tokens"("content")

ALTER TABLE "public"."password_tokens" ADD FOREIGN KEY ("user_id")REFERENCES "public"."users"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."cashiers" ADD FOREIGN KEY ("user_id")REFERENCES "public"."users"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."financial_movements" ADD FOREIGN KEY ("cashier_id")REFERENCES "public"."cashiers"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."financial_movements" ADD FOREIGN KEY ("user_id")REFERENCES "public"."users"("id") ON DELETE CASCADE  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200620171702-add_status_to_financial_movements..20200621205644-add_user_id_to_financial_movements
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
@@ -34,8 +34,9 @@
   created_at          DateTime              @default(now())
   updated_at          DateTime              @default(now())
   ForgotPasswordToken ForgotPasswordToken[]
   Cashier             Cashier[]
+  FinancialMovement   FinancialMovement[]
   @@map("users")
 }
@@ -70,14 +71,16 @@
 model FinancialMovement {
   id          String         @id @default(uuid())
   cashier_id  String
+  user_id     String
   description String
   type        MovementTypes
   due_date    DateTime
   value       Float
   status      MovementStatus
   cashier     Cashier        @relation(fields: [cashier_id], references: [id])
+  user        User           @relation(fields: [user_id], references: [id])
   created_at  DateTime       @default(now())
   updated_at  DateTime       @default(now())
   @@map("financial_movements")
```


