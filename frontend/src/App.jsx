import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import Collections from './pages/Collections';
import Driver from './pages/Driver';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/driver" element={<Driver />} />
      </Routes>
    </Router>
  );
}

export default App;
