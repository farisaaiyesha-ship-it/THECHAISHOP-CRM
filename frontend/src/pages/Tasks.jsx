import React,{useEffect,useState} from "react";
import {Plus,Trash2} from "lucide-react";
import api from "../api";
import Modal from "../components/Modal";
const empty={title:"",description:"",dueDate:"",priority:"MEDIUM",status:"PENDING",customerId:""};
export default function Tasks(){
 const [items,setItems]=useState([]),[customers,setCustomers]=useState([]),[modal,setModal]=useState(false),[form,setForm]=useState(empty);
 const load=()=>api.get("/tasks").then(r=>setItems(r.data));useEffect(()=>{load();api.get("/customers").then(r=>setCustomers(r.data))},[]);
 const save=async e=>{e.preventDefault();await api.post("/tasks",form);setModal(false);setForm(empty);load()};
 const del=async id=>{if(confirm("Delete this task?")){await api.delete("/tasks/"+id);load()}};
 const update=async(id,status)=>{await api.put("/tasks/"+id,{status});load()};
 return <div><div className="page-head"><div><h2>Tasks & Follow-ups</h2><p>Keep every customer follow-up on schedule.</p></div><button className="primary" onClick={()=>setModal(true)}><Plus/> Add task</button></div>
 <div className="task-grid">{items.map(x=><div className={"task "+x.priority.toLowerCase()} key={x.id}><div className="task-top"><span className="badge">{x.priority}</span><button className="danger-icon" onClick={()=>del(x.id)}><Trash2 size={16}/></button></div><h3>{x.title}</h3><p>{x.description||"No description"}</p><small>Due: {x.dueDate||"No date"}</small><select value={x.status} onChange={e=>update(x.id,e.target.value)}><option>PENDING</option><option>IN_PROGRESS</option><option>DONE</option></select></div>)}</div>
 {modal&&<Modal title="Add task" onClose={()=>setModal(false)}><form className="form" onSubmit={save}><label>Title<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label><label>Description<input value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label><label>Due date<input type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})}/></label><label>Priority<select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}><option>LOW</option><option>MEDIUM</option><option>HIGH</option></select></label><label>Customer<select value={form.customerId} onChange={e=>setForm({...form,customerId:e.target.value})}><option value="">None</option>{customers.map(c=><option value={c.id} key={c.id}>{c.name}</option>)}</select></label><button className="primary full">Save task</button></form></Modal>}</div>
}