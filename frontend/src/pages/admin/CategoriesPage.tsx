import { useEffect, useState } from 'react';
import api from '../../services/api';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useMenuStore } from '../../store/menuStore';

export default function CategoriesPage() {
  const { categories, fetchCategories } = useMenuStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nameEn: '', nameAr: '', descEn: '', descAr: '' });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/categories', {
        name: { en: formData.nameEn, ar: formData.nameAr },
        description: { en: formData.descEn, ar: formData.descAr }
      });
      fetchCategories();
      setIsModalOpen(false);
      setFormData({ nameEn: '', nameAr: '', descEn: '', descAr: '' });
    } catch (err) {
      alert('Error creating category');
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 md:pb-0 relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="heading-lg uppercase border-b-4 border-primary-500 pb-2 inline-block">Categories</h1>
        <Button onClick={() => setIsModalOpen(true)} className="shadow-solid">
          Add Category
        </Button>
      </div>

      <div className="bg-white border-4 border-surface-900 shadow-solid overflow-x-auto">
        <table className="w-full text-left font-body">
          <thead className="bg-surface-900 text-white font-display uppercase tracking-wider text-sm">
            <tr>
              <th className="p-4">Name (EN)</th>
              <th className="p-4">Name (AR)</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-surface-200">
            {categories.map(cat => (
              <tr key={cat._id} className="hover:bg-surface-50 transition-colors">
                <td className="p-4 font-bold">{cat.name.en}</td>
                <td className="p-4 font-bold">{cat.name.ar}</td>
                <td className="p-4 text-right">
                  <Button size="sm" variant="secondary" className="opacity-50 cursor-not-allowed">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-surface-900/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-surface-900 shadow-solid w-full max-w-lg p-6">
            <h2 className="heading-md uppercase mb-6">New Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Name (EN)" value={formData.nameEn} onChange={e => setFormData({...formData, nameEn: e.target.value})} required />
              <Input label="Name (AR)" value={formData.nameAr} onChange={e => setFormData({...formData, nameAr: e.target.value})} required />
              <Input label="Description (EN)" value={formData.descEn} onChange={e => setFormData({...formData, descEn: e.target.value})} required />
              <Input label="Description (AR)" value={formData.descAr} onChange={e => setFormData({...formData, descAr: e.target.value})} required />
              
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
