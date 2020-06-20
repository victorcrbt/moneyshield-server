# Migration `20200620010257-create_cashiers_table`

This migration has been generated at 6/20/2020, 1:02:57 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "AccountType" AS ENUM ('not_applied', 'checking', 'savings');

CREATE TABLE "public"."cashiers" (
"account_type" "AccountType"  ,"balance" Decimal(65,30)  NOT NULL DEFAULT 0,"bank_account" text   ,"bank_branch" text   ,"bank_name" text   ,"id" text  NOT NULL ,"is_bank_account" boolean  NOT NULL DEFAULT false,"name" text   ,"user_id" text  NOT NULL ,
    PRIMARY KEY ("id"))

ALTER TABLE "public"."cashiers" ADD FOREIGN KEY ("user_id")REFERENCES "public"."users"("id") ON DELETE CASCADE  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200616013429-create_password_tokens_table..20200620010257-create_cashiers_table
--- datamodel.dml
+++ datamodel.dml
@@ -2,23 +2,30 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url      = env("DATABASE_URL")
 }
 generator client {
   provider = "prisma-client-js"
 }
+enum AccountType {
+  not_applied
+  checking
+  savings
+}
+
 model User {
   id                  String                @id @default(uuid())
   name                String
   email               String                @unique
   password            String
   created_at          DateTime              @default(now())
   updated_at          DateTime              @default(now())
   ForgotPasswordToken ForgotPasswordToken[]
+  Cashier             Cashier[]
   @@map("users")
 }
@@ -31,4 +38,19 @@
   updated_at DateTime @default(now())
   @@map("password_tokens")
 }
+
+model Cashier {
+  id              String       @id @default(uuid())
+  user_id         String
+  name            String?
+  is_bank_account Boolean      @default(false)
+  bank_name       String?
+  bank_branch     String?
+  bank_account    String?
+  account_type    AccountType?
+  balance         Float        @default(0)
+  user            User         @relation(fields: [user_id], references: [id])
+
+  @@map("cashiers")
+}
```


