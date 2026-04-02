import { Switch } from "antd";
import { DollarSign, List, Package } from "lucide-react";
import { useState } from "react";
import type {
  EntrepreneurshipProduct,
  ProductInput,
} from "../../../../../services/productService";
import BaseFormModal from "../../../shared/BaseFormModal";
import ImageUpload from "../../../shared/ImageUpload";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: ProductInput) => Promise<void>;
  product: EntrepreneurshipProduct | null;
  isLoading?: boolean;
  entrepreneurshipId: string;
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSave,
  product,
  isLoading,
  entrepreneurshipId,
}: ProductFormModalProps) {
  // Estado local inicializado con los datos del producto si existe
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<ProductInput>({
    name: product?.name || "",
    price: product?.price || 0,
    current_stock: product?.current_stock || 0,
    is_active: product?.is_active ?? true,
    image: product?.image || "",
  });

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      entrepreneurship_id: entrepreneurshipId,
      imageFile: selectedFile,
    };
    await onSave(dataToSend);
    setSelectedFile(null);
  };

  return (
    <BaseFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={product ? "Editar Producto" : "Nuevo Producto"}
      confirmText={product ? "Guardar Cambios" : "Crear Producto"}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        {/* Nombre del Producto */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre del Producto
          </label>
          <div className="relative">
            <Package
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              id="name"
              required
              type="text"
              placeholder="Ej: Café Artesanal 500g"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Precio */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Precio
            </label>
            <div className="relative">
              <DollarSign
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                id="price"
                required
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Stock
            </label>
            <div className="relative">
              <List
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                id="stock"
                required
                type="number"
                min="0"
                placeholder="0"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                value={formData.current_stock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    current_stock: parseInt(e.target.value, 10) || 0,
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* URL de Imagen (Opcional) */}
        <ImageUpload
          value={formData.image}
          onChange={(file) => setSelectedFile(file)}
        />

        {/* Estado Activo */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div>
            <p className="text-sm font-bold text-gray-700">Producto Activo</p>
            <p className="text-xs text-gray-400">
              ¿Estará visible en el catálogo inmediatamente?
            </p>
          </div>
          <Switch
            checked={formData.is_active}
            onChange={(checked) =>
              setFormData({ ...formData, is_active: checked })
            }
            className={formData.is_active ? "bg-primary" : ""}
          />
        </div>
      </div>
    </BaseFormModal>
  );
}
