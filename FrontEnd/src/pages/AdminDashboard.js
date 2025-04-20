import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { FaTrashAlt, FaSignOutAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setUsers(Array.isArray(data.results) ? data.results : []);
      } catch (err) {
        console.error("Admin fetch failed:", err);
      }
    };

    fetchUsers();
  }, []);

  // Delete User
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        },
      });

      const result = await res.json();

      if (res.ok) {
        setUsers((prevUsers) => prevUsers.filter((u) => u.user_id !== id));
        alert(result.message || "User deleted successfully.");
      } else {
        const errorMessage = typeof result.message === "string"
          ? result.message
          : JSON.stringify(result.message);
        alert(`Delete failed: ${errorMessage}`);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("An error occurred while deleting the user.");
    }
  };

  const filteredUsers = filter === "all" ? users : users.filter((u) => u.role === filter);

  const categories = [
    { label: "Doctors", role: "doctor" },
    { label: "Frontdesk", role: "frontdesk" },
    { label: "Data Entry", role: "dataentry" },
  ];

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-600 transition-colors"
        >
          <FaSignOutAlt />
        </button>
      </div>

      <h1 className="text-5xl font-bold text-center text-blue-800 mb-9">Admin Dashboard</h1>

      <div className="flex gap-6 mb-8 justify-center">
        <div
          onClick={() => setFilter("all")}
          className="p-6 bg-gray-200 rounded-lg cursor-pointer w-36 text-center shadow-xl hover:bg-gray-300 transition-colors"
        >
          <strong>All</strong>
          <p>{users.length} users</p>
        </div>

        {categories.map(({ label, role }) => (
          <div
            key={role}
            className="p-6 bg-gray-200 rounded-lg w-36 text-center shadow-xl hover:bg-gray-300 transition-colors relative"
          >
            <div onClick={() => setFilter(role)} className="cursor-pointer">
              <strong>{label}</strong>
              <p>{users.filter((u) => u.role === role).length} users</p>
            </div>
            <button
              onClick={() => navigate(`/${role}/register`, { state: { from: location.pathname } })}
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              + Add
            </button>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-semibold mb-4 capitalize">{filter} List</h3>

      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user, idx) => (
            <div
              key={idx}
              className="p-6 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-xl relative"
            >
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
              {user.specialization && <p><strong>Specialization:</strong> {user.specialization}</p>}
              {user.shift && <p><strong>Shift:</strong> {user.shift}</p>}
              {user.department && <p><strong>Department:</strong> {user.department}</p>}

              <button
                onClick={() => handleDelete(user.user_id)}
                className="absolute bottom-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
              >
                <FaTrashAlt />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">No users found for this category.</p>
      )}
    </div>
  );
};

export default AdminDashboard;
