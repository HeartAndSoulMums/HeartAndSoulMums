const $=s=>document.querySelector(s);
let ownerKey="";
let orders=[];
let filtered=[];
const STATUS=["New","Design Approved","In Production","Ready for Pickup","Completed","Cancelled"];

function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}
function money(v){const n=Number(v||0);return n.toLocaleString("en-US",{style:"currency",currency:"USD"})}
function val(d,k){const v=d?.[k];return v===null||v===undefined||v===""?"—":v}
function dateOnly(s){if(!s||s==="—")return "—";const p=String(s).split("-").map(Number);if(p.length!==3)return s;return new Date(Date.UTC(p[0],p[1]-1,p[2])).toLocaleDateString("en-US",{timeZone:"UTC",month:"long",day:"numeric",year:"numeric"})}
function dateTime(s){if(!s)return "—";return new Date(s).toLocaleString()}
function phoneDisplay(s){const n=String(s||"").replace(/\D/g,"");return n.length===10?`(${n.slice(0,3)}) ${n.slice(3,6)}-${n.slice(6)}`:s||"—"}
function statusClass(s){return "status-"+String(s).replace(/\s+/g,"-")}
function colorName(name,hex){
  if(name&&String(name).trim()) return String(name).trim();
  const map={"#ffffff":"White","#000000":"Black","#e64b7d":"Pink","#ff0000":"Red","#0000ff":"Blue","#000080":"Navy Blue","#800000":"Maroon","#008000":"Green","#800080":"Purple","#ffd700":"Gold","#c0c0c0":"Silver","#ffa500":"Orange","#a52a2a":"Brown"};
  return map[String(hex||"").toLowerCase()]||"Custom color";
}
function field(label,value){return `<div class="field"><span>${esc(label)}</span><strong>${esc(value||"—")}</strong></div>`}
function parseAddons(v){
  if(Array.isArray(v)) return v;
  try{return JSON.parse(v||"[]")}catch{return v?[String(v)]:[]}
}
function orderNumber(o){return o.data.orderNumber||o.id.slice(0,8).toUpperCase()}
function orderTotal(o){return Number(o.data.estimatedTotal||0)}
function studentName(o){return o.data.studentName||"Unnamed student"}
function customerName(o){return o.data.customerName||"Unknown customer"}

async function api(method="GET",body){
  const res=await fetch("/.netlify/functions/orders",{
    method,
    headers:{"x-owner-key":ownerKey,"Content-Type":"application/json"},
    body:body?JSON.stringify(body):undefined
  });
  const data=await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(data.error||"Request failed");
  return data;
}

async function login(e){
  e.preventDefault();
  ownerKey=$("#ownerKey").value;
  $("#loginError").textContent="";
  try{
    await loadOrders();
    $("#loginView").hidden=true;
    $("#dashboardView").hidden=false;
  }catch(err){
    $("#loginError").textContent=err.message==="Unauthorized"?"Incorrect owner password.":err.message;
    ownerKey="";
  }
}
async function loadOrders(){
  $("#loadingState").hidden=false;$("#errorState").hidden=true;
  try{
    const data=await api();
    orders=data.orders||[];
    $("#lastUpdated").textContent=`Updated ${new Date().toLocaleTimeString([], {hour:"numeric",minute:"2-digit"})}`;
    render();
  }catch(err){
    $("#errorState").textContent=err.message;
    $("#errorState").hidden=false;
    throw err;
  }finally{$("#loadingState").hidden=true}
}
function renderStats(){
  const counts=Object.fromEntries(STATUS.map(s=>[s,orders.filter(o=>o.status===s).length]));
  const active=counts["New"]+counts["Design Approved"]+counts["In Production"]+counts["Ready for Pickup"];
  $("#stats").innerHTML=[
    ["New",counts["New"]],["Active",active],["In Production",counts["In Production"]],["Ready",counts["Ready for Pickup"]],["Completed",counts["Completed"]]
  ].map(([l,n])=>`<div class="stat"><span>${esc(l)}</span><strong>${n}</strong></div>`).join("");
}
function render(){
  renderStats();
  const q=$("#searchInput").value.trim().toLowerCase();
  const sf=$("#statusFilter").value;
  filtered=orders.filter(o=>{
    const d=o.data;
    const hay=[orderNumber(o),studentName(o),customerName(o),d.school,d.promoCodeApplied,d.email,d.phone].join(" ").toLowerCase();
    return (!q||hay.includes(q))&&(sf==="All"||o.status===sf);
  });
  $("#emptyState").hidden=filtered.length!==0;
  $("#ordersList").innerHTML=filtered.map(o=>{
    const d=o.data;
    return `<article class="order-row" data-id="${esc(o.id)}" tabindex="0">
      <div class="order-id"><strong>${esc(orderNumber(o))}</strong><span>${esc(dateTime(o.created_at))}</span></div>
      <div class="customer"><strong>${esc(studentName(o))}</strong><span>Customer: ${esc(customerName(o))}</span></div>
      <div class="school"><strong>${esc(val(d,"school"))}</strong><span>${esc(val(d,"grade"))}</span></div>
      <div class="amount">${money(orderTotal(o))}</div>
      <div class="status-wrap"><span class="status-pill ${statusClass(o.status)}">${esc(o.status)}</span></div>
      <div class="arrow">›</div>
    </article>`;
  }).join("");
  document.querySelectorAll(".order-row").forEach(el=>{
    const open=()=>openOrder(el.dataset.id);
    el.addEventListener("click",open);
    el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open()}});
  });
}
function openOrder(id){
  const o=orders.find(x=>x.id===id); if(!o)return;
  const d=o.data, addons=parseAddons(d.addons);
  const phex=d.primaryColor||"#ffffff", shex=d.secondaryColor||"#ffffff";
  const pname=colorName(d.primaryColorName,phex), sname=colorName(d.secondaryColorName,shex);
  const promo=d.promoCodeApplied||d.promoCode||"";
  const phone=String(d.phone||"").replace(/\D/g,"");
  const detail=`<div class="detail">
    <div class="detail-top">
      <div><span class="eyebrow">ORDER ${esc(orderNumber(o))}</span><h2>${esc(studentName(o))}</h2><div class="detail-sub">${esc(val(d,"school"))} • ${esc(val(d,"grade"))} • Homecoming ${esc(dateOnly(d.homecomingDate))}</div></div>
      <span class="status-pill ${statusClass(o.status)}">${esc(o.status)}</span>
    </div>
    <div class="detail-actions">
      ${phone?`<a href="tel:${esc(phone)}">Call ${esc(phoneDisplay(d.phone))}</a><a href="sms:${esc(phone)}">Text Customer</a>`:""}
      ${d.email?`<a href="mailto:${esc(d.email)}">Email Customer</a>`:""}
      <button class="print" id="printOrder">Print Order Sheet</button>
    </div>
    <div class="detail-layout">
      <div class="detail-main">
        <section class="card"><h3>Student + School</h3><div class="field-grid">
          ${field("Student",d.studentName)}${field("Nickname",d.nickname)}${field("School",d.school)}${field("Mascot",d.mascot)}
          ${field("Grade",d.grade)}${field("Graduation year",d.gradYear)}${field("Jersey / player #",d.number)}${field("Homecoming",dateOnly(d.homecomingDate))}
        </div></section>
        <section class="card"><h3>Mum Build</h3><div class="field-grid">
          ${field("Package",d.package)}${field("Size",d.size)}${field("Length",d.length)}${field("Fullness",d.fullness)}${field("Style",d.style)}
        </div></section>
        <section class="card"><h3>Colors</h3><div class="colors">
          <div class="color-chip"><span class="swatch" style="background:${esc(phex)}"></span><strong>Primary:</strong> ${esc(pname)} • <code>${esc(String(phex).toUpperCase())}</code></div>
          <div class="color-chip"><span class="swatch" style="background:${esc(shex)}"></span><strong>Secondary:</strong> ${esc(sname)} • <code>${esc(String(shex).toUpperCase())}</code></div>
          <div class="color-chip"><strong>Accent:</strong> ${esc(d.accentColor||"None")}</div>
        </div></section>
        <section class="card"><h3>Activities + Personal Details</h3><div class="copytext">Sports / clubs / activities: ${esc(d.activities||"—")}

Favorite things: ${esc(d.favorites||"—")}
Favorite song: ${esc(d.song||"—")}
Bible verse / quote: ${esc(d.quote||"—")}
Special date / relationship detail: ${esc(d.specialDate||"—")}</div></section>
        <section class="card"><h3>Upgrades</h3><div class="copytext">${addons.length?addons.map(x=>"• "+x).join("\n"):"No premium packages selected."}

Specialty braid: ${esc(d.braid||"None")}
Custom printed ribbon: ${esc(d.printedRibbon||"None")}
Printed wording: ${esc(d.ribbonText||"—")}</div></section>
        <section class="card"><h3>Custom Vision + Instructions</h3><div class="copytext">${esc(d.instructions||"No additional instructions provided.")}</div></section>
      </div>
      <aside class="detail-side">
        <section class="card"><h3>Order Status</h3>
          <select class="status-select" id="detailStatus">${STATUS.map(s=>`<option ${s===o.status?"selected":""}>${esc(s)}</option>`).join("")}</select>
        </section>
        <section class="card"><h3>Customer</h3><div class="copytext"><strong>${esc(customerName(o))}</strong>
${esc(phoneDisplay(d.phone))}
${esc(d.email||"—")}
Prefers: ${esc(d.contactMethod||"—")}</div></section>
        <section class="card"><h3>Pricing</h3>
          <div class="price-line"><span>Subtotal</span><strong>${money(Number(d.estimatedTotal||0)+(Number(d.promoDiscount||0)))}</strong></div>
          <div class="price-line"><span>Promo discount</span><strong>${d.promoCodeApplied?esc(d.promoCodeApplied):"None"}</strong></div>
          <div class="price-line total"><span>Order total</span><strong>${money(orderTotal(o))}</strong></div>
          <div class="price-line"><span>Payment</span><strong>Pending checkout</strong></div>
        </section>
        ${promo?`<section class="card referral"><h3>Student Referral</h3><div class="copytext">Code: ${esc(promo)}
Student: ${esc(d.referralStudent||"—")}
School: ${esc(d.referralSchool||"—")}</div></section>`:""}
        <section class="card"><h3>Submission</h3><div class="copytext">Received: ${esc(dateTime(o.created_at))}
Order #: ${esc(orderNumber(o))}</div></section>
      </aside>
    </div>
  </div>`;
  $("#orderDetail").innerHTML=detail;
  $("#orderDialog").showModal();
  $("#printOrder").addEventListener("click",()=>window.print());
  $("#detailStatus").addEventListener("change",async e=>{
    const next=e.target.value, prior=o.status;
    e.target.disabled=true;
    try{
      await api("POST",{orderNumber:orderNumber(o),status:next});
      o.status=next; render();
      $("#orderDialog").close(); openOrder(o.id);
    }catch(err){
      e.target.value=prior;
      alert("Could not update status: "+err.message);
    }finally{e.target.disabled=false}
  });
}

$("#loginForm").addEventListener("submit",login);
$("#refreshBtn").addEventListener("click",()=>loadOrders().catch(()=>{}));
$("#lockBtn").addEventListener("click",()=>{ownerKey="";orders=[];$("#dashboardView").hidden=true;$("#loginView").hidden=false;$("#ownerKey").value=""});
$("#searchInput").addEventListener("input",render);
$("#statusFilter").addEventListener("change",render);
$("#closeDialog").addEventListener("click",()=>$("#orderDialog").close());
