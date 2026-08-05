import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Inventory() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      const res = await api.get("/inventory");
      setIngredients(res.data.data);
    } catch (err) {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const updateStock = async (id, field, value) => {
    if (value === null || value === "") return;
    try {
      await api.put(`/inventory/${id}`, { [field]: value });
      toast.success("Stock updated");
      fetchInventory();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading) return <InventorySkeleton />;

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <div className="eyebrow">Stock Room</div>
          <h2 className="page-title">Inventory</h2>
          <p className="page-subtitle">Keep ingredients above threshold before service gets tight.</p>
        </div>
        <span className="status-chip status-warn">
          {ingredients.filter((item) => Number(item.stockQuantity) <= Number(item.minThreshold)).length} low
        </span>
      </div>

      <div className="panel">
        {ingredients.length === 0 ? (
          <div className="table-empty">No inventory records found.</div>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Unit</th>
                  <th>Stock</th>
                  <th>Threshold</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((item) => {
                  const low = Number(item.stockQuantity) <= Number(item.minThreshold);
                  return (
                    <tr key={item.id}>
                      <td className="font-extrabold text-stone-900">{item.name}</td>
                      <td>{item.unit}</td>
                      <td>
                        <input
                          type="number"
                          value={item.stockQuantity}
                          onChange={(e) => updateStock(item.id, "stockQuantity", e.target.value)}
                          className="field max-w-28"
                          step="0.1"
                        />
                      </td>
                      <td className="font-bold">{item.minThreshold}</td>
                      <td>
                        <span className={`status-chip ${low ? "status-bad" : "status-good"}`}>
                          {low ? "Low stock" : "Ready"}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            updateStock(
                              item.id,
                              "minThreshold",
                              prompt("New threshold:", item.minThreshold),
                            )
                          }
                          className="btn btn-soft"
                        >
                          Edit threshold
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

function InventorySkeleton() {
  return (
    <section className="page">
      <div className="mb-5 max-w-md space-y-3">
        <div className="skeleton-line w-24" />
        <div className="skeleton-line w-64" />
      </div>
      <div className="panel p-5">
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
