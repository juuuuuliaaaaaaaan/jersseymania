import defaultProducts from '../data/products';

const PRODUCTS_KEY = 'jm_products';

function readProducts() {
	// inicializar con productos por defecto si no existen
	const raw = localStorage.getItem(PRODUCTS_KEY);
	if (!raw) {
		localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
		return [...defaultProducts];
	}
	try {
		return JSON.parse(raw);
	} catch {
		return [...defaultProducts];
	}
}

function writeProducts(products) {
	localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export const productService = {
	getAll() {
		return readProducts();
	},
	getProductsByCategory(category) {
		const all = readProducts();
		return all.filter(p => p.category === category);
	},
	getById(id) {
		const all = readProducts();
		return all.find(p => Number(p.id) === Number(id)) || null;
	},
	create(product) {
		const all = readProducts();
		const maxId = all.length ? Math.max(...all.map(p => Number(p.id) || 0)) : 0;
		const id = maxId + 1;
		const newProduct = {
			id,
			name: product.name || 'Nuevo producto',
			category: product.category || 'futbol',
			images: Array.isArray(product.images) ? product.images : (product.images ? product.images.split(',').map(s => s.trim()) : []),
			price: Number(product.price) || 0,
			sizes: Array.isArray(product.sizes) ? product.sizes : (product.sizes ? product.sizes.split(',').map(s => s.trim()) : []),
			discountPercent: product.discountPercent ? Number(product.discountPercent) : 0,
			discountExpires: product.discountExpires || null
		};
		all.push(newProduct);
		writeProducts(all);
		return newProduct;
	},
	update(id, patch) {
		const all = readProducts();
		const idx = all.findIndex(p => Number(p.id) === Number(id));
		if (idx === -1) return null;
		const current = all[idx];
		const updated = {
			...current,
			...patch,
			images: patch.images !== undefined ? (Array.isArray(patch.images) ? patch.images : String(patch.images).split(',').map(s => s.trim())) : current.images,
			sizes: patch.sizes !== undefined ? (Array.isArray(patch.sizes) ? patch.sizes : String(patch.sizes).split(',').map(s => s.trim())) : current.sizes,
			price: patch.price !== undefined ? Number(patch.price) : current.price,
			discountPercent: patch.discountPercent !== undefined ? Number(patch.discountPercent) : current.discountPercent,
			discountExpires: patch.discountExpires !== undefined ? patch.discountExpires : current.discountExpires
		};
		all[idx] = updated;
		writeProducts(all);
		return updated;
	},
	remove(id) {
		let all = readProducts();
		const exists = all.some(p => Number(p.id) === Number(id));
		if (!exists) return false;
		all = all.filter(p => Number(p.id) !== Number(id));
		writeProducts(all);
		return true;
	}
};
