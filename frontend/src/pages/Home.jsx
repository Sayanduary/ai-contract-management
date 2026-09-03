import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main>
      <h1>AI Contract Management</h1>

      <p>
        Manage your contracts, analyze important clauses and risks, and ask
        questions about your contracts using AI.
      </p>

      <div>
        <Link to="/login">Login</Link>
        {" | "}
        <Link to="/register">Register</Link>
      </div>
    </main>
  );
};

export default Home;
