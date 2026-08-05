import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { PlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const blankForm = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  preparationTimeMinutes: "",
  isAvailable: true,
};

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(blankForm);

  const fetchMenu = async () => {
    try {
      const res = await api.get("/menu/items");
      setItems(res.data.data);
    } catch (err) {
      toast.error("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/menu/categories");
      setCategories(res.data.data);
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchMenu();
    fetchCategories();
  }, []);

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(blankForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/menu/items/${editingId}`, formData);
        toast.success("Item updated");
      } else {
        await api.post("/menu/items", formData);
        toast.success("Item created");
      }
      resetForm();
      fetchMenu();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return;
    try {
      await api.delete(`/menu/items/${id}`);
      toast.success("Item deleted");
      fetchMenu();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price,
      categoryId: item.categoryId,
      preparationTimeMinutes: item.preparationTimeMinutes || "",
      isAvailable: item.isAvailable,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  if (loading) return <ListSkeleton title="Loading menu..." />;

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <div className="eyebrow">Menu Studio</div>
          <h2 className="page-title">Menu Items</h2>
          <p className="page-subtitle">Price, availability, categories, and prep timing.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          <PlusIcon className="h-5 w-5" />
          Add Item
        </button>
      </div>

      {showForm && (
        <div className="modal-backdrop">
          <div className="modal-panel">
            <div className="mb-4">
              <div className="eyebrow">{editingId ? "Edit" : "Create"}</div>
              <h3 className="m-0 text-xl font-extrabold text-stone-900">
                {editingId ? "Edit Menu Item" : "Add Menu Item"}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="field"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="field min-h-24"
                rows="3"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="field"
                  required
                  step="0.01"
                />
                <input
                  type="number"
                  placeholder="Prep time (minutes)"
                  value={formData.preparationTimeMinutes}
                  onChange={(e) =>
                    setFormData({ ...formData, preparationTimeMinutes: e.target.value })
                  }
                  className="field"
                />
              </div>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="field"
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-3 rounded-lg bg-stone-50 p-3 font-bold text-stone-700">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="h-4 w-4 accent-teal-700"
                />
                Available
              </label>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={resetForm} className="btn btn-soft">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="panel">
        {items.length === 0 ? (
          <div className="table-empty">No menu items yet. Add the first item to start building the menu.</div>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Prep</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="font-extrabold text-stone-900">{item.name}</div>
                      {item.description && (
                        <div className="mt-1 max-w-xs truncate text-sm text-stone-500">
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td className="font-bold">${Number(item.price || 0).toFixed(2)}</td>
                    <td>{categories.find((c) => c.id === item.categoryId)?.name || "-"}</td>
                    <td>{item.preparationTimeMinutes || "-"} min</td>
                    <td>
                      <span className={`status-chip ${item.isAvailable ? "status-good" : "status-bad"}`}>
                        {item.isAvailable ? "Available" : "Hidden"}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(item)} className="btn btn-soft" title="Edit">
                          <PencilSquareIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="btn btn-danger"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

function ListSkeleton({ title }) {
  return (
    <section className="page">
      <div className="mb-5 max-w-md space-y-3">
        <div className="skeleton-line w-24" />
        <div className="skeleton-line w-64" />
      </div>
      <div className="panel p-5">
        <div className="mb-4 text-sm font-bold text-stone-500">{title}</div>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="grid grid-cols-6 gap-3">
              <div className="skeleton-line col-span-2" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
