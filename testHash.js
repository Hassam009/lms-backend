const bcrypt = require("bcrypt");

async function testHash() {
  const hashedPassword = await bcrypt.hash("yourpassword", 10);
  console.log("Hashed Password:", hashedPassword);
}

testHash();
