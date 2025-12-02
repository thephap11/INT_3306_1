import app from "./app.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fieldRoutes from "./routes/manager/fieldRoutes.js";

const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse JSON
app.use(express.json());

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/manager/fields", fieldRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
