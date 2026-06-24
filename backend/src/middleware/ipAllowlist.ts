import type { NextFunction, Request, Response } from "express";

export function ipAllowlist(req: Request, res: Response, next: NextFunction) {
	const raw = process.env.ALLOWED_IPS;
	if (!raw || raw.trim() === "") return next();

	const allowed = raw
		.split(",")
		.map((ip) => ip.trim())
		.filter(Boolean);

	// Use the leftmost X-Forwarded-For entry (original client IP).
	// Falls back to req.ip for direct connections (local dev).
	const forwarded = req.headers["x-forwarded-for"];
	const clientIp =
		typeof forwarded === "string"
			? (forwarded.split(",")[0]?.trim() ?? "")
			: (req.ip ?? "");

	if (allowed.includes(clientIp)) return next();

	res.status(403).json({ error: "Access denied" });
}
