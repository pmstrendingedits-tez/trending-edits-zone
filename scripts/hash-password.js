// Usage: node scripts/hash-password.js yourpassword
const bcrypt = require("bcryptjs");

const password = process.argv[2];
if (!password) {
  console.error("Usage: node scripts/hash-password.js <your-password>");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log("\nAdd this to your .env.local / Vercel env vars as ADMIN_PASSWORD_HASH:\n");
console.log(hash);
console.log("");
