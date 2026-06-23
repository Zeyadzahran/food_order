import { useEffect, useState } from 'react';
import api from '../../services/api';

import { MenuItem } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useMenuStore } from '../../store/menuStore';

export default function ProductsPage() {
  const { items, categories, fetchMenu, fetchCategories } = useMenuStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nameEn: '', nameAr: '', descEn: '', descAr: '', price: '', category: '', imageUrl: '', isAvailable: true
  });

  useEffect(() => {
    fetchMenu();
    fetchCategories();
  }, [fetchMenu, fetchCategories]);

  const resetForm = () => {
    setFormData({ nameEn: '', nameAr: '', descEn: '', descAr: '', price: '', category: categories[0]?._id || '', imageUrl: '', isAvailable: true });
    setEditingId(null);
  };

  const handleEdit = (item: MenuItem) => {
    setFormData({
      nameEn: item.name.en, nameAr: item.name.ar,
      descEn: item.description.en, descAr: item.description.ar,
      price: String(item.price),
      category: typeof item.category === 'object' ? item.category._id : item.category,
      imageUrl: item.imageUrl,
      isAvailable: item.isAvailable
    });
    setEditingId(item._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to completely disable this item?')) {
      await api.delete(`/menu/${id}`);
      fetchMenu();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: { en: formData.nameEn, ar: formData.nameAr },
      description: { en: formData.descEn, ar: formData.descAr },
      price: Number(formData.price),
      category: formData.category,
      imageUrl: formData.imageUrl,
      isAvailable: formData.isAvailable
    };

    try {
      if (editingId) {
        await api.put(`/menu/${editingId}`, payload);
      } else {
        await api.post('/menu', payload);
      }
      setIsModalOpen(false);
      fetchMenu();
    } catch (err) {
      alert('Error saving product');
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 md:pb-0 relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="heading-lg uppercase border-b-4 border-primary-500 pb-2 inline-block">Products</h1>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="shadow-solid">
          Add New Item
        </Button>
      </div>

      <div className="bg-white border-4 border-surface-900 shadow-solid overflow-x-auto">
        <table className="w-full text-left font-body">
          <thead className="bg-surface-900 text-white font-display uppercase tracking-wider text-sm">
            <tr>
              <th className="p-4 w-20">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-surface-200">
            {items.map(item => (
              <tr key={item._id} className="hover:bg-surface-50 transition-colors">
                <td className="p-4">
                  <div className="w-12 h-12 bg-surface-200 border-2 border-surface-900 overflow-hidden">
                    {item.imageUrl && <img src={item.imageUrl} alt={item.name.en} className="w-full h-full object-cover" />}
                  </div>
                </td>
                <td className="p-4 font-bold">{item.name.en}</td>
                <td className="p-4">{typeof item.category === 'object' ? item.category.name?.en : 'Unknown'}</td>
                <td className="p-4 font-bold text-primary-600">{item.price} EGP</td>
                <td className="p-4">
                  <span className={`px-2 py-1 border-2 border-surface-900 font-display text-xs font-bold uppercase ${item.isAvailable ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'}`}>
                    {item.isAvailable ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="p-4 space-x-2">
                  <Button size="sm" variant="secondary" onClick={() => handleEdit(item)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(item._id)}>Disable</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-surface-900/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-surface-900 shadow-solid w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="heading-md uppercase mb-6">{editingId ? 'Edit Product' : 'New Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Name (EN)" value={formData.nameEn} onChange={e => setFormData({...formData, nameEn: e.target.value})} required />
                <Input label="Name (AR)" value={formData.nameAr} onChange={e => setFormData({...formData, nameAr: e.target.value})} required />
                <Input label="Description (EN)" value={formData.descEn} onChange={e => setFormData({...formData, descEn: e.target.value})} required />
                <Input label="Description (AR)" value={formData.descAr} onChange={e => setFormData({...formData, descAr: e.target.value})} required />
                <Input label="Price" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                <Input label="Image URL" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} required />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label className="font-display font-semibold text-sm uppercase tracking-wide text-surface-900">Category</label>
                <select 
                  className="flex h-12 w-full border-2 border-surface-900 bg-surface-50 px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500" 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  required
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name.en}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 font-display font-bold">
                <input type="checkbox" checked={formData.isAvailable} onChange={e => setFormData({...formData, isAvailable: e.target.checked})} className="w-5 h-5" />
                Is Available
              </label>

              <div className="flex gap-4 mt-8 pt-4 border-t-2 border-surface-200">
                <Button type="submit" className="flex-1">Save</Button>
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
