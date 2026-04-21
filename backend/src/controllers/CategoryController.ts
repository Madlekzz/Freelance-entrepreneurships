import type { Request, Response } from "express";
import { supabaseAdmin } from "../db.js";

export async function getAllCategories(req: Request, res: Response) {
  const { data, error } = await supabaseAdmin.from("categories").select("*");

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
}
