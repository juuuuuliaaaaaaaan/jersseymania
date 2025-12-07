import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const productService = {
	async getProductsByCategory(category) {
		const { data, error } = await supabase
			.from('products')
			.select('*')
			.eq('category', category);
		if (error) return [];
		return data;
	},
	async getAllProducts() {
		const { data, error } = await supabase
			.from('products')
			.select('*');
		if (error) return [];
		return data;
	},
	async updateProduct(product) {
		const { data, error } = await supabase
			.from('products')
			.update(product)
			.eq('id', product.id);
		return { data, error };
	},
	async createProduct(product) {
		const { data, error } = await supabase
			.from('products')
			.insert([product]);
		return { data, error };
	},
	async deleteProduct(id) {
		const { data, error } = await supabase
			.from('products')
			.delete()
			.eq('id', id);
		return { data, error };
	}
};
