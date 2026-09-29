import React, { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import api from "../api";
import Modal from "../components/Modal";

const empty={name:"",email:"",phone:"",address:"",status:"ACTIVE"};

export default function Customers(){
 const [items,setItems]=useState([]),[q,setQ]=useState(""),[modal,setModal]=useState(false),[form,setForm]=useState(empty),[editing,setEditing]=useState(null);
 const load=()=>api.get("/customers").then(r=>setItems(r.data)); useEffect(load,[]);
 const save=async e=>{e.preventDefault(); editing?await api.put("/customers/"+editing,form):await api.post("/customers",form);setModal(false);load()};
 const edit=x=>{setEditing(x.id);setForm({...x});setModal(true)}; const add=()=>{setEditing(null);setForm(empty);setModal(true)};
 const del=async id=>{if(confirm("Delete this customer?")){await api.delete("/customers/"+id);load()}};
 const filtered=items.filter(x=>(x.name+" "+(x.email||"")+" "+(x.phone||"")).toLowerCase().includes(q.toLowerCase()));
 return <div><div className="page-head"><div><h2>Customers</h2><p>Manage your customer relationships.</p></div><button className="primary" onClick={add}><Plus/> Add customer</button></div>
 <div className="toolbar"><div className="search"><Search size={18}/><input placeholder="Search customers…" value={q} onChange={e=>setQ(e.target.value)}/></div></div>
 <div className="card table-wrap"><table><thead><tr><th>Customer</th><th>Phone</th><th>Location</th><th>Status</th><th></th></tr></thead><tbody>{filtered.map(x=><tr key={x.id}><td><strong>{x.name}</strong><small>{x.email}</small></td><td>{x.phone||"—"}</td><td>{x.address||"—"}</td><td><span className="badge success">{x.status}</span></td><td className="actions"><button onClick={()=>edit(x)}><Pencil size={16}/></button><button onClick={()=>del(x.id)}><Trash2 size={16}/></button></td></tr>)}</tbody></table></div>
 {modal&&<Modal title={editing?"Edit customer":"Add customer"} onClose={()=>setModal(false)}><form className="form" onSubmit={save}>{["name","email","phone","address"].map(k=><label key={k}>{k[0].toUpperCase()+k.slice(1)}<input required={k==="name"} value={form[k]||""} onChange={e=>setForm({...form,[k]:e.target.value})}/></label>)}<label>Status<select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option>ACTIVE</option><option>INACTIVE</option></select></label><button className="primary full">Save customer</button></form></Modal>}</div>
}