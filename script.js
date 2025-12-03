const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwFIza89j_aWKknrDXPULU61UvsS-yRrIPw_wH9sJE_vr9i0aPPp9n3P9_n7eRDBe5XFw/exec';


async function postEntry(type){
const payload = {
timestamp: new Date().toISOString(),
type, // 'in' or 'out'
client: clientEl.value || '—',
notes: notesEl.value || '',
workType: workTypeEl.value || 'Normal'
};
try{
const res = await fetch(APPS_SCRIPT_URL, {
method: 'POST',
headers: {'Content-Type':'application/json'},
body: JSON.stringify(payload)
});
const data = await res.json();
statusEl.textContent = data.result || 'Synced';
refreshLogs();
}catch(e){
console.error(e);
statusEl.textContent = 'Error syncing — check console';
}
}


clockInBtn.onclick = ()=> postEntry('in');
clockOutBtn.onclick = ()=> postEntry('out');
refreshBtn.onclick = ()=> refreshLogs();
printBtn.onclick = ()=> window.print();
applyFilter.onclick = ()=> refreshLogs(true);
clearFilter.onclick = ()=>{
document.getElementById('fromDate').value = '';
document.getElementById('toDate').value = '';
document.getElementById('filterClient').value = '';
document.getElementById('typeFilter').value = 'all';
refreshLogs();
}


async function refreshLogs(useFilters=false){
const params = new URLSearchParams();
if(useFilters){
const f = document.getElementById('fromDate').value;
const t = document.getElementById('toDate').value;
const c = document.getElementById('filterClient').value;
const ty = document.getElementById('typeFilter').value;
if(f) params.set('from', f);
if(t) params.set('to', t);
if(c) params.set('client', c);
if(ty && ty !== 'all') params.set('workType', ty);
}
try{
const res = await fetch(APPS_SCRIPT_URL + '?' + params.toString());
const data = await res.json();
renderTable(data.rows || []);
}catch(e){
console.error(e);
}
}


function renderTable(rows){
logTableBody.innerHTML = '';
rows.forEach(r=>{
const tr = document.createElement('tr');
const ts = new Date(r.timestamp).toLocaleString();
tr.innerHTML = `<td>${ts}</td><td>${r.type==='in'? 'Clock In':'Clock Out'}</td><td>${r.client}</td><td>${r.notes}</td><td>${r.workType}</td><td>${r.hours || ''}</td><td>${r.pay || ''}</td>`;
logTableBody.appendChild(tr);
});
}


refreshLogs();
