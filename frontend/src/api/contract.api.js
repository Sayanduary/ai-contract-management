import { apiRequest } from "./api.js";

// Get all contracts
export const getContracts = async () => {
  return apiRequest("/contracts");
};

// Get single contract
export const getContract = async (id) => {
  return apiRequest(`/contracts/${id}`);
};

// Upload PDF contract
export const uploadContract = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  return apiRequest("/contracts/upload", {
    method: "POST",
    body: formData,
  });
};

// Delete contract
export const deleteContract = async (id) => {
  return apiRequest(`/contracts/${id}`, {
    method: "DELETE",
  });
};

// Analyze contract
export const analyzeContract = async (id) => {
  return apiRequest(`/contracts/${id}/analyze`, {
    method: "POST",
  });
};

// Ask question about contract
export const askContract = async (id, question) => {
  return apiRequest(`/contracts/${id}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
    }),
  });
};
