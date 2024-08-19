const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

const server = app.listen(process.env.PORT || 4500, () => {
  console.log(`App is running on port "${process.env.PORT}"`);
});
