import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

// Set up test database
process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "file:./test.db";

// Clear the test database
const testDbPath = path.join(process.cwd(), "test.db");
if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
}

// Create and migrate the test database
try {
  execSync("DATABASE_URL='file:./test.db' npx prisma migrate deploy", {
    stdio: "inherit",
  });
} catch (error) {
  console.error("Failed to set up test database", error);
  process.exit(1);
}
