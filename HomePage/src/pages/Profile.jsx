import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit } from "react-icons/fa";

const ProfilePage = () => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [reportedItems, setReportedItems] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserProfile(res.data.user);
        setFormData(res.data.user);
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserItems = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/user-items", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setReportedItems(res.data);
      } catch (err) {
        toast.error("Failed to fetch your items");
      }
    };

    fetchProfile();
    fetchUserItems();
  }, []);

  const handleEditClick = () => setShowEditForm(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedForm = new FormData();
    updatedForm.append("name", formData.name);
    updatedForm.append("college", formData.college);
    updatedForm.append("branch", formData.branch);
    updatedForm.append("year", formData.year);
    if (formData.image instanceof File) {
      updatedForm.append("image", formData.image);
    }

    try {
      const res = await axios.put("http://localhost:5000/api/auth/update-profile", updatedForm, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUserProfile(res.data.user);
      setShowEditForm(false);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  const handleViewDetails = (id) => navigate(`/item-details/${id}`);

  const confirmDelete = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setItemToDelete(null);
    setShowDeleteModal(false);
  };

  const deleteItem = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/user-items/${itemToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setReportedItems((prev) => prev.filter((item) => item._id !== itemToDelete));
      setItemToDelete(null);
      setShowDeleteModal(false);
      toast.success("Item deleted successfully");
    } catch (err) {
      toast.error("Failed to delete item");
    }
  };

  if (loading) return <div className="profile-container">Loading...</div>;
  if (!userProfile) return <div className="profile-container">User not found.</div>;

  return (
    <div className="profile-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="profile-header">
        <div>
          <h1>My Profile</h1>
          <p>Manage your account details, view your activity, and update preferences.</p>
        </div>
        <button className="edit-btn" onClick={handleEditClick}><FaEdit /> Edit Profile</button>
      </div>

      <div className="profile-main">
        <div className="profile-card">
          <div className="avatar-container">
            {userProfile.image ? (
              <img src={`http://localhost:5000${userProfile.image}`} alt="profile" className="avatar" />
            ) : (
              <div className="avatar-placeholder">100×100</div>
            )}
          </div>
          <h2>{userProfile.name}</h2>
          <p style={{ fontSize: "14px" }}>{userProfile.email}</p>
          <p style={{ fontSize: "14px" }}>{userProfile.branch}</p>
          <p style={{ fontSize: "14px" }}>{userProfile.college}</p>
          <p style={{ fontSize: "14px" }}>{userProfile.year}</p>
        </div>

        <div className="activity-card">
          <h3>Activity Overview</h3>
          <div className="activity-stats">
            <div className="stat-box"><h2>{reportedItems.length}</h2><p>Items Reported</p></div>
            <div className="stat-box"><h2>0</h2><p>Items Claimed</p></div>
            <div className="stat-box"><h2>0</h2><p>Items Returned</p></div>
          </div>
        </div>
      </div>

      <div className="reported-section">
        <h3>Your Reported Items</h3>
        <div className="all-itmes-container-cards">
          {reportedItems.map((item) => (
            <div className="lost-card" key={item._id}>
              <div className="card-image">
                {item.images?.[0] ? (
                  <img src={`http://localhost:5000/uploads/${item.images[0]}`} alt={item.title} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
                <div className="card-labels">
                  <span className={`badge status ${item.status.toLowerCase()}`}>{item.status}</span>
                </div>
              </div>
              <div className="card-content">
                <h3 className="lost-title">{item.title}</h3>
                <p className="desc">{item.description}</p>
                <div className="card-info">
                  <p>{item.location}</p>
                  <p>{item.status} on: {new Date(item.lostDate).toLocaleDateString()}</p>
                </div>
                <div className="btn-group">
                  <button className="details-btn" onClick={() => handleViewDetails(item._id)}>View Details</button>
                  <button className="details-btn delete-btn" onClick={() => confirmDelete(item._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {showEditForm && (
        <>
          <div className="modal-backdrop" onClick={() => setShowEditForm(false)}></div>
          <div className="modal fade-in">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit}>
              <label>Name: <input name="name" value={formData.name || ""} onChange={handleChange} required /></label>
              <label>Branch: <input name="branch" value={formData.branch || ""} onChange={handleChange} required /></label>
              <label>College: <input name="college" value={formData.college || ""} onChange={handleChange} required /></label>
              <label>Year:
                <select name="year" value={formData.year || ""} onChange={handleChange}>
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </label>
              <label>Upload Photo: <input type="file" accept="image/*" onChange={handleImageUpload} /></label>
              <div className="modal-actions">
                <button type="submit">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setShowEditForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </>
      )}


      {showDeleteModal && itemToDelete && (
        <>
          <div className="modal-backdrop show" onClick={cancelDelete}></div>
          <div className="modal confirm-modal pop-slide">
            <h3>Are you sure you want to delete this item?</h3>
            <div className="modal-actions">
              <button onClick={deleteItem} className="confirm-delete">Yes, Delete</button>
              <button onClick={cancelDelete} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
