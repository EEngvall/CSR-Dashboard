import { useState, useEffect } from "react";

const useAccounts = (initialValue = []) => {
  const [accounts, setAccounts] = useState(() => {
    const storedAccounts = JSON.parse(localStorage.getItem("accounts"));
    return storedAccounts || initialValue;
  });

  // Asynchronously fetch accounts from localStorage
  const fetchAccounts = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedAccounts = JSON.parse(localStorage.getItem("accounts"));
        resolve(storedAccounts || []);
      }, 100);
    });
  };

  // Asynchronously save accounts to localStorage
  const saveAccounts = async (newAccounts) => {
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem("accounts", JSON.stringify(newAccounts));
        setTimeout(() => resolve(), 100); // Simulate a slight delay
      } catch (error) {
        console.error("Failed to save accounts:", error);
        reject(error);
      }
    });
  };

  const addAccount = async (account) => {
    const newAccounts = [...accounts, account];
    await saveAccounts(newAccounts);
    setAccounts(newAccounts);
  };

  const addMultipleAccounts = async (newAccounts) => {
    const updatedAccounts = [...accounts, ...newAccounts];
    await saveAccounts(updatedAccounts);
    setAccounts(updatedAccounts);
  };

  const updateAccountStatus = async (index, status, completedAt) => {
    const newAccounts = [...accounts];
    newAccounts[index].status = status;
    newAccounts[index].completedAt = completedAt;
    await saveAccounts(newAccounts);
    setAccounts(newAccounts);
  };

  const removeAccount = async (index) => {
    const newAccounts = accounts.filter((_, i) => i !== index);
    await saveAccounts(newAccounts);
    setAccounts(newAccounts);
  };

  const updateAccountCSR = async (index, newCsr) => {
    const newAccounts = [...accounts];
    newAccounts[index].csr = newCsr;
    await saveAccounts(newAccounts);
    setAccounts(newAccounts);
  };

  useEffect(() => {
    fetchAccounts().then(setAccounts);
  }, []);

  return {
    accounts,
    addAccount,
    updateAccountStatus,
    removeAccount,
    updateAccountCSR,
    addMultipleAccounts,
  };
};

export default useAccounts;
