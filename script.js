/* Replace APPS_SCRIPT_URL with your deployed Apps Script web app URL */
statusEl.textContent = data.result || 'Synced';
refreshLogs();
}catch(e){
console.error(e);
statusEl.textContent = 'Error syncing — check console';
}
}


clockInBtn.onclick = ()=> postEntry('in');
clockOutBtn.onclick = ()=> postEntry('out');
refreshBtn.onclick = refreshLogs;
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
// Build a GET query to the Apps Script to fetch logs
const params = new URLSearchParams();
if(useFilters){
const f = document.getElementById('fromDate').value;
const t = document.getElementById('toDate').value;
const c = document.getElementById('filterClient').value;
const ty = document.getElementById('typeFilter').value;
if(f) params.set('from', f);
if(t) params.set('to', t);
if(c) params.set('client', c);
if(ty && ty !== 'all') params.set('type', ty);
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
tr.innerHTML = `<td>${ts}</td><td>${r.type==='in'? 'Clock In':'Clock Out'}</td><td>${r.client}</td><td>${r.notes}</td>`;
logTableBody.appendChild(tr);
})
}


// auto-load
refreshLogs();
