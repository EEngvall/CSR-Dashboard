import { useState, useEffect } from "react";
import axios from "axios";

const useAccounts = (initialValue = []) => {
  const [accounts, setAccounts] = useState(initialValue);
  const apiAddress = "https://164.92.120.154:3000";

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${apiAddress}/api/accounts`);
      setAccounts(response.data);
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
    }
  };

  const addAccount = async (accountNumber) => {
    try {
      const response = await axios.post(`${apiAddress}/api/accounts`, {
        accountNumber,
        status: "Incomplete",
        csr: "",
        archived: false,
        createdAt: new Date().toISOString(),
        completedAt: "Incomplete",
      });
      setAccounts([...accounts, response.data]);
    } catch (error) {
      console.error("Failed to add account:", error);
    }
  };

  const addMultipleAccounts = async (newAccountNumbers) => {
    try {
      const updatedAccounts = await Promise.all(
        newAccountNumbers.map((accountNumber) =>
          axios.post(`${apiAddress}/api/accounts`, {
            accountNumber,
            status: "Incomplete",
            csr: "",
            archived: false,
            createdAt: new Date().toISOString(),
            completedAt: "Incomplete",
          }),
        ),
      );
      setAccounts([
        ...accounts,
        ...updatedAccounts.map((response) => response.data),
      ]);
    } catch (error) {
      console.error("Failed to add multiple accounts:", error);
    }
  };

  const updateArchivedStatus = async (accountKey) => {
    try {
      const account = accounts.find((acc) => acc.key === accountKey);
      if (!account) {
        console.error("Account not found");
        return;
      }
      const updatedAccount = {
        ...account,
        archived: !account.archived,
      };
      const response = await axios.put(
        `${apiAddress}/api/accounts/${accountKey}`,
        updatedAccount,
      );
      setAccounts(
        accounts.map((acc) => (acc.key === accountKey ? response.data : acc)),
      );
    } catch (error) {
      console.error("Failed to update archived status:", error);
    }
  };

  const updateAccountStatus = async (accountKey, status, completedAt) => {
    try {
      const account = accounts.find((acc) => acc.key === accountKey);
      if (!account) {
        console.error("Account not found");
        return;
      }
      const updatedAccount = {
        ...account,
        status,
        completedAt,
      };
      const response = await axios.put(
        `${apiAddress}/api/accounts/${accountKey}`,
        updatedAccount,
      );
      setAccounts(
        accounts.map((acc) => (acc.key === accountKey ? response.data : acc)),
      );
    } catch (error) {
      console.error("Failed to update account status:", error);
    }
  };

  const removeAccount = async (accountKey) => {
    try {
      await axios.delete(`${apiAddress}/api/accounts/${accountKey}`);
      setAccounts(accounts.filter((acc) => acc.key !== accountKey));
    } catch (error) {
      console.error("Failed to remove account:", error);
    }
  };

  const updateAccountCSR = async (accountKey, newCsr) => {
    try {
      const account = accounts.find((acc) => acc.key === accountKey);
      if (!account) {
        console.error("Account not found");
        return;
      }
      const updatedAccount = {
        ...account,
        csr: newCsr,
      };
      const response = await axios.put(
        `${apiAddress}/api/accounts/${accountKey}`,
        updatedAccount,
      );
      setAccounts(
        accounts.map((acc) => (acc.key === accountKey ? response.data : acc)),
      );
    } catch (error) {
      console.error("Failed to update CSR:", error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return {
    accounts,
    addAccount,
    updateAccountStatus,
    removeAccount,
    updateAccountCSR,
    addMultipleAccounts,
    updateArchivedStatus,
    fetchAccounts,
  };
};

export default useAccounts;
