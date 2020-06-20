# Migration `20200616013429-create_password_tokens_table`

This migration has been generated at 6/16/2020, 1:34:29 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."password_tokens" (
"content" text  NOT NULL ,"created_at" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"id" text  NOT NULL ,"updated_at" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"user_id" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE UNIQUE INDEX "password_tokens.content" ON "public"."password_tokens"("content")

ALTER TABLE "public"."password_tokens" ADD FOREIGN KEY ("user_id")REFERENCES "public"."users"("id") ON DELETE CASCADE  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200609005414-create_users_table..20200616013429-create_password_tokens_table
--- datamodel.dml
+++ datamodel.dml
@@ -2,21 +2,33 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url      = env("DATABASE_URL")
 }
 generator client {
   provider = "prisma-client-js"
 }
 model User {
+  id                  String                @id @default(uuid())
+  name                String
+  email               String                @unique
+  password            String
+  created_at          DateTime              @default(now())
+  updated_at          DateTime              @default(now())
+  ForgotPasswordToken ForgotPasswordToken[]
+
+  @@map("users")
+}
+
+model ForgotPasswordToken {
   id         String   @id @default(uuid())
-  name       String
-  email      String   @unique
-  password   String
+  user_id    String
+  content    String   @unique @default(uuid())
+  user       User     @relation(fields: [user_id], references: [id])
   created_at DateTime @default(now())
   updated_at DateTime @default(now())
-  @@map("users")
+  @@map("password_tokens")
 }
```


