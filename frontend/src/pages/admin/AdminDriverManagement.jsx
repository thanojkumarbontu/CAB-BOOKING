import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDriverManagement.css";

const AdminDriverManagement = () => {
  console.log("driver management")
  const [drivers, setDrivers] = useState([]);
  const [newDriver, setNewDriver] = useState({ name: "", license: "", rating: "" });
  const [showModal, setShowModal] = useState(false);

  const fetchDrivers = async () => {
    try {
      const res = await axios.get("/api/admin/drivers");
       console.log("Fetched drivers:", res.data); // Add this line to debug
    // setDrivers(res.data.drivers);
      setDrivers(res.data);
    } catch (error) {
      console.error("Error fetching drivers", error);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleChange = (e) => {
    setNewDriver({ ...newDriver, [e.target.name]: e.target.value });
  };

  const handleAddDriver = async () => {
    try {
      await axios.post("/api/admin/drivers", newDriver);
      setShowModal(false);
      setNewDriver({ name: "", license: "", rating: "" });
      fetchDrivers();
    } catch (error) {
      console.error("Error adding driver", error);
    }
  };

  const handleDeleteDriver = async (id) => {
    try {
      await axios.delete(`/api/admin/drivers/${id}`);
      fetchDrivers();
    } catch (error) {
      console.error("Error deleting driver", error);
    }
  };

  return (
    <div className="admin-driver-management">
      <h2>Driver Management</h2>
      <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Driver</button>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>License</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* {drivers.map((driver) => (
            <tr key={driver._id}>
              <td>{driver.name}</td>
              <td>{driver.license}</td>
              <td>{driver.rating}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDeleteDriver(driver._id)}>Delete</button>
              </td>
            </tr>
          ))} */}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Driver</h3>
            <input name="name" value={newDriver.name} onChange={handleChange} placeholder="Driver Name" />
            <input name="license" value={newDriver.license} onChange={handleChange} placeholder="License Number" />
            <input name="rating" value={newDriver.rating} onChange={handleChange} placeholder="Rating (1-5)" />

            <div className="modal-buttons">
              <button onClick={handleAddDriver}>Add</button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDriverManagement;
