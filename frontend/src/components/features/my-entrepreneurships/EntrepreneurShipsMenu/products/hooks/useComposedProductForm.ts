import { useState } from "react";
import type {
  ComposedProductComponent,
  ComposedProductInput,
} from "../../../../../../types";

export function useComposedProductForm(
  product: (ComposedProductInput & { id?: string }) | null,
) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<ComposedProductInput>({
    name: product?.name || "",
    price: product?.price || 0,
    is_active: product?.is_active ?? true,
    entrepreneurship_id: product?.entrepreneurship_id || "",
    image: product?.image || "",
    category_id: product?.category_id,
    components: product?.components || [],
  });

  const updateField = <K extends keyof ComposedProductInput>(
    field: K,
    value: ComposedProductInput[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addComponent = (component: ComposedProductComponent) => {
    setFormData((prev) => ({
      ...prev,
      components: [...prev.components, component],
    }));
  };

  const removeComponent = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      components: prev.components.filter((_, i) => i !== index),
    }));
  };

  const updateComponent = (
    index: number,
    field: keyof ComposedProductComponent,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      components: prev.components.map((c, i) =>
        i === index ? { ...c, [field]: value } : c,
      ),
    }));
  };

  return {
    formData,
    selectedFile,
    setSelectedFile,
    updateField,
    addComponent,
    removeComponent,
    updateComponent,
  };
}
