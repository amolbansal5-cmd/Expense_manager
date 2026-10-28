import { Link, useNavigate } from "react-router-dom";
import "../css/Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  
  return (
    <div className="sidebar">

      <div className="logo">
        <h2>💰 Expense Manager</h2>
      </div>

      <ul className="menu">

        <li>
          <Link to="/dashboard">🏠 Dashboard</Link>
        </li>

        <li>
          <Link to="/Expenses">💳 Expenses</Link>
        </li>

        <li>
          <Link to="/analytics">📊 Analytics</Link>
        </li>

        <li>
          <Link to="/income">💼 Income</Link>
        </li>

        <li>
          <Link to="/profile">👤 Profile</Link>
        </li>

        <li>
          <Link to="/settings">⚙️ Settings</Link>
        </li>

        <li>
          <Link to="/user-management">⚙️ User Management</Link>
        </li>

      </ul>

      <button className="logout-btn" onClick={handleLogout}>
        🚪 Logout
      </button>

    </div>
  );
}

export default Sidebar;