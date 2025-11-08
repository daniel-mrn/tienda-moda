// Importar dependencias
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Crear aplicación
const app = express();
app.use(cors());
app.use(express.json());

// ----------------------------
// 🔗 CONEXIÓN A MONGODB
// ----------------------------
// Render recomienda usar variables de entorno para tu URI de Atlas
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tienda_moda";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB correctamente"))
  .catch(err => console.error("❌ Error al conectar con MongoDB:", err));

// ----------------------------
// 📦 MODELO DE MENSAJE
// ----------------------------
const mensajeSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  fecha: { type: Date, default: Date.now }
});

const Mensaje = mongoose.model("Mensaje", mensajeSchema);

// ----------------------------
// 🌐 RUTAS
// ----------------------------
app.get("/", (req, res) => {
  res.send("🚀 Servidor Node.js + MongoDB funcionando correctamente");
});

// Guardar mensaje de contacto
app.post("/contacto", async (req, res) => {
  try {
    const nuevoMensaje = new Mensaje(req.body);
    await nuevoMensaje.save();
    console.log("📩 Mensaje guardado:", nuevoMensaje);
    res.json({ mensaje: "Mensaje guardado correctamente ✅" });
  } catch (error) {
    console.error("❌ Error al guardar el mensaje:", error);
    res.status(500).json({ error: "Error al guardar el mensaje" });
  }
});

// Obtener todos los mensajes
app.get("/mensajes", async (req, res) => {
  try {
    const mensajes = await Mensaje.find().sort({ fecha: -1 });
    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los mensajes" });
  }
});

// Eliminar mensaje por ID
app.delete("/mensajes/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Mensaje.findByIdAndDelete(id);
    console.log("🗑️ Mensaje eliminado con ID:", id);
    res.json({ mensaje: "Mensaje eliminado correctamente ✅" });
  } catch (error) {
    console.error("❌ Error al eliminar mensaje:", error);
    res.status(500).json({ error: "Error al eliminar el mensaje" });
  }
});

// Login simple (admin)
app.post("/login", (req, res) => {
  const { usuario, clave } = req.body;
  const ADMIN_USER = "admin";
  const ADMIN_PASS = "1234";

  if (usuario === ADMIN_USER && clave === ADMIN_PASS) {
    res.json({ mensaje: "Inicio de sesión exitoso ✅" });
  } else {
    res.status(401).json({ error: "Usuario o contraseña incorrectos ❌" });
  }
});

// ----------------------------
// ⚙️ INICIAR SERVIDOR
// ----------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`)
);


