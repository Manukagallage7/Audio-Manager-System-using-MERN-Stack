import { FiTrash2, FiUserCheck } from "react-icons/fi";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Users() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    (async () => {
      if (token) {
        try {
          const response = await axios.get("http://localhost:5000/api/users/users", {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          })
          const data = response.data;
          const users = Array.isArray(data) ? data : (data && data.users) ? data.users : [];
          if (users) setUsers(users);
        } catch (error) {
          console.error("Error fetching users:", error);
          console.error("Error response:", error.response?.data);
        } finally {
          setLoading(false);
        }
      } else {
        console.error("You must be logged in first.");
        setLoading(false);
      }
    })();
  }, [token, refreshToggle]);

  async function blockUser(email) {
    const token = localStorage.getItem("token");
    if (!token) return console.error("You must be logged in first.");
    try {
      await axios.put(`http://localhost:5000/api/users/users/block/${email}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // trigger refresh
      setRefreshToggle(v => !v);
    } catch (err) {
      console.error("Failed to block user:", err);
    }
  }

  async function unblockUser(email) {
    const token = localStorage.getItem("token");
    if (!token) return console.error("You must be logged in first.");
    try {
      await axios.put(`http://localhost:5000/api/users/users/unblock/${email}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // trigger refresh
      setRefreshToggle(v => !v);
    } catch (err) {
      console.error("Failed to unblock user:", err);
    }
  }

  function handleSearch(e) {
    setSearchQuery(e.target.value);
  }

  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true;
    const name = (user.firstName || "") + " " + (user.lastName || "");
    return name.toLowerCase().includes(searchQuery.trim().toLowerCase());
  });


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="relative mb-4">
          <h1 className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Users
          </h1>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden mt-12">
          <div className="p-4 border-b">
            <input value={searchQuery} onChange={handleSearch} className="w-full border rounded-md px-3 py-2 text-sm" placeholder="Search users..." />
          </div>

          <div className="p-4">
            {loading ? (
              <div className="text-center py-10 text-gray-500">
                <div className="flex flex-col items-center gap-3">
                  <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <div className="text-sm">Loading users...</div>
                </div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Phone Number</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredUsers.map((user) => (
                      <tr key={user.email} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{user.firstName} {user.lastName}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${user.type === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                            {user.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">{user.phoneNumber}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${user.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {user.blocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {user.type !== 'admin' && (
                            user.blocked ? (
                              <button onClick={() => unblockUser(user.email)} className="text-green-600 hover:text-green-800 inline-flex items-center gap-1">
                                <FiUserCheck /> Unblock
                              </button>
                            ) : (
                              <button onClick={() => blockUser(user.email)} className="text-red-600 hover:text-red-800 inline-flex items-center gap-1">
                                <FiTrash2 /> Block
                              </button>
                            )
                          )}
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