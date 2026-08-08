import { createContext, useState, useContext } from 'react';

const LootContext = createContext();

export function LootProvider({ children }) {
  const [fullContent, setFullContent] = useState(null);
  const [homeContent, setHomeContent] = useState(null);
  const [donations, setDonations] = useState([]);
  
  const [fullContentTime, setFullContentTime] = useState(0);
  const [homeContentTime, setHomeContentTime] = useState(0);
  const [donationsTime, setDonationsTime] = useState(0);

  const CACHE_DURATION = 120000;
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const fetchFullContent = async (force = false) => {
    const now = Date.now();
    if (!force && fullContent && (now - fullContentTime < CACHE_DURATION)) {
      return fullContent;
    }
    try {
      const res = await fetch(`${API_URL}/content`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setFullContent(data);
        setFullContentTime(now);
        setHomeContent(data.slice(0, 5));
        setHomeContentTime(now);
        return data;
      }
    } catch (err) {
      console.error('Error fetching full content:', err);
    }
    return fullContent || [];
  };

  const fetchHomeContent = async (force = false) => {
    const now = Date.now();
    if (!force && homeContent && (now - homeContentTime < CACHE_DURATION)) {
      return homeContent;
    }
    if (!force && fullContent && (now - fullContentTime < CACHE_DURATION)) {
      const sliced = fullContent.slice(0, 5);
      setHomeContent(sliced);
      setHomeContentTime(now);
      return sliced;
    }

    try {
      const res = await fetch(`${API_URL}/content?limit=5&select=nombre imagenUrl categoria ratingPromedio developer seguridad`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setHomeContent(data);
        setHomeContentTime(now);
        return data;
      }
    } catch (err) {
      console.error('Error fetching home content:', err);
    }
    return homeContent || [];
  };

  const fetchLatestDonations = async (force = false) => {
    const now = Date.now();
    if (!force && donations.length > 0 && (now - donationsTime < CACHE_DURATION)) {
      return donations;
    }
    try {
      const res = await fetch(`${API_URL}/donations/latest`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setDonations(data);
        setDonationsTime(now);
        return data;
      }
    } catch (err) {
      console.error('Error fetching donations:', err);
    }
    return donations;
  };

  const invalidateCache = () => {
    setFullContentTime(0);
    setHomeContentTime(0);
    setDonationsTime(0);
  };

  return (
    <LootContext.Provider value={{
      fullContent,
      homeContent,
      donations,
      fetchFullContent,
      fetchHomeContent,
      fetchLatestDonations,
      invalidateCache,
      setDonations
    }}>
      {children}
    </LootContext.Provider>
  );
}

export function useLoot() {
  return useContext(LootContext);
}
