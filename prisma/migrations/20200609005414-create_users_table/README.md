# Migration `20200609005414-create_users_table`

This migration has been generated at 6/9/2020, 12:54:14 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."users" (
"created_at" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"email" text  NOT NULL ,"id" text  NOT NULL ,"name" text  NOT NULL ,"password" text  NOT NULL ,"updated_at" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"))

CREATE UNIQUE INDEX "users.email" ON "public"."users"("email")

DROP TABLE "public"."User";
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200609005414-create_users_table
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,22 @@
+// This is your Prisma schema file,
+// learn more about it in the docs: https://pris.ly/d/prisma-schema
+
+datasource db {
+  provider = "postgresql"
+  url      = env("DATABASE_URL")
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+model User {
+  id         String   @id @default(uuid())
+  name       String
+  email      String   @unique
+  password   String
+  created_at DateTime @default(now())
+  updated_at DateTime @default(now())
+
+  @@map("users")
+}
```


