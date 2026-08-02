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
    try {
      await api.put(`/inventory/${id}`, { [field]: value });
      toast.success("Stock updated");
      fetchInventory();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading)
    return <div className="text-center py-10">Loading inventory...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Inventory</h2>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Unit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Threshold
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {ingredients.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {item.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {item.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <input
                    type="number"
                    value={item.stockQuantity}
                    onChange={(e) =>
                      updateStock(item.id, "stockQuantity", e.target.value)
                    }
                    className="w-20 p-1 border rounded"
                    step="0.1"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {item.minThreshold}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() =>
                      updateStock(
                        item.id,
                        "minThreshold",
                        prompt("New threshold:", item.minThreshold),
                      )
                    }
                    className="text-blue-600 hover:underline"
                  >
                    Edit threshold
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
