import type { LucideIcon } from "lucide-react";

// ── Auth ────────────────────────────────────────────────────────────
export type UserRole = "IT" | "ADMIN" | "PROVEEDOR" | "CONSUMIDOR";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  user_metadata: {
    roles: UserRole[];
  };
}

// ── Domain ──────────────────────────────────────────────────────────
export interface Entrepreneurship {
  id: number;
  owner_id: string;
  name: string;
  is_active: boolean;
}

export interface Product {
  id: number;
  entrepreneurship_id: number;
  name: string;
  price: number;
  current_stock: number;
  image: string | null;
  is_active: boolean;
}

export interface Sale {
  id: number;
  consumer_id: string;
  product_id: number;
  quantity: number;
  unit_price: number;
  total: number;
  payroll_processed: boolean;
  created_at: string;
}

export interface EntrepreneurshipInfo {
  name: string;
}

export interface ProductInfo {
  name: string;
  entrepreneurships: EntrepreneurshipInfo;
}

export interface SaleItem {
  products: ProductInfo;
  quantity: number;
  unit_price: number;
}

export interface UserInfo {
  name: string;
}

export interface ConsumerSale {
  id: string;
  created_at: string;
  total: number;
  payroll_processed: boolean;
  users: UserInfo;
  sale_items: SaleItem[];
}

export interface RegistrationRequest {
  id: number;
  nombre: string;
  correo: string;
  rol: UserRole;
  estado: "PENDIENTE" | "APROBADO" | "RECHAZADO";
}

// ── Nav ─────────────────────────────────────────────────────────────
export type MenuItem = {
  id: string;
  label: string;
  icon: LucideIcon; // Usamos el tipo específico de Lucide para mayor seguridad
  roles: UserRole[];
  path?: string;
};

// ── UI ──────────────────────────────────────────────────────────────
export type BadgeVariant =
  | "active"
  | "inactive"
  | "pending"
  | "processed"
  | "rejected"
  | "IT"
  | "ADMIN"
  | "PROVEEDOR";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "success"
  | "danger"
  | "ghost";
export type ButtonSize = "sm" | "md" | "lg";
export type StatColor = "blue" | "green" | "amber" | "red" | "default";

export interface SidebarUser {
  id: string;
  name: string;
  initials: string;
  role: string;
}

export interface LoginFormType {
  email: string;
  password: string;
}

export interface RegisterForm {
  user_name: string;
  email: string;
  entrepreneurship_name: string;
  role: UserRole[];
}

export interface ApiErrorResponse {
  error?: string;
  message?: string;
  status?: number;
}

// Extendemos el Error nativo para incluir el status sin usar any
export class AppError extends Error {
  status?: number;
  isAxiosError: boolean;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.isAxiosError = true;
    // Necesario para que el instanceof funcione correctamente en TS
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
