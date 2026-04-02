import { supabaseAdmin } from "../db.ts";

export const uploadProductImage = async (
  file: Express.Multer.File,
  path: string,
) => {
  const { data, error } = await supabaseAdmin.storage
    .from("product-images")
    .upload(path, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) throw error;

  const { data: urlData } = supabaseAdmin.storage
    .from("product-images")
    .getPublicUrl(data.path);

  return urlData.publicUrl;
};
