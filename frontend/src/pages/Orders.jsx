import React,{useEffect,useState} from "react";
import {Plus,Trash2} from "lucide-react";
import api from "../api";
import Modal from "../components/Modal";
const empty={orderNumber:"",customerId:"",amount:"",status:"PENDING"};
export default function Orders(){
 const [items,setItems]=useState([]),[customers,setCustomers]=useState([]),[modal,setModal]=useState(false),[form,setForm]=useState(empty);
 const load=()=>api.get("/orders").then(r=>setItems(r.data));useEffect(()=>{load();api.get("/customers").then(r=>setCustomers(r.data))},[]);
 const save=async e=>{e.preventDefault();await api.post("/orders",{...form,amount:Number(form.amount)});setModal(false);setForm(empty);load()};
 const del=async id=>{if(confirm("Delete this order?")){await api.delete("/orders/"+id);load()}};
 const customer=id=>customers.find(c=>c.id===id)?.name||id;
 return <div><div className="page-head"><div><h2>Orders</h2><p>Track customer orders and payment status.</p></div><button className="primary" onClick={()=>setModal(true)}><Plus/> Add order</button></div>
 <div className="card table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Status</th><th></th></tr></thead><tbody>{items.map(x=><tr key={x.id}><td><strong>{x.orderNumber}</strong><small>{new Date(x.createdAt).toLocaleDateString()}</small></td><td>{customer(x.customerId)}</td><td>₹{Number(x.amount).toLocaleString("en-IN")}</td><td><select className="inline-select" value={x.status} onChange={async e=>{await api.put("/orders/"+x.id,{status:e.target.value});load()}}><option>PENDING</option><option>PAID</option><option>CANCELLED</option><option>SHIPPED</option></select></td><td><button className="danger-icon" onClick={()=>del(x.id)}><Trash2 size={16}/></button></td></tr>)}</tbody></table></div>
 {modal&&<Modal title="Add order" onClose={()=>setModal(false)}><form className="form" onSubmit={save}><label>Order number<input required value={form.orderNumber} onChange={e=>setForm({...form,orderNumber:e.target.value})}/></label><label>Customer<select required value={form.customerId} onChange={e=>setForm({...form,customerId:e.target.value})}><option value="">Select customer</option>{customers.map(c=><option value={c.id} key={c.id}>{c.name}</option>)}</select></label><label>Amount<input required type="number" min="0" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/></label><label>Status<select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option>PENDING</option><option>PAID</option><option>SHIPPED</option><option>CANCELLED</option></select></label><button className="primary full">Save order</button></form></Modal>}</div>
}