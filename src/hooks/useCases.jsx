import { useState, useEffect } from "react";
import axios from "axios";

const useCases = (initialValue = []) => {
  const [cases, setCases] = useState(initialValue);
  const API_BASE_URL = "https://returns-server.erikengvall.com";

  const fetchCases = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/cases`);
      setCases(response.data);
    } catch (error) {
      console.error("Failed to fetch cases:", error);
    }
  };

  const addCase = async (newCase) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/cases`, newCase);
      setCases((prevCases) => [...prevCases, response.data]);
    } catch (error) {
      console.error("Failed to add case:", error);
    }
  };

  const updateCase = async (key, updatedFields) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/cases/${key}`,
        updatedFields,
      );

      setCases((prevCases) => {
        const updatedCases = prevCases.map((c) =>
          c.key === key ? { ...c, ...updatedFields, ...response.data } : c,
        );
        return updatedCases;
      });
    } catch (error) {
      console.error("Failed to update case:", error);
    }
  };

  const deleteCase = async (key) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/cases/${key}`);
      setCases((prevCases) => prevCases.filter((c) => c.key !== key));
    } catch (error) {
      console.error("Failed to delete case:", error);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  return {
    cases,
    fetchCases,
    addCase,
    updateCase,
    deleteCase,
  };
};

export default useCases;
