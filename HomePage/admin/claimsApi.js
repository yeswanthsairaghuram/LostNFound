 
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/claims';  

export const fetchClaims = async () => {
  try {
    const res = await axios.get(BASE_URL);
    return res.data || [];
  } catch (error) {
    console.error("Error fetching claims:", error.message);
    return [];
  }
};

  
export const updateClaimStatus = async (claimId, status) => {
  try {
    const res = await axios.patch(`${BASE_URL}/${claimId}/status`, { status });  
    return res.data;
  } catch (error) {
    console.error("Error updating claim status:", error.message);
    throw error;
  }
};
