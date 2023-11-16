const express = require("express");
const db = require("./configs/db");

const app = express();
const route = require("./routes");
route(app);

app.listen(process.env.PORT, (err, res) => {
  if (err) {
    console.log(err);
    return res.status(500).send(err.message);
  } else {
    console.log("[INFO] Server Running on port:", port);
  }
});
