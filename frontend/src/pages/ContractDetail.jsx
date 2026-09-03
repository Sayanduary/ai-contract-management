import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getContract, analyzeContract, askContract } from "../api/contract.api";

import { createReminder } from "../api/remainder.api";

const ContractDetails = () => {
  const { id } = useParams();

  const [contract, setContract] = useState(null);

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);

  const [reminderDate, setReminderDate] = useState("");
  const [creatingReminder, setCreatingReminder] = useState(false);
  const [reminderMessage, setReminderMessage] = useState("");

  const [error, setError] = useState("");

  // ==========================================
  // FETCH CONTRACT
  // ==========================================

  const fetchContract = async () => {
    try {
      setError("");

      const data = await getContract(id);

      setContract(data.contract);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContract();
  }, [id]);

  // ==========================================
  // ANALYZE CONTRACT
  // ==========================================

  const handleAnalyze = async () => {
    try {
      setError("");
      setAnalyzing(true);

      await analyzeContract(id);

      await fetchContract();
    } catch (error) {
      setError(error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  // ==========================================
  // ASK CONTRACT QUESTION
  // ==========================================

  const handleAsk = async (event) => {
    event.preventDefault();

    if (!question.trim()) {
      setError("Please enter a question");
      return;
    }

    try {
      setError("");
      setAnswer("");
      setAsking(true);

      const data = await askContract(id, question);

      setAnswer(data.answer);
    } catch (error) {
      setError(error.message);
    } finally {
      setAsking(false);
    }
  };

  // ==========================================
  // CREATE REMINDER
  // ==========================================

  const handleCreateReminder = async (event) => {
    event.preventDefault();

    if (!reminderDate) {
      setError("Please select a reminder date");
      return;
    }

    try {
      setError("");
      setReminderMessage("");
      setCreatingReminder(true);

      await createReminder(id, reminderDate);

      setReminderDate("");
      setReminderMessage("Reminder created successfully");
    } catch (error) {
      setError(error.message);
    } finally {
      setCreatingReminder(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main>
        <p>Loading contract...</p>
      </main>
    );
  }

  // ==========================================
  // CONTRACT NOT FOUND
  // ==========================================

  if (!contract) {
    return (
      <main>
        <p>{error || "Contract not found"}</p>

        <Link to="/dashboard">Back to Dashboard</Link>
      </main>
    );
  }

  const analysis = contract.analysis;

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main>
      <Link to="/dashboard">Back to Dashboard</Link>

      <h1>{contract.title}</h1>

      {/* ======================================
          CONTRACT DETAILS
      ====================================== */}

      <h2>Contract Details</h2>

      <p>
        <strong>Type:</strong> {contract.type || "Unknown"}
      </p>

      <p>
        <strong>Status:</strong> {contract.status}
      </p>

      <p>
        <strong>Start Date:</strong>{" "}
        {contract.startDate
          ? new Date(contract.startDate).toLocaleDateString()
          : "Not available"}
      </p>

      <p>
        <strong>Expiry Date:</strong>{" "}
        {contract.expiryDate
          ? new Date(contract.expiryDate).toLocaleDateString()
          : "Not available"}
      </p>

      <hr />

      {/* ======================================
          AI ANALYSIS
      ====================================== */}

      <h2>AI Analysis</h2>

      {!analysis ? (
        <div>
          <p>This contract has not been analyzed yet.</p>

          <button onClick={handleAnalyze} disabled={analyzing}>
            {analyzing ? "Analyzing..." : "Analyze Contract"}
          </button>
        </div>
      ) : (
        <div>
          <h3>Summary</h3>

          <p>{analysis.summary || "No summary available."}</p>

          <h3>Risk Level</h3>

          <p>{analysis.riskLevel || "Unknown"}</p>

          <h3>Clauses</h3>

          {analysis.clauses?.length > 0 ? (
            <div>
              {analysis.clauses.map((clause, index) => (
                <div key={index}>
                  <h4>{clause.name}</h4>

                  <p>{clause.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No clauses identified.</p>
          )}

          <h3>Risks</h3>

          {analysis.risks?.length > 0 ? (
            <div>
              {analysis.risks.map((risk, index) => (
                <div key={index}>
                  <h4>{risk.title}</h4>

                  <p>{risk.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No significant risks identified.</p>
          )}

          <button onClick={handleAnalyze} disabled={analyzing}>
            {analyzing ? "Analyzing..." : "Re-analyze Contract"}
          </button>
        </div>
      )}

      <hr />

      {/* ======================================
          REMINDER
      ====================================== */}

      <h2>Set Reminder</h2>

      <form onSubmit={handleCreateReminder}>
        <label htmlFor="reminderDate">Reminder Date</label>

        <br />

        <input
          id="reminderDate"
          type="datetime-local"
          value={reminderDate}
          onChange={(event) => setReminderDate(event.target.value)}
          required
        />

        <br />
        <br />

        <button type="submit" disabled={creatingReminder}>
          {creatingReminder ? "Creating..." : "Create Reminder"}
        </button>
      </form>

      {reminderMessage && <p>{reminderMessage}</p>}

      <hr />

      {/* ======================================
          CONTRACT Q&A
      ====================================== */}

      <h2>Ask About This Contract</h2>

      <form onSubmit={handleAsk}>
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask a question about this contract..."
          rows="4"
        />

        <br />
        <br />

        <button type="submit" disabled={asking}>
          {asking ? "Asking..." : "Ask"}
        </button>
      </form>

      {answer && (
        <div>
          <h3>Answer</h3>

          <p>{answer}</p>
        </div>
      )}

      {/* ======================================
          ERROR
      ====================================== */}

      {error && <p>{error}</p>}
    </main>
  );
};

export default ContractDetails;
