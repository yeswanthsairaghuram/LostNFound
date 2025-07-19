import React, { useState, useEffect, useRef } from 'react';
import { fetchClaims, updateClaimStatus } from './claimsApi';
import { useLocation , useNavigate } from 'react-router-dom';
import './VerifyList.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HashLoader } from 'react-spinners';

const VerifyList = () => {
  const [claims, setClaims] = useState([]);
  const [loadingClaimId, setLoadingClaimId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClaimId, setSelectedClaimId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const itemsPerPage = 3;
  const location = useLocation();
  const navigate = useNavigate();
  const claimsSectionRef = useRef(null);

  useEffect(() => {
    loadData();
  }, [location]);

  const loadData = async () => {
    try {
      const data = await fetchClaims();
      setClaims(data?.claims || []);
    } catch (error) {
      console.error("Failed to load claims:", error);
      setClaims([]);
    }
  };

  const handleBoxClick = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
    setTimeout(() => {
      claimsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleModalConfirm = async () => {
    if (!selectedClaimId || !selectedStatus) return;

    setLoadingClaimId(selectedClaimId);
    setModalOpen(false);

    try {
      await updateClaimStatus(selectedClaimId, selectedStatus);
      const updatedClaims = await fetchClaims();
      setClaims(updatedClaims?.claims || []);
      toast.success(`Claim ${selectedStatus.toLowerCase()} and email sent.`);
    } catch (err) {
      console.error(`Error updating claim ${selectedClaimId}:`, err.message);
      toast.error('Failed to update status or send email.');
    } finally {
      setLoadingClaimId(null);
    }
  };

  const getPaginatedClaims = (status) => {
    const filtered = claims.filter(c => status === 'All' || c.status === status);
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIdx, startIdx + itemsPerPage);
  };

  const renderPagination = (status) => {
    const totalItems = claims.filter(c => status === 'All' || c.status === status).length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    return (
      <div className="pagination-container">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    );
  };

  const renderClaimCards = (status) => {
    const paginated = getPaginatedClaims(status);
    return (
      <div className="claim-grid">
        {paginated.map((claim) => (
          <div className="claim-card" key={claim._id}>
            <div className="claim-sections">
              <div className="claim-section">
                <h3>Claimant Info</h3>
                <p><strong>Name:</strong> {claim.claimantId?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {claim.claimantId?.email || 'N/A'}</p>
                <p><strong>Contact:</strong> {claim.contact}</p>
                <p><strong>Reason:</strong> {claim.reason}</p>
                <p><strong>Status:</strong> {claim.status}</p>
                {claim.proofImage && (
                  <img
                    className="claim-image"
                    src={`http://localhost:5000/uploads/${claim.proofImage}`}
                    alt="Claim Proof"
                  />
                )}
                {status === 'Pending' && (
                  <div className="claim-actions">
                    <button
                      className="verify-btn approve-btn"
                      onClick={() => {
                        setSelectedClaimId(claim._id);
                        setSelectedStatus('Approved');
                        setModalOpen(true);
                      }}
                      disabled={loadingClaimId !== null}
                    >
                      Approve
                    </button>
                    <button
                      className="verify-btn reject-btn"
                      onClick={() => {
                        setSelectedClaimId(claim._id);
                        setSelectedStatus('Rejected');
                        setModalOpen(true);
                      }}
                      disabled={loadingClaimId !== null}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>

              <div className="item-section">
                <h3>Item Info</h3>
                {claim.itemId ? (
                  <>
                    <div className="image-pair">
                      {claim.itemId.images?.[0] && (
                        <img
                          className="item-image"
                          src={`http://localhost:5000/uploads/${claim.itemId.images[0]}`}
                          alt="Item"
                        />
                      )}

                    </div>
                    <p><strong>Title:</strong> {claim.itemId.title}</p>
                    <p><strong>Description:</strong> {claim.itemId.description}</p>
                    <p><strong>Location:</strong> {claim.itemId.location}</p>
                    <p><strong>Category:</strong> {claim.itemId.category}</p>
                    <p><strong>Lost Date:</strong> {new Date(claim.itemId.lostDate).toLocaleDateString()}</p>
                  </>
                ) : (
                  <p style={{ color: 'red' }}><strong>No matching item found.</strong></p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const totalClaims = claims.length;
  const pendingCount = claims.filter(c => c.status === 'Pending').length;
  const approvedCount = claims.filter(c => c.status === 'Approved').length;
  const rejectedCount = claims.filter(c => c.status === 'Rejected').length;

  return (
    <>
    <div
      style={{
        padding: '20px 0',
      }}
    >
      <h1 style={{
        textAlign: 'center',
        margin: '45px 0',
        color: 'Red',
        fontSize: '2rem',
        fontWeight: '700',
        letterSpacing: '0.5px',
        marginBottom:'20px'
      }}>Admin Dashboard</h1>
      <h3
        style={{
          textAlign: 'center',
          // margin: '2px 0',
          fontSize: '2rem',
          fontWeight: '700',
          letterSpacing: '0.5px',
        }}
      >
        Lost & Found - Verification Portal
      </h3>
    </div>
    <div className="verify-container">
      <h2>Verify Claims</h2>

      <div className="box-row">
        <div className="info-box total-box" onClick={() => handleBoxClick('All')}>
          <h4>Total Claims</h4>
          <p>{totalClaims}</p>
        </div>
        <div className="info-box pending-box" onClick={() => handleBoxClick('Pending')}>
          <h4>Pending Claims</h4>
          <p>{pendingCount}</p>
        </div>
        <div className="info-box approved-box" onClick={() => handleBoxClick('Approved')}>
          <h4>Approved Claims</h4>
          <p>{approvedCount}</p>
        </div>
        <div className="info-box rejected-box" onClick={() => handleBoxClick('Rejected')}>
          <h4>Rejected Claims</h4>
          <p>{rejectedCount}</p>
        </div>
      </div>

      <div ref={claimsSectionRef}>
        {claims.length === 0 ? (
          <p className="no-claims">No claims found.</p>
        ) : (
          <>
            {(filterStatus === 'All' || filterStatus === 'Pending') && (
              <section>
                <h3 className="section-heading">Pending Claims</h3>
                {renderClaimCards('Pending')}
                {renderPagination('Pending')}
              </section>
            )}
            {(filterStatus === 'All' || filterStatus === 'Approved') && (
              <section>
                <h3 className="section-heading approved-heading">Approved Claims</h3>
                {renderClaimCards('Approved')}
                {renderPagination('Approved')}
              </section>
            )}
            {(filterStatus === 'All' || filterStatus === 'Rejected') && (
              <section>
                <h3 className="section-heading rejected-heading">Rejected Claims</h3>
                {renderClaimCards('Rejected')}
                {renderPagination('Rejected')}
              </section>
            )}
          </>
        )}
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Confirm Action</h3>
            <p>Are you sure you want to {selectedStatus.toLowerCase()} this claim?</p>
            <div className="modal-actions">
              <button className="modal-confirm-btn" onClick={handleModalConfirm}>Yes</button>
              <button className="modal-cancel-btn" onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {loadingClaimId && (
        <div className="loader-overlay">
          <div className="loader-content">
            <HashLoader size={60} color="#007bff" />
            <p className="loader-text">Loading...</p>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
    </>
  );
};

export default VerifyList;