import multer from "multer";

// Configuramos el almacenamiento en memoria (Memory Storage)
// para que el archivo esté disponible en req.file.buffer
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // Límite de 2MB
  },
  fileFilter: (_req, file, cb) => {
    // Validar que sea una imagen
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos de imagen (jpg, png, etc.)"));
    }
  },
});

export default upload;
