import { apiRequest } from "./api.js";

export const getReminders = async () => {
  return apiRequest("/reminders");
};

export const createReminder = async (contractId, reminderDate) => {
  return apiRequest(`/reminders/contracts/${contractId}/reminders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reminderDate }),
  });
};

export const deleteReminder = async (id) => {
  return apiRequest(`/reminders/${id}`, {
    method: "DELETE",
  });
};
