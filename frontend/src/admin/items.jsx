import {CiCirclePlus} from "react-icons/ci";
import {FiEdit, FiTrash2} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Items() {

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    (async () => {
      if (token) {
        try {
          const response = await axios.get("http://localhost:5000/api/product", {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          })
          const data = response.data;
          const products = Array.isArray(data) ? data : (data && data.products) ? data.products : [];
          if (products) setItems(products);
        } catch (error) {
          console.error("Error fetching items:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.error("You must be logged in first.");
        setLoading(false);
      }
    })();
  }, [token, refreshToggle]);

  async function deleteItem(key) {
    const token = localStorage.getItem("token");
    if (!token) return console.error("You must be logged in first.");
    try {
      await axios.delete(`http://localhost:5000/api/product/${key}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // trigger refresh
      setRefreshToggle(v => !v);
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  }

  function handleEdit(item) {
    // navigate to update page with item key in state
    navigate('/adminPage/items/update', { state: { key: item.key } });
  }

  function handleSearch(e) {
    setSearchQuery(e.target.value);
  }

  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true;
    const name = item.name || "";
    return name.toLowerCase().includes(searchQuery.trim().toLowerCase());
  });


  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative mb-8">
          <h1 className="text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            Items Management
          </h1>
          <p className="text-center text-gray-500 mt-2">Manage and organize your product inventory</p>
          <Link to="/adminPage/items/add" className="absolute right-0 top-1/2 transform -translate-y-1/2 inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl">
            <CiCirclePlus className="text-xl" />
            <span className="text-sm font-medium">Add Item</span>
          </Link>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-white">
            <div className="relative">
              <input value={searchQuery} onChange={handleSearch} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm pl-10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="Search items..." />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="text-center py-10 text-gray-500">
                <div className="flex flex-col items-center gap-3">
                  <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <div className="text-sm">Loading items...</div>
                </div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No items found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="px-4 py-3">Item Key</th>
                      <th className="px-4 py-3">Item Name</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Dimensions</th>
                      <th className="px-4 py-3">Availability</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredItems.map((item) => (
                      <tr key={item.key} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{item.key}</td>
                        <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                        <td className="px-4 py-3">{item.category}</td>
                        <td className="px-4 py-3 text-gray-700">${item.price}</td>
                        <td className="px-4 py-3">{item.dimensions}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${item.availability !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {item.availability !== false ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td className="px-4 py-3 flex gap-2">
                          <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1">
                            <FiEdit /> Edit
                          </button>
                          <button onClick={() => deleteItem(item.key)} className="text-red-600 hover:text-red-800 inline-flex items-center gap-1">
                            <FiTrash2 /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}