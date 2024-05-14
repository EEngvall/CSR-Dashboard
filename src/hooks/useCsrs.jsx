// hooks/useCsrs.js
import { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const API_BASE_URL = "https://returns-server.erikengvall.com";

function useCsrs(initialCsrs = []) {
    const [csrs, setCsrs] = useState(initialCsrs);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCsrs = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/csrs`);
                setCsrs(response.data);
            } catch (error) {
                setError(error);
                console.error("Failed to fetch CSRs:", error);
            }
        };

        fetchCsrs();
    }, []);

    const addCsr = async (csr) => {
        try {
            const newCsr = { ...csr, key: uuidv4() };
            const response = await axios.post(
                `${API_BASE_URL}/api/csrs`,
                newCsr,
            );
            setCsrs((prevCsrs) => [...prevCsrs, response.data]);
        } catch (error) {
            setError(error);
            console.error("Failed to add CSR:", error);
        }
    };

    const updateCsr = async (csrId, updatedCsr) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/api/csrs/${csrId}`,
                updatedCsr,
            );
            setCsrs((prevCsrs) =>
                prevCsrs.map((csr) =>
                    csr.key === csrId ? response.data : csr,
                ),
            );
        } catch (error) {
            setError(error);
            console.error("Failed to update CSR:", error);
        }
    };

    const removeCsr = async (csrId) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/csrs/${csrId}`);
            setCsrs((prevCsrs) => prevCsrs.filter((csr) => csr.key !== csrId));
        } catch (error) {
            setError(error);
            console.error("Failed to remove CSR:", error);
        }
    };

    return { csrs, loading, error, addCsr, updateCsr, removeCsr };
}

export default useCsrs;
