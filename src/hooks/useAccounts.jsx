import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const useAccounts = (initialValue = []) => {
  const [accounts, setAccounts] = useState(() => {
    const storedAccounts = JSON.parse(localStorage.getItem("accounts"));
    return storedAccounts || initialValue;
  });


  const fetchAccounts = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedAccounts = JSON.parse(localStorage.getItem("accounts"));
        resolve(storedAccounts || []);
      }, 100);
    });
  };

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

  const addAccount = async (accountNumber) => {
    const updatedAccount = {
      key: uuidv4(), // Generate UUID for the key
      accountNumber: accountNumber,
      archived: false, // Default archived status
      status: "Incomplete",
      csr: "",
      createdAt: new Date().toLocaleString(),
      completedAt: "Incomplete",
    };
    const newAccounts = [...accounts, updatedAccount];
    await saveAccounts(newAccounts);
    setAccounts(newAccounts);
  };

  const addMultipleAccounts = async (newAccountNumbers) => {
    const updatedAccounts = newAccountNumbers.map((accountNumber) => ({
      key: uuidv4(),
      accountNumber,
      archived: false,
      status: "Incomplete",
      csr: "",
      createdAt: new Date().toLocaleString(),
      completedAt: "Incomplete",
    }));

    const newAccounts = [...accounts, ...updatedAccounts];
    await saveAccounts(newAccounts);
    setAccounts(newAccounts);
  };

  const updateArchivedStatus = async (accountKey) => {
    const updatedAccounts = [...accounts]; // Create a copy of the accounts array

    // Find the index of the account with the specified key
    const index = updatedAccounts.findIndex(
      (account) => account.key === accountKey,
    );

    if (index !== -1) {
      updatedAccounts[index] = {
        ...updatedAccounts[index],
        archived: !updatedAccounts[index]?.archived ?? true,
      };

      await saveAccounts(updatedAccounts);
      setAccounts(updatedAccounts);
    }
  };

  const updateAccountStatus = async (accountKey, status, completedAt) => {
    const accountIndex = accounts.findIndex(
      (account) => account.key === accountKey,
    );
    if (accountIndex === -1) {
      console.error("Account not found");
      return; 
    }

    const newAccounts = [...accounts];
    newAccounts[accountIndex] = {
      ...newAccounts[accountIndex],
      status,
      completedAt,
    };

    await saveAccounts(newAccounts);
    setAccounts(newAccounts);
  };

  const removeAccount = async (accountKey) => {
    const newAccounts = accounts.filter(
      (accounts) => accounts.key !== accountKey,
    );
    await saveAccounts(newAccounts);
    setAccounts(newAccounts);
  };

  const updateAccountCSR = async (accountKey, newCsr) => {
    const updatedAccounts = accounts.map((account) =>
      account.key === accountKey ? { ...account, csr: newCsr } : account,
    );
    await saveAccounts(updatedAccounts);
    setAccounts(updatedAccounts);
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
    updateArchivedStatus,
    saveAccounts,
  };
};

export default useAccounts;
