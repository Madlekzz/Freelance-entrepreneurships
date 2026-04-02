import { useState } from "react";
import type { CatalogProduct } from "../services/productService";

type Cart = Record<number, number>;

export function useCart(allProducts: CatalogProduct[]) {
	const [cart, setCart] = useState<Cart>({});
	const [drawerOpen, setDrawer] = useState(false);

	const addToCart = (id: number) => setCart((c) => ({ ...c, [id]: 1 }));

	const changeQty = (id: number, delta: number) =>
		setCart((c) => {
			const next = (c[id] ?? 0) + delta;
			if (next <= 0) {
				const newCart = { ...c };
				delete newCart[id];
				return newCart;
			}
			// Validamos contra el stock máximo del producto
			const maxStock = allProducts.find((p) => p.id === id)?.current_stock ?? 0;
			return { ...c, [id]: Math.min(next, maxStock) };
		});

	const removeFromCart = (id: number) =>
		setCart((c) => {
			const newCart = { ...c };
			delete newCart[id];
			return newCart;
		});

	const clearCart = () => setCart({});

	const cartEntries = Object.entries(cart)
		.map(([id, qty]) => ({
			product: allProducts.find((p) => String(p.id) === id)!,
			qty,
		}))
		.filter((e) => e.product !== undefined);

	const cartCount = Object.values(cart).reduce((s, q) => s + q, 0);
	const cartTotal = cartEntries.reduce(
		(s, { product, qty }) => s + product.price * qty,
		0,
	);

	return {
		cart,
		cartCount,
		cartTotal,
		cartEntries,
		addToCart,
		changeQty,
		removeFromCart,
		clearCart,
		drawerOpen,
		setDrawer,
	};
}
