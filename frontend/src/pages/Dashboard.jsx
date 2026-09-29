import React, { useEffect, useState } from "react";
import { Users, UserRoundPlus, ShoppingBag, CheckSquare, IndianRupee } from "lucide-react";
import api from "../api";
import Stat from "../components/Stat";

const money = n => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);

export default function Dashboard() {
  const [d,setD]=useState(null);
  useEffect(()=>{api.get("/dashboard").then(r=>setD(r.data))},[]);
  if(!d) return <div className="loading">Loading dashboard…</div>;
  return <div>
    <div className="page-head"><div><h2>Dashboard</h2><p>Overview of your CRM activity.</p></div></div>
    <div className="stats">
      <Stat label="Customers" value={d.customers} icon={Users}/>
      <Stat label="Leads" value={d.leads} icon={UserRoundPlus}/>
      <Stat label="Orders" value={d.orders} icon={ShoppingBag}/>
      <Stat label="Open Tasks" value={d.tasks} icon={CheckSquare}/>
      <Stat label="Total Revenue" value={money(d.revenue)} icon={IndianRupee}/>
    </div>
    <div className="grid-2">
      <div className="card"><div className="card-head"><h3>Recent Customers</h3></div>
        {d.recentCustomers.map(c=><div className="list-row" key={c.id}><div className="avatar sm">{c.name[0]}</div><div><strong>{c.name}</strong><span>{c.email||"No email"}</span></div><span className="badge success">{c.status}</span></div>)}
      </div>
      <div className="card"><div className="card-head"><h3>Recent Orders</h3></div>
        {d.recentOrders.map(o=><div className="list-row" key={o.id}><div><strong>{o.orderNumber}</strong><span>Customer ID: {o.customerId}</span></div><div className="right"><strong>{money(o.amount)}</strong><span className={"badge "+(o.status==="PAID"?"success":"warning")}>{o.status}</span></div></div>)}
      </div>
    </div>
  </div>;
}