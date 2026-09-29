import React from "react";
export default function Stat({label,value,icon:Icon,sub}) {
  return <div className="stat"><div className="stat-icon"><Icon size={20}/></div><div><span>{label}</span><strong>{value}</strong>{sub&&<small>{sub}</small>}</div></div>;
}