import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit, ArrowLeft, X } from 'lucide-react';

const CMS_API = import.meta.env.VITE_CMS_API || 'http://localhost:3001/api';

export default function AdminProgrammes() {
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    url: '',
    category: 'Computing'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProgrammes();
  }, []);

  const fetchProgrammes = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${CMS_API}/programmes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProgrammes(data);
      }
    } catch (err) {
      console.error('Failed to fetch programmes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('adminToken');
      const url = editing
        ? `${CMS_API}/programmes/${editing.id}`
        : `${CMS_API}/programmes`;
      const method = editing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        await fetchProgrammes();
        setShowModal(false);
        setEditing(null);
        setFormData({ code: '', name: '', url: '', category: 'Computing' });
      }
    } catch (err) {
      console.error('Failed to save programme:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (programme) => {
    setEditing(programme);
    setFormData({
      code: programme.code,
      name: programme.name,
      url: programme.url,
      category: programme.category
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this programme?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${CMS_API}/programmes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        await fetchProgrammes();
      }
    } catch (err) {
      console.error('Failed to delete programme:', err);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setFormData({ code: '', name: '', url: '', category: 'Computing' });
  };

  const computingProgrammes = programmes.filter(p => p.category === 'Computing');
  const mathematicsProgrammes = programmes.filter(p => p.category === 'Mathematics');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manage Programmes</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
          >
            <Plus size={20} />
            Add Programme
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Computing Programmes */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Computing ({computingProgrammes.length})</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {computingProgrammes.map((prog) => (
                        <tr key={prog.id}>
                          <td className="px-6 py-4 font-medium text-gray-900">{prog.code}</td>
                          <td className="px-6 py-4 text-gray-700">{prog.name}</td>
                          <td className="px-6 py-4">
                            <a href={prog.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                              {prog.url}
                            </a>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleEdit(prog)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(prog.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {computingProgrammes.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      No computing programmes yet.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mathematics Programmes */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mathematics ({mathematicsProgrammes.length})</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-purple-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mathematicsProgrammes.map((prog) => (
                        <tr key={prog.id}>
                          <td className="px-6 py-4 font-medium text-gray-900">{prog.code}</td>
                          <td className="px-6 py-4 text-gray-700">{prog.name}</td>
                          <td className="px-6 py-4">
                            <a href={prog.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                              {prog.url}
                            </a>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleEdit(prog)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(prog.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {mathematicsProgrammes.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      No mathematics programmes yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editing ? 'Edit Programme' : 'Add New Programme'}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="e.g., CS700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="e.g., Master of Computer Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  >
                    <option value="Computing">Computing</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : editing ? 'Update Programme' : 'Create Programme'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

