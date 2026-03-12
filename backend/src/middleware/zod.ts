import type { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

export const validate =
	(schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse(req.body); // Si falla, salta al catch
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({
					status: "error",
					errors: error.errors.map((err) => ({
						path: err.path[0],
						message: err.message,
					})),
				});
			}
			return res.status(500).json({ message: "Error interno" });
		}
	};
