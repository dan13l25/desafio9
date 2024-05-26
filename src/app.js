import { Server } from "socket.io";
import express from "express";
import { productRouter } from "./routes/productRouter.js";
import { cartRouter } from "./routes/cartRouter.js";
import userRouter from "./routes/userRouter.js";
import { connectMongoDB } from "./config/dbConfig.js";
import productService from "./dao/services/productService.js";
import { middlewareConfig } from "./config/middlewareConfig.js";

const app = express();
const port = process.env.PORT || 8080;
const server = app.listen(port, () => console.log("Servidor operando en puerto", port));

connectMongoDB();

// Configuracion de middlewares
middlewareConfig(app);

// Rutas
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/users", userRouter);

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/chat", (req, res) => {
  res.render("chat");
});

app.get("/product", (req, res) => {
  res.render("product");
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/profile", (req, res) => {
  res.render("/profile");
});

// Configuracion de socket.io
const io = new Server(server);
const msg = [];

io.on("connection", (socket) => {
  console.log("Nuevo usuario conectado:", socket.id);

  socket.on("message", async (data) => {
    try {
      const newMessage = new messagesModel(data);
      await newMessage.save();
      io.emit("messageLogs", await messagesModel.find());
    } catch (error) {
      console.error("Error al guardar el mensaje:", error);
    }
  });

  socket.on("producto", async (producto) => {
    try {
      const allProduct = await productService.getProducts();
      console.log(allProduct);
      io.emit("producto", allProduct);
    } catch (error) {
      console.error("Error al mostrar productos:", error);
    }
  });
});