import React,{useEffect,useState} from "react";
import {Plus,Trash2} from "lucide-react";
import api from "../api";
import Modal from "../components/Modal";
const empty={name:"",email:"",phone:"",source:"",status:"NEW",notes:""};
export default function Leads(){
 const [items,setItems]=useState([]),[modal,setModal]=useState(false),[form,setForm]=useState(empty);
 const load=()=>api.get("/leads").then(r=>setItems(r.data));useEffect(load,[]);
 const save=async e=>{e.preventDefault();await api.post("/leads",form);setModal(false);setForm(empty);load()};
 const del=async id=>{if(confirm("Delete this lead?")){await api.delete("/leads/"+id);load()}};
 return <div><div className="page-head"><div><h2>Leads</h2><p>Track prospects and conversion opportunities.</p></div><button className="primary" onClick={()=>setModal(true)}><Plus/> Add lead</button></div>
 <div className="card table-wrap"><table><thead><tr><th>Lead</th><th>Contact</th><th>Source</th><th>Status</th><th></th></tr></thead><tbody>{items.map(x=><tr key={x.id}><td><strong>{x.name}</strong><small>{x.notes||"—"}</small></td><td>{x.email||"—"}<small>{x.phone||""}</small></td><td>{x.source||"—"}</td><td><select className="inline-select" value={x.status} onChange={async e=>{await api.put("/leads/"+x.id,{status:e.target.value});load()}}><option>NEW</option><option>CONTACTED</option><option>QUALIFIED</option><option>CONVERTED</option><option>LOST</option></select></td><td><button className="danger-icon" onClick={()=>del(x.id)}><Trash2 size={16}/></button></td></tr>)}</tbody></table></div>
 {modal&&<Modal title="Add lead" onClose={()=>setModal(false)}><form className="form" onSubmit={save}>{["name","email","phone","source","notes"].map(k=><label key={k}>{k[0].toUpperCase()+k.slice(1)}<input required={k==="name"} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/></label>)}<button className="primary full">Save lead</button></form></Modal>}</div>
}