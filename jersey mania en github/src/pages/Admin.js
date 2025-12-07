import React, { useState, useEffect, useMemo } from 'react';
import { productService } from '../services/productService';
import '../styles/admin.css';

export default function Admin({ onLogout }) {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null); // producto en edición o null para nuevo
  const [form, setForm] = useState({
    name: '',
    category: 'futbol',
    price: '',
    sizes: '',
    images: ['', '', '', ''], // ahora un array de hasta 4 urls
    discountPercent: '',
    discountExpires: ''
  });
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('id');
  const [formKids, setFormKids] = useState(false); // flag para indicar producto de niños

  useEffect(() => {
    setProducts(productService.getAll());
  }, []);

  const refresh = () => setProducts(productService.getAll());

  const handleChange = (field) => (e) => {
    setForm(prev => ({...prev, [field]: e.target.value}));
  };

  // manejar cambio en una de las 4 entradas de imagen
  const handleImageChange = (idx) => (e) => {
    setForm(prev => {
      const imgs = Array.isArray(prev.images) ? [...prev.images] : ['', '', '', ''];
      imgs[idx] = e.target.value;
      return { ...prev, images: imgs };
    });
  };

  const startNew = () => {
    setEditing(null);
    setForm({
      name: '',
      category: 'futbol',
      price: '',
      sizes: '',
      images: ['', '', '', ''],
      discountPercent: '',
      discountExpires: ''
    });
    // scroll to form for convenience
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = (p) => {
    setEditing(p.id);
    setForm({
      name: p.name || '',
      category: p.category || 'futbol',
      price: p.price || '',
      sizes: p.sizes ? p.sizes.join(', ') : '',
      images: (() => {
        const arr = Array.isArray(p.images) ? [...p.images] : [];
        // asegurar longitud 4
        while (arr.length < 4) arr.push('');
        return arr.slice(0,4);
      })(),
      discountPercent: p.discountPercent || '',
      discountExpires: p.discountExpires || ''
    });
    setFormKids(!!p.kids); // inicializar desde product.kids
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (p) => {
    if (!window.confirm(`Eliminar "${p.name}" ? Esta acción no se puede deshacer.`)) return;
    productService.remove(p.id);
    refresh();
  };

  const handleSave = (e) => {
    e && e.preventDefault();
    const payload = {
      name: form.name,
      category: form.category,
      price: Number(form.price) || 0,
      sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
      images: Array.isArray(form.images) ? form.images.map(s=>String(s).trim()).filter(Boolean).slice(0,4) : [],
      discountPercent: form.discountPercent ? Number(form.discountPercent) : 0,
      discountExpires: form.discountExpires || null,
      // solo el flag kids (sin subcategory)
      kids: !!formKids
    };
    if (editing) {
      productService.update(editing, payload);
    } else {
      productService.create(payload);
    }
    refresh();
    startNew();
  };

  const categories = useMemo(() => ['all','futbol','basket','beisbol'], []);
  const filtered = useMemo(() => {
    let list = products.slice();
    if (categoryFilter !== 'all') list = list.filter(p => p.category === categoryFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p => (p.name || '').toLowerCase().includes(q) || String(p.id) === q);
    }
    if (sortBy === 'price') list.sort((a,b)=> (a.price||0)-(b.price||0));
    else if (sortBy === 'name') list.sort((a,b)=> (a.name||'').localeCompare(b.name||''));
    else list.sort((a,b)=> Number(a.id) - Number(b.id));
    return list;
  }, [products, categoryFilter, query, sortBy]);

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h2>Panel de administración — Productos</h2>
        <div className="admin-actions">
          <button className="btn" onClick={startNew}>+ Nuevo producto</button>
          {typeof onLogout === 'function' && <button className="btn btn-ghost" onClick={onLogout}>Cerrar sesión admin</button>}
        </div>
      </header>

      <div className="admin-grid">
        <aside className="admin-left">
          <div className="admin-filters">
            <input className="input" placeholder="Buscar por nombre o id" value={query} onChange={e=>setQuery(e.target.value)} />
            <div className="row">
              <select className="select" value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)}>
                {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'Todas' : c}</option>)}
              </select>
              <select className="select" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
                <option value="id">Orden: id</option>
                <option value="name">Orden: nombre</option>
                <option value="price">Orden: precio</option>
              </select>
            </div>
          </div>

          <div className="product-list-admin">
            {filtered.length === 0 ? (
              <div className="empty">No hay productos</div>
            ) : filtered.map(p => (
              <div key={p.id} className="product-row-admin">
                <div className="product-thumb" onClick={() => handleEdit(p)} title="Editar">
                  {p.images && p.images[0] ? (
                    <img src={p.images[0]} alt={p.name} onError={(e)=>{ e.currentTarget.style.display='none'; }} />
                  ) : (
                    <div className="thumb-empty">No image</div>
                  )}
                </div>
                <div className="product-info" onClick={() => handleEdit(p)}>
                  <div className="product-name">{p.name}</div>
                  <div className="product-meta">{p.category} · {p.sizes ? p.sizes.join(', ') : '—'}</div>
                </div>
                <div className="product-actions">
                  <div className="product-price">${p.price}</div>
                  <button className="btn btn-sm" onClick={() => handleEdit(p)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="admin-right">
          <form className="admin-form" onSubmit={handleSave}>
            <h3>{editing ? `Editar #${editing}` : 'Crear producto'}</h3>
            <div className="form-grid">
              <label>
                Nombre
                <input className="input" required value={form.name} onChange={handleChange('name')} />
              </label>
              <label>
                Categoría
                <select className="select" value={form.category} onChange={handleChange('category')}>
                  <option value="futbol">futbol</option>
                  <option value="basket">basket</option>
                  <option value="beisbol">beisbol</option>
                </select>
              </label>
              <label>
                Precio
                <input className="input" value={form.price} onChange={handleChange('price')} />
              </label>
              <label>
                Tallas (coma separados)
                <input className="input" value={form.sizes} onChange={handleChange('sizes')} />
              </label>
              <label style={{gridColumn: '1 / -1'}}>
                Imágenes (1–4 URLs). Deja vacío si no aplica.
                <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8, marginTop:8}}>
                  {Array.from({length:4}).map((_,i) => (
                    <input key={i} className="input" placeholder={`Imagen ${i+1} URL`} value={(form.images && form.images[i]) || ''} onChange={handleImageChange(i)} />
                  ))}
                </div>
              </label>
              <label>
                Descuento %
                <input className="input" value={form.discountPercent} onChange={handleChange('discountPercent')} />
              </label>
              <label>
                Discount expires (ISO)
                <input className="input" value={form.discountExpires} onChange={handleChange('discountExpires')} />
              </label>
              {/* Flag: Es de niños */}
              <label style={{display:'flex', alignItems:'center', gap:8, marginTop:8}}>
                <input
                  type="checkbox"
                  checked={formKids}
                  onChange={(e) => setFormKids(e.target.checked)}
                  id="kids-flag"
                />
                <span style={{fontWeight:700}}>Es de niños</span>
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">{editing ? 'Guardar cambios' : 'Crear producto'}</button>
              <button type="button" className="btn btn-ghost" onClick={startNew}>Limpiar</button>
              <button type="button" className="btn btn-outline" onClick={() => { setProducts(productService.getAll()); }}>Refrescar</button>
            </div>
            <div style={{marginTop:8, fontSize:12, color:'#666'}}>
              Tip: haz click en la miniatura o nombre para editar rápidamente.
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
