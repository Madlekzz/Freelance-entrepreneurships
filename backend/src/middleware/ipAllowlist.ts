import type { NextFunction, Request, Response } from "express";

export function ipAllowlist(req: Request, res: Response, next: NextFunction) {
	const raw = process.env.ALLOWED_IPS;
	if (!raw || raw.trim() === "") return next();

	const allowed = raw
		.split(",")
		.map((ip) => ip.trim())
		.filter(Boolean);
	const clientIp = req.ip ?? "";

	if (allowed.includes(clientIp)) return next();

	res.status(403).json({ error: "Access denied" });
}
