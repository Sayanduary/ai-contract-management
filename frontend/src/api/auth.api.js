import { apiRequest } from "./api.js";

export const registerUser = async (userData) => {
  return apiRequest("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
};

export const loginUser = async (userData) => {
  return apiRequest("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
};
