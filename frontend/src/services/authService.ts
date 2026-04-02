import api from "../config/api";
import type { Session, User } from "@supabase/supabase-js";
import type { LoginForm, RegisterForm, UserRole } from "../types";
import { supabase } from "../config/supabaseClient";

// Definimos la interfaz de la respuesta de tu backend
export interface LoginResponse {
	message: string;
	session: Session;
	user: User;
}

export interface SimpleResponse {
	message: string;
}

export interface SignupRequest {
	id: string;
	user_name: string;
	email: string;
	entrepreneurship_name?: string;
	role: UserRole[];
	reviewed_by?: string;
	created_at: string;
	status: "PENDIENTE" | "APROBADO" | "RECHAZADO";
}

export async function loginUser(
	credentials: LoginForm,
): Promise<LoginResponse> {
	// Usamos la instancia de axios 'api' que ya tienes configurada
	const { data } = await api.post<LoginResponse>("/auth/login", credentials);
	return data;
}

export async function requestAccess(
	formData: RegisterForm,
): Promise<SimpleResponse> {
	const { data } = await api.post<SimpleResponse>(
		"/auth/request-access",
		formData,
	);
	return data;
}

export async function getPendingRequests(): Promise<SignupRequest[]> {
	const { data } = await api.get<SignupRequest[]>("/auth/pending-requests");
	return data;
}

export async function approveAccessRequest(
	requestId: string,
): Promise<SimpleResponse> {
	const { data } = await api.post<SimpleResponse>(
		`/auth/approve-signup/${requestId}`,
	);
	return data;
}

export async function rejectAccessRequest(id: string): Promise<void> {
	await api.patch(`/auth/reject-signup/${id}`);
}

export async function updatePassword(password: string) {
	const { data, error } = await supabase.auth.updateUser({
		password: password,
	});

	if (error) throw error;
	return data;
}
