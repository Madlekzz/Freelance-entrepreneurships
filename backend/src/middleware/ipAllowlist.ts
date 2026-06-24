import type { NextFunction, Request, Response } from "express";

export function ipAllowlist(req: Request, res: Response, next: NextFunction) {
	console.log("[ipAllowlist] req.ip:", req.ip, "| x-forwarded-for:", req.headers["x-forwarded-for"]);
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
