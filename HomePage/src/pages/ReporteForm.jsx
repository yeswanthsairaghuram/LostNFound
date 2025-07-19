 


 import React, { useState } from 'react';
import './Reportpage.css';
import personal from '../assets/category-icons/personal.png';
import docs from '../assets/category-icons/docs.png';
import stationary from '../assets/category-icons/stationary.png';
import gadgets from '../assets/category-icons/gadgets.png';
import academic from '../assets/category-icons/academic.png';
import cloths from '../assets/category-icons/cloths.png';
import jewelry from '../assets/category-icons/jewelry.png';
import others from '../assets/category-icons/others.png';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const categories = [
  { category: "Personal Belongings", icon: personal, color: "#f9c74f" },
  { category: "Documents", icon: docs, color: "#90be6d" },
  { category: "Stationery Items", icon: stationary, color: "#f8961e" },
  { category: "Electronics & Gadgets", icon: gadgets, color: "#577590" },
  { category: "Academic Items", icon: academic, color: "#43aa8b" },
  { category: "Clothing & Accessories", icon: cloths, color: "#ff6b6b" },
  { category: "Jewelry", icon: jewelry, color: "#c77dff" },
  { category: "Others", icon: others, color: "#adb5bd" }
];

const ReporteForm = () => {
  const [activeTab, setActiveTab] = useState('lost');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    building: '',
    images: [],
    isEmergency: false,
    reward: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setForm(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory) {
      toast.warn("Please select a category before submitting.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("description", form.description.trim());
    formData.append("category", selectedCategory);
    formData.append("location", form.location.trim());
    formData.append("lostDate", form.date);
    formData.append("status", activeTab === 'lost' ? 'Lost' : 'Found');
    formData.append("poster", localStorage.getItem('userId'));
    formData.append("building", form.building);
    formData.append("reward", form.reward.trim());
    formData.append("isEmergency", form.isEmergency);

    form.images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      const res = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Report submitted successfully!", { autoClose: 3000 });
        setForm({
          title: '',
          description: '',
          date: '',
          location: '',
          building: '',
          images: [],
          isEmergency: false,
          reward: '',
        });
        setSelectedCategory('');
      } else {
        toast.error(data.message || "Submission failed", { autoClose: 3000 });
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.", { autoClose: 3000 });
      console.error("Submission failed", err);
    }

    setLoading(false);
  };

  return (
    <div className="report-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <button className="back-btn" onClick={() => navigate(-1)}>&larr; Back</button>
      <h3>Report an item</h3>

      <div className="tab-container">
        <button
          className={activeTab === 'lost' ? 'active' : ''}
          onClick={() => setActiveTab('lost')}
        >
          I Lost Something
        </button>
        <button
          className={activeTab === 'found' ? 'active' : ''}
          onClick={() => setActiveTab('found')}
        >
          I Found Something
        </button>
      </div>

      <div className="info-box">
        {activeTab === 'lost'
          ? 'Reporting a lost item will help others return it to you if found.'
          : 'Reporting a found item will help the owner locate and reclaim it.'}
      </div>

      <form onSubmit={handleSubmit}>
        <label>Title *</label>
        <input
          type="text"
          name="title"
          placeholder={`What did you ${activeTab === 'lost' ? 'lose' : 'find'}?`}
          value={form.title}
          onChange={handleChange}
          required
        />

        <label>Description *</label>
        <textarea
          name="description"
          rows="4"
          placeholder="Describe the item (brand, color, features...)"
          value={form.description}
          onChange={handleChange}
          required
        />

        <label>Category</label>
        <div className="category-grid">
          {categories.map(cat => (
            <div
              key={cat.category}
              className={`category-card ${selectedCategory === cat.category ? 'selected' : ''}`}
              onClick={() => setSelectedCategory(cat.category)}
              style={{ borderColor: selectedCategory === cat.category ? cat.color : 'transparent' }}
            >
              <img src={cat.icon} alt={cat.category} />
              <span>{cat.category}</span>
            </div>
          ))}
        </div>

        <div className="row">
          <div className="col">
            <label>Date {activeTab === 'lost' ? 'Lost' : 'Found'} *</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
                max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="col">
            <label>Location *</label>
            <input
              type="text"
              name="location"
              placeholder="Where was it lost/found?"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <label>Building (Optional)</label>
        <select name="building" value={form.building} onChange={handleChange}>
          <option value="">Select a building</option>
          <option value="rtb">RTB</option>
          <option value="bgb">BGB</option>
          <option value="cb">CB</option>
          <option value="klb">KLB</option>
          <option value="vb">VB</option>
        </select>

        <label>Images (Optional)</label>
        <input type="file" multiple onChange={handleImageUpload} />

        <label className="checkbox">
          <input
            type="checkbox"
            name="isEmergency"
            checked={form.isEmergency}
            onChange={handleChange}
          />
          Mark as emergency
        </label>

        <label>Reward (Optional)</label>
        <input
          type="text"
          name="reward"
          placeholder="e.g., $10, snack treat"
          value={form.reward}
          onChange={handleChange}
        />

        <button className="submit-btn" type="submit" disabled={loading}>
          {loading ? 'Submitting...' : `Report ${activeTab === 'lost' ? 'Lost' : 'Found'} Item`}
        </button>
      </form>
    </div>
  );
};

export default ReporteForm;
