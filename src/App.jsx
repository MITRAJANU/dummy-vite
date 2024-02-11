import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
// import Dashboard from "./Dashboard"; // Uncomment if using Dashboard
import Login from "./Login";
import axios from "axios";
import Profile from "./Profile";

const App = () => {
  axios.defaults.baseURL = "http://localhost:8787";
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;
