import React, { useState, useEffect } from 'react';
import './BrowseItems.css';
import { FaCalendarAlt, FaMapMarkerAlt, FaGift } from 'react-icons/fa';
import { IoSearch } from 'react-icons/io5';
import { useNavigate, useLocation } from 'react-router-dom';

import personal from '../assets/category-icons/personal.png';
import docs from '../assets/category-icons/docs.png';
import stationary from '../assets/category-icons/stationary.png';
import gadgets from '../assets/category-icons/gadgets.png';
import academic from '../assets/category-icons/academic.png';
import cloths from '../assets/category-icons/cloths.png';
import jewelry from '../assets/category-icons/jewelry.png';
import others from '../assets/category-icons/others.png';

const categories = [
  { category: 'All', icon: null },
  { category: 'Personal Belongings', icon: personal },
  { category: 'Documents', icon: docs },
  { category: 'Stationery Items', icon: stationary },
  { category: 'Electronics & Gadgets', icon: gadgets },
  { category: 'Academic Items', icon: academic },
  { category: 'Clothing & Accessories', icon: cloths },
  { category: 'Jewelry', icon: jewelry },
  { category: 'Others', icon: others },
];

const LostFoundSystem = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [allItems, setAllItems] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetch('http://localhost:5000/api/reports')
      .then(res => res.json())
      .then(async (data) => {
        if (Array.isArray(data)) {
          const itemsWithClaims = await Promise.all(
            data.map(async item => {
              try {
                const res = await fetch(`http://localhost:5000/api/claims/item/${item._id}`);
                const claimData = await res.json();
                item.claims = claimData.claims || [];
              } catch {
                item.claims = [];
              }
              return item;
            })
          );
          setAllItems(itemsWithClaims);
        } else console.error('Invalid data from backend');
      })
      .catch(err => console.error('Error fetching items:', err));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    const stat = params.get('status');

    if (cat) setCategoryFilter(cat);
    if (stat) setStatusFilter(stat);
  }, [location.search]);

  const updateURLParams = (cat, stat) => {
    const params = new URLSearchParams();
    if (cat) params.set('category', cat);
    if (stat) params.set('status', stat);
    navigate({ pathname: location.pathname, search: params.toString() });
  };

  const handleCategoryChange = (e) => {
    const newCat = e.target.value;
    setCategoryFilter(newCat);
    updateURLParams(newCat, statusFilter);
  };

  const handleStatusChange = (e) => {
    const newStat = e.target.value;
    setStatusFilter(newStat);
    updateURLParams(categoryFilter, newStat);
  };

  const handleInputChange = (e) => setQuery(e.target.value);

  const filteredSuggestions = query.trim()
    ? allItems.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleSuggestionClick = (item) => {
    setSelectedItem(item);
    setQuery('');
  };

  const handleSearch = () => {
    const matched = allItems.find(
      (item) => item.title.toLowerCase() === query.toLowerCase()
    );
    if (matched) setSelectedItem(matched);
  };

  const handleViewDetails = (id) => {
    navigate(`/item/${id}`);
  };

  const getCategoryIcon = (catName) => {
    const cat = categories.find((c) => c.category === catName);
    return cat?.icon;
  };

  const filteredItems = allItems.filter((item) => {
    const matchCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchStatus = statusFilter === 'All' || item.status === statusFilter;
    const isClaimed = item.claims?.some(claim => claim.status === 'Approved');
    return matchCategory && matchStatus && !isClaimed;
  });

  return (
    <div className="lf-wrapper">
      <div className="lf-search-area">
        <div className="lf-search-box">
          <input
            type="text"
            className="lf-search-input"
            placeholder="Quick search for an item..."
            value={query}
            onChange={handleInputChange}
          />
          <button className="lf-search-btn" onClick={handleSearch}>
            <IoSearch size="20px" />Search
          </button>

          {filteredSuggestions.length > 0 && (
            <ul className="lf-suggestion-list">
              {filteredSuggestions.map((item) => (
                <li
                  key={item._id}
                  onClick={() => handleSuggestionClick(item)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e0f4f9';
                    e.currentTarget.style.color = '#0077b6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#005f87';
                  }}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="lf-filters">
        <select value={categoryFilter} onChange={handleCategoryChange}>
          {categories.map((cat) => (
            <option key={cat.category} value={cat.category}>
              {cat.category}
            </option>
          ))}
        </select>
        <select value={statusFilter} onChange={handleStatusChange}>
          <option value="All">All</option>
          <option value="Lost">Lost</option>
          <option value="Found">Found</option>
        </select>
      </div>

      <div className="lf-item-grid">
        {(selectedItem ? [selectedItem] : filteredItems).map((item) => (
          <div className="lf-card" key={item._id}>
            <div className="lf-card-image">
              <img
                src={
                  item.images?.[0]
                    ? `http://localhost:5000/uploads/${item.images[0]}`
                    : 'https://via.placeholder.com/200x150?text=No+Image'
                }
                alt={item.title}
              />
              <div className="lf-badges">
                {item.isEmergency && <span className="lf-badge urgent">⚠️ URGENT</span>}
                <span className={`lf-badge status ${item.status.toLowerCase()}`}>
                  {item.status === 'Lost' ? 'Lost' : ' Found'}
                </span>
              </div>
            </div>

            <div className="lf-card-content">
              <h3 className="lf-title">{item.title}</h3>
              <p className="lf-description">{item.description}</p>
              <div className="lf-info">
                <p>
                  {getCategoryIcon(item.category) && (
                    <img src={getCategoryIcon(item.category)} alt="category" className="lf-icon" />
                  )}
                  {item.category}
                </p>
                <p><FaMapMarkerAlt /> {item.location}</p>
                <p>
                  <FaCalendarAlt /> {item.status === 'Lost' ? 'Lost on:' : 'Found on:'}{' '}
                  {new Date(item.lostDate).toLocaleDateString()}
                </p>
                {item.reward && (
                  <p className="lf-reward">
                    <FaGift /> <strong>Reward:</strong> <span>{item.reward}</span>
                  </p>
                )}
              </div>
              <button className="lf-details-btn" onClick={() => handleViewDetails(item._id)}>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LostFoundSystem;
