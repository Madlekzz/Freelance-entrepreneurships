// src/utils/userUtils.ts
import type { UserRole } from "../types";

export const getUserInitials = (name?: string): string => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export const getRoleLabel = (roles: UserRole[]): string => {
  if (roles.length > 1) return "Multitarea";
  return roles[0] || "Usuario";
};
