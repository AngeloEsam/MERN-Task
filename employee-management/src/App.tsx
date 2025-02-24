import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Header from "./components/Header";
import { App as AntApp } from "antd";
import Dashboard from "./pages/Dashboard";
const App: React.FC = () => {
  return (
    <AntApp>
      <Router>
        <Header />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </AntApp>
  );
};

export default App;
