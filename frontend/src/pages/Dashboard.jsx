import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  getContracts,
  uploadContract,
  deleteContract,
} from "../api/contract.api";

const Dashboard = () => {
  const navigate = useNavigate();

  const [contracts, setContracts] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH CONTRACTS
  // ==========================================

  const fetchContracts = async () => {
    try {
      setError("");

      const data = await getContracts();

      setContracts(data.contracts || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  // ==========================================
  // UPLOAD CONTRACT
  // ==========================================

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    try {
      setError("");
      setUploading(true);

      await uploadContract(file);

      setFile(null);
      event.target.reset();

      await fetchContracts();
    } catch (error) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  // ==========================================
  // DELETE CONTRACT
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contract?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteContract(id);

      setContracts((previous) =>
        previous.filter((contract) => contract.id !== id),
      );
    } catch (error) {
      setError(error.message);
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main>
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>{" "}
      <Link to="/reminders">View Reminders</Link>
      <hr />
      {/* ======================================
          UPLOAD CONTRACT
      ====================================== */}
      <h2>Upload Contract</h2>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="application/pdf"
          onChange={(event) => setFile(event.target.files[0] || null)}
        />

        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {error && <p>{error}</p>}
      <hr />
      {/* ======================================
          MY CONTRACTS
      ====================================== */}
      <h2>My Contracts</h2>
      {loading ? (
        <p>Loading contracts...</p>
      ) : contracts.length === 0 ? (
        <p>No contracts uploaded yet.</p>
      ) : (
        <div>
          {contracts.map((contract) => (
            <div key={contract.id}>
              <h3>{contract.title}</h3>
              <p>Type: {contract.type || "Unknown"}</p>
              <p>Status: {contract.status}</p>
              <p>
                Start Date:{" "}
                {contract.startDate
                  ? new Date(contract.startDate).toLocaleDateString()
                  : "Not available"}
              </p>
              <p>
                Expiry Date:{" "}
                {contract.expiryDate
                  ? new Date(contract.expiryDate).toLocaleDateString()
                  : "Not available"}
              </p>
              {contract.analysis && (
                <p>Risk Level: {contract.analysis.riskLevel || "Unknown"}</p>
              )}
              <Link to={`/contracts/${contract.id}`}>View Contract</Link>{" "}
              <button onClick={() => handleDelete(contract.id)}>Delete</button>
              <hr />
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Dashboard;
