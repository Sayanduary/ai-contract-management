import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getReminders, deleteReminder } from "../api/remainder.api";

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReminders = async () => {
    try {
      setError("");

      const data = await getReminders();

      setReminders(data.reminders || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this reminder?",
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteReminder(id);

      setReminders((previous) =>
        previous.filter((reminder) => reminder.id !== id),
      );
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <main>
        <p>Loading reminders...</p>
      </main>
    );
  }

  return (
    <main>
      <Link to="/dashboard">Back to Dashboard</Link>

      <h1>Reminders</h1>

      {error && <p>{error}</p>}

      {reminders.length === 0 ? (
        <p>No reminders found.</p>
      ) : (
        <div>
          {reminders.map((reminder) => (
            <div key={reminder.id}>
              <h3>{reminder.contract?.title || "Contract"}</h3>
              <p>
                <strong>Reminder Date:</strong>{" "}
                {new Date(reminder.reminderDate).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {reminder.status}
              </p>
              {reminder.contract?.expiryDate && (
                <p>
                  <strong>Contract Expiry:</strong>{" "}
                  {new Date(reminder.contract.expiryDate).toLocaleDateString()}
                </p>
              )}
              <Link to={`/contracts/${reminder.contract.id}`}>
                View Contract
              </Link>{" "}
              <button onClick={() => handleDelete(reminder.id)}>Delete</button>
              <hr />
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Reminders;
