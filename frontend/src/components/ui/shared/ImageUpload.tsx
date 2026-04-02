import { Image as ImageIcon, X } from "lucide-react";
import { useState } from "react";

interface ImageUploadProps {
  value: string; // URL actual
  onChange: (file: File | null) => void; // Archivo seleccionado
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(value);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); // Crear vista previa local
      onChange(file);
    }
  };

  const clearImage = () => {
    setPreview("");
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <label htmlFor="file" className="block text-sm font-medium text-gray-700">
        Imagen del Producto
      </label>
      <div className="relative group">
        {preview ? (
          <div className="relative h-40 w-full rounded-2xl overflow-hidden border-2 border-dashed border-gray-200">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center h-40 w-full rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <ImageIcon className="text-gray-400 mb-2" size={32} />
              <p className="text-xs text-gray-500">
                Haz clic para subir (PNG, JPG)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
    </div>
  );
}
