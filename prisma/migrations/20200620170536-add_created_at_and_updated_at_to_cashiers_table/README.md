# Migration `20200620170536-add_created_at_and_updated_at_to_cashiers_table`

This migration has been generated at 6/20/2020, 5:05:36 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."cashiers" ADD COLUMN "created_at" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updated_at" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200620170427-create_financial_movements_table..20200620170536-add_created_at_and_updated_at_to_cashiers_table
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
@@ -55,8 +55,10 @@
   bank_account      String?
   account_type      AccountType?
   balance           Float               @default(0)
   user              User                @relation(fields: [user_id], references: [id])
+  created_at        DateTime            @default(now())
+  updated_at        DateTime            @default(now())
   FinancialMovement FinancialMovement[]
   @@map("cashiers")
 }
```


