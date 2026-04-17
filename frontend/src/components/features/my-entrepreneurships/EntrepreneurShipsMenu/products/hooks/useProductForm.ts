import { useState } from "react";
import type {
  EntrepreneurshipProduct,
  ProductInput,
} from "../../../../../../types";

export function useProductForm(product: EntrepreneurshipProduct | null) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<ProductInput>({
    name: product?.name || "",
    price: product?.price || 0,
    current_stock: product?.current_stock || 0,
    is_active: product?.is_active ?? true,
    image: product?.image || "",
  });

  const updateField = <K extends keyof ProductInput>(
    field: K,
    value: ProductInput[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
    formData,
    selectedFile,
    setSelectedFile,
    updateField,
  };
}
