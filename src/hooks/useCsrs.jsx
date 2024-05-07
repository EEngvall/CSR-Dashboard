// hooks/useCsrs.js
import { useState, useEffect } from "react";

function useCsrs(initialCsrs = []) {
    const [csrs, setCsrs] = useState(() => {
        const storedCsrs = JSON.parse(localStorage.getItem("csrs"));
        return storedCsrs || initialCsrs;
    });

    useEffect(() => {
        localStorage.setItem("csrs", JSON.stringify(csrs));
    }, [csrs]);

    const addCsr = (csr) => {
        setCsrs((prevCsrs) => [...prevCsrs, csr]);
    };

    const removeCsr = (csrToRemove) => {
        setCsrs((prevCsrs) => prevCsrs.filter((csr) => csr !== csrToRemove));
    };

    return { csrs, addCsr, removeCsr };
}

export default useCsrs;
