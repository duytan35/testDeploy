// const authRouter = require("./auth");
// const userRouter = require("./users");
const usersService = require("../services/users");

const route = (app) => {
  // app.use("/auth", authRouter);
  // app.use("/users", userRouter);
  app.get("/", (req, res) => {
    res.send("Express JS on Vercel");
  });

  app.get("/ping", (req, res) => {
    res.send("pong 🏓");
  });

  app.post("/", (req, res) => {
    res.send("you send post?");
  });

  app.get("/user", async (req, res) => {
    const user = await usersService.getUserById(1);
    res.send({ message: "user", data: user });
  });
};

module.exports = route;
