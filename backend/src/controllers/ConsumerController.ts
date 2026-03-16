import type { Request, Response } from "express";
import { supabase } from "../db.ts";

// [ADMIN/IT] Obtener todos los consumidores
export async function getAllConsumers(req: Request, res: Response) {
  const { data, error } = await supabase
    .from("consumers")
    .select("*");

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
}

// [ADMIN/IT] Obtener un consumidor por cédula
export async function getConsumerByCedula(req: Request, res: Response) {
  const { cedula } = req.params;

  const { data, error } = await supabase
    .from("consumers")
    .select("*")
    .eq("cedula", cedula)
    .single();

  if (error) return res.status(404).json({ error: "Consumidor no encontrado" });
  res.status(200).json(data);
}

// [PÚBLICO] Crear un consumidor — se ejecuta durante el flujo de compra
export async function createConsumer(req: Request, res: Response) {
  const { cedula, nombre, departamento, slack_id } = req.body;

  if (!cedula || !nombre || !departamento || !slack_id) {
    return res.status(400).json({ error: "Los campos cedula, nombre, departamento  y slack_id son obligatorios" });
  }

  // Si el consumidor ya existe, lo retornamos en vez de crear un duplicado
  const { data: existing } = await supabase
    .from("consumers")
    .select("*")
    .eq("cedula", cedula)
    .single();

  if (existing) {
    return res.status(200).json(existing);
  }

  const { data, error } = await supabase
    .from("consumers")
    .insert({ cedula, nombre, departamento, slack_id: slack_id })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
}

// [ADMIN/IT] Actualizar un consumidor
export async function updateConsumer(req: Request, res: Response) {
  const { cedula } = req.params;
  const updates = req.body;

  const { data: consumer } = await supabase
    .from("consumers")
    .select("cedula")
    .eq("cedula", cedula)
    .single();

  if (!consumer) {
    return res.status(404).json({ error: "Consumidor no encontrado" });
  }

  const { data, error } = await supabase
    .from("consumers")
    .update(updates)
    .eq("cedula", cedula)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ message: "Consumidor actualizado correctamente", data });
}

// [IT] Eliminar un consumidor
export async function deleteConsumer(req: Request, res: Response) {
  const { cedula } = req.params;

  if (!cedula) {
    return res.status(400).json({ error: "Cédula de consumidor inválida o ausente" });
  }

  try {
    const { error } = await supabase
      .from("consumers")
      .delete()
      .eq("cedula", cedula);

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: "Consumidor eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error interno" });
  }
}