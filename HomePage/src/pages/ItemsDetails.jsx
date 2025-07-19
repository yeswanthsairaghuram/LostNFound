import React, { useState, useEffect } from 'react';
import { HashLoader } from 'react-spinners';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTag, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import './ItemDetails.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ItemDetails = () => {
  const userId = localStorage.getItem('userId');
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [posterInfo, setPosterInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [claimData, setClaimData] = useState({
    reason: '',
    proofFile: null,
    contact: '',
    phone: '',
  });
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [claimStatus, setClaimStatus] = useState(null);
  const [claims, setClaims] = useState([]);
  const [claimApproved, setClaimApproved] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/reports`)
      .then(res => {
        const foundItem = res.data.find(i => i._id === id);
        setItem(foundItem);
        if (foundItem?.poster) {
          axios.get(`http://localhost:5000/api/auth/${foundItem.poster}`)
            .then(userRes => setPosterInfo(userRes.data))
            .catch(err => console.error("Failed to load user info:", err));
        }
      })
      .catch(err => console.error("Item fetch error:", err));
  }, [id]);

  useEffect(() => {
    const fetchClaims = () => {
      if (item?._id) {
        axios.get(`http://localhost:5000/api/claims/item/${item._id}`)
          .then(res => {
            const claimList = res.data.claims;
            setClaims(claimList);

            const userClaim = claimList.find(c => c.claimantId === userId);
            const approvedClaim = claimList.find(c => c.status === "Approved");

            if (userClaim) {
              setClaimSubmitted(true);
              setClaimStatus(userClaim.status);
            }

            if (approvedClaim) {
              setClaimApproved(true);
              setItem(prev => ({ ...prev, isClaimedApproved: true }));
            }
          })
          .catch(err => console.error("Failed to fetch claims:", err));
      }
    };

    fetchClaims();
    const interval = setInterval(fetchClaims, 5000);
    return () => clearInterval(interval);
  }, [item?._id, userId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setClaimData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (claimSubmitted) {
      toast.info("You have already submitted a claim for this item.");
      setShowModal(false);
      setLoading(false);
      return;
    }

    if (claimApproved) {
      toast.error("This item has already been claimed by someone.");
      setShowModal(false);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('reason', claimData.reason);
    formData.append('contact', claimData.contact);
    formData.append('phone', claimData.phone);
    formData.append('proofFile', claimData.proofFile);
    formData.append('itemId', item._id);
    formData.append('claimantId', userId);

    try {
      await axios.post('http://localhost:5000/api/claims', formData);
      toast.success("Your submission has been received!");
      setShowModal(false);
      setClaimSubmitted(true);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("You’ve already claimed this item.");
        setClaimSubmitted(true);
      } else {
        console.error("Submission Error:", error);
        toast.error("Failed to submit. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!item)
    return <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Loading item details...</h2>;

  const isPoster = userId === item.poster;

  return (
    <div className="item-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      <div className="item-image">
        {item.images && item.images.length > 0 ? (
          <img src={`http://localhost:5000/uploads/${item.images[0]}`} alt={item.title} />
        ) : (
          <p>No image available</p>
        )}
      </div>

      <div className="item-content">
        <div className="details-card">
          <h2>Item Details</h2>
          <span className={`status ${item.status.toLowerCase()}`}>✔️ Status: {item.status}</span>
          <p className="description">{item.description}</p>
          <hr />
          <p><FaTag /> <strong>Category:</strong> {item.category}</p>
          <p><FaMapMarkerAlt /> <strong>Location:</strong> {item.location}</p>
          <p><FaCalendarAlt /> <strong>{item.status === "Lost" ? "Lost on" : "Found on"}:</strong> {new Date(item.lostDate).toLocaleDateString()}</p>
          <p><FaClock /> <strong>Posted:</strong> {new Date(item.createdAt).toLocaleString()}</p>

          {isPoster ? (
            <button className="claim-btn" disabled style={{ backgroundColor: "#ccc", cursor: "not-allowed" }}>
              You posted this item
            </button>
          ) : claimApproved ? (
            <button className="claim-btn" disabled style={{ backgroundColor: "#ccc", cursor: "not-allowed" }}>
              Already Claimed
            </button>
          ) : claimSubmitted ? (
            <button
              className="claim-btn"
              disabled
              style={{
                backgroundColor:
                  claimStatus === "Approved"
                    ? "#90be6d"
                    : claimStatus === "Rejected"
                      ? "#f94144"
                      : "#ccc",
                cursor: "not-allowed"
              }}
            >
              {claimStatus === "Approved"
                ? "Claim Accepted"
                : claimStatus === "Rejected"
                  ? "Claim Rejected"
                  : "Pending Claim"}
            </button>
          ) : (
            <button className="claim-btn" onClick={() => setShowModal(true)}>
              {item.status === "Lost" ? "I found this item" : "This might be mine (Initiate Claim)"}
            </button>
          )}
        </div>

        <div className="posted-card">
          <h3>Posted By</h3>
          <div className="poster-info">
            <p className="poster-name">{posterInfo?.name || "Loading..."}</p>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{item.status === "Lost" ? "Report Found Item" : `Claim Found Item: ${item.title}`}</h2>
            {loading ? (
              <div className="loader-container">
                <HashLoader color="#003049" size={60} />
                <p style={{ marginTop: '1rem', color: '#333' }}>Submitting...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {item.status === "Found" ? (
                  <>
                    <label>Why is this item yours? *</label>
                    <textarea
                      name="reason"
                      required
                      value={claimData.reason}
                      onChange={handleChange}
                      placeholder="Describe unique features, contents, etc."
                    ></textarea>

                    <label>Upload Proof *</label>
                    <input type="file" name="proofFile" accept="image/*" required onChange={handleChange} />


                    <label>Phone Number *</label>
                    <input type="tel" name="phone" value={claimData.phone} onChange={handleChange} required />
                  </>
                ) : (
                  <>
                    <label>Where did you find the item? *</label>
                    <input type="text" name="reason" required value={claimData.reason} onChange={handleChange} />

                    <label>Describe the item *</label>
                    <textarea name="contact" required value={claimData.contact} onChange={handleChange}></textarea>

                    <label>Phone Number *</label>
                    <input type="tel" name="phone" value={claimData.phone} onChange={handleChange} required />

                    <label>Upload Photo *</label>
                    <input type="file" name="proofFile" accept="image/*" required onChange={handleChange} />
                  </>
                )}

                <div className="modal-buttons">
                  <button type="submit" className="claim-submit-btn">Submit</button>
                  <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default ItemDetails;
