import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, "../data/db.json");
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "thechaishop-crm-development-secret";

const app = express();
app.use(cors());
app.use(express.json());

function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}
function writeDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}
function id() {
  return crypto.randomUUID();
}
function auth(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Authentication required" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

app.get("/api/health", (req, res) => res.json({ ok: true, app: "THECHAISHOP&CO CRM" }));

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  if (email !== "admin@thechaishop.co" || password !== "admin123") {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const token = jwt.sign({ id: "admin", email, role: "admin" }, JWT_SECRET, { expiresIn: "8h" });
  res.json({ token, user: { name: "Admin", email, role: "admin" } });
});

const resources = ["customers", "leads", "orders", "tasks"];

for (const resource of resources) {
  app.get(`/api/${resource}`, auth, (req, res) => res.json(readDB()[resource]));

  app.post(`/api/${resource}`, auth, (req, res) => {
    const db = readDB();
    const item = {
      id: id(),
      createdAt: new Date().toISOString(),
      ...req.body
    };
    db[resource].unshift(item);
    writeDB(db);
    res.status(201).json(item);
  });

  app.put(`/api/${resource}/:id`, auth, (req, res) => {
    const db = readDB();
    const index = db[resource].findIndex(x => x.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: "Record not found" });
    db[resource][index] = { ...db[resource][index], ...req.body };
    writeDB(db);
    res.json(db[resource][index]);
  });

  app.delete(`/api/${resource}/:id`, auth, (req, res) => {
    const db = readDB();
    const before = db[resource].length;
    db[resource] = db[resource].filter(x => x.id !== req.params.id);
    if (db[resource].length === before) return res.status(404).json({ message: "Record not found" });
    writeDB(db);
    res.status(204).end();
  });
}

app.get("/api/dashboard", auth, (req, res) => {
  const db = readDB();
  const revenue = db.orders.reduce((sum, o) => sum + Number(o.amount || 0), 0);
  const paidRevenue = db.orders.filter(o => o.status === "PAID").reduce((sum, o) => sum + Number(o.amount || 0), 0);
  res.json({
    customers: db.customers.length,
    leads: db.leads.length,
    orders: db.orders.length,
    tasks: db.tasks.filter(t => t.status !== "DONE").length,
    revenue,
    paidRevenue,
    recentOrders: db.orders.slice(0, 5),
    recentCustomers: db.customers.slice(0, 5)
  });
});

app.listen(PORT, () => {
  console.log(`THECHAISHOP&CO CRM API running at http://localhost:${PORT}`);
});