import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      {/* Remove <div id="root"> from here */}
      <h1 className="app-heading">To-Do App</h1>

      <nav>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<h2 style={{ textAlign: 'center', color: '#4a5568' }}>Welcome! Please Login.</h2>} />
      </Routes>

      <footer className="footer">
        Made with ❤️ by Kinza Zahra
      </footer>
      {/* Remove </div> from here */}
    </Router>
  );
}

export default App;