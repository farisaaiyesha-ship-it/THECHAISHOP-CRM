import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, UserRoundPlus, ShoppingBag, CheckSquare, LogOut, Menu, X } from "lucide-react";
import api from "./api";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Leads from "./pages/Leads";
import Orders from "./pages/Orders";
import Tasks from "./pages/Tasks";

function Protected({ children }) {
  return localStorage.getItem("crm_token") ? children : <Navigate to="/login" replace />;
}

const links = [
  ["/", "Dashboard", LayoutDashboard],
  ["/customers", "Customers", Users],
  ["/leads", "Leads", UserRoundPlus],
  ["/orders", "Orders", ShoppingBag],
  ["/tasks", "Tasks", CheckSquare]
];

function Shell({ children }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("crm_token");
    navigate("/login");
  };
  return (
    <div className="app">
      <aside className={open ? "sidebar open" : "sidebar"}>
        <div className="brand">
          <div className="brand-mark">T</div>
          <div><strong>THECHAISHOP&CO</strong><span>CRM</span></div>
          <button className="icon-btn mobile-only" onClick={() => setOpen(false)}><X size={20}/></button>
        </div>
        <nav>
          {links.map(([to, label, Icon]) => (
            <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)}>
              <Icon size={19}/>{label}
            </NavLink>
          ))}
        </nav>
        <button className="logout" onClick={logout}><LogOut size={18}/> Sign out</button>
      </aside>
      <main className="main">
        <header className="topbar">
          <button className="icon-btn mobile-only" onClick={() => setOpen(true)}><Menu/></button>
          <div><span className="eyebrow">Customer Relationship Management</span><h1>THECHAISHOP&CO</h1></div>
          <div className="avatar">A</div>
        </header>
        <section className="content">{children}</section>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Protected><Shell><Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes></Shell></Protected>} />
    </Routes>
  );
}