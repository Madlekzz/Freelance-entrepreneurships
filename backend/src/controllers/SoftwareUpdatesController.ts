import type { Request, Response } from "express";
import { supabaseAdmin } from "../db.js";

function inferCategory(sourceBranch: string | null): string {
  if (!sourceBranch) return "improvement";
  const prefix = sourceBranch.split("/")[0]?.toLowerCase();
  switch (prefix) {
    case "feature":
      return "new_feature";
    case "fix":
      return "bugfix";
    case "style":
      return "style";
    default:
      return "improvement";
  }
}

// GET /api/software-updates/current-month
// Public endpoint — no auth required
export async function getCurrentMonthUpdates(_req: Request, res: Response) {
  try {
    const now = new Date();
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

    const { data, error } = await supabaseAdmin
      .from("software_updates")
      .select("*")
      .gte("created_at", startOfMonth.toISOString())
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw error;

    // Map database columns to frontend-expected fields
    const mapped = (data ?? []).map((item) => ({
      id: String(item.id),
      title: item.pr_title,
      description: item.patch_notes,
      category: inferCategory(item.source_branch),
      created_at: item.created_at ?? item.merged_at ?? new Date().toISOString(),
      version: undefined,
    }));

    res.status(200).json(mapped);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Error al obtener actualizaciones";
    console.error("[getCurrentMonthUpdates Error]:", message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
