const fs = require("fs");
const path = require("node:path");
async function createStream() {
  let data = "";
  const rs = fs.createReadStream(path.resolve("01-read-file", "text.txt"));
  rs.on("data", (chunk) => {
    data += chunk.toString();
  });
  rs.on("end", () => {
    console.log(data);
  });
}

createStream();
