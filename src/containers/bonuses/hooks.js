import { useState } from "react";
import axiosApi from "../../axiosApi";

export const useFetchLastPays = () => {
  const [lastPays, setLastPays] = useState([]);
  const [lastPaysLoading, setLastPaysLoading] = useState(false);
  
  const fetchLastPays = async (square_id) => {
    if (!square_id) return;
    
    try {
      setLastPaysLoading(true);
      const req = await axiosApi(`/v2/squares-noactive-pay/?squares_id=${square_id}`);
      const res = await req.data;
      setLastPays(res?.data || []);
      setLastPaysLoading(false);
    } catch (e) {
      console.log(e);
    }
  }
  
  return {
    lastPays,
    lastPaysLoading,
    fetchLastPays
  };
};