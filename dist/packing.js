(() => {
  'use strict';

  const STORAGE_KEY = 'japan-packing-v1';
  const CATEGORIES = ['Dokumente & Geld','Medikamente','Hygiene','Kleidung','Elektronik','Kamera','Reisealltag'];
  const state = {view:'all',category:'all',status:'all',query:'',editing:null,items:[]};
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const item = (id,name,quantity,category,hand=false,takkyubin=false,note='') => ({id,name,quantity,category,hand,takkyubin,note,checked:false,custom:false});

  const DEFAULT_ITEMS = [
    item('passport','Reisepass',1,'Dokumente & Geld',true,true,'Gültigkeit und freie Seiten rechtzeitig prüfen.'),
    item('passport-copy','Passkopie digital und auf Papier',2,'Dokumente & Geld',true,true,'Getrennt vom Original aufbewahren.'),
    item('flight-docs','Flug- und Buchungsunterlagen offline',1,'Dokumente & Geld',true,true),
    item('insurance','Reiseversicherungs-Nachweis',1,'Dokumente & Geld',true,true),
    item('emergency-contacts','Notfallkontakte und Sperrnummern',1,'Dokumente & Geld',true,true),
    item('cards','Debit- und Kreditkarten',2,'Dokumente & Geld',true,true,'Wenn möglich Karten verschiedener Anbieter mitnehmen.'),
    item('cash','Japanische Yen für den Start',1,'Dokumente & Geld',true,true),
    item('driving-docs','Führerschein und benötigte Übersetzung',1,'Dokumente & Geld',true,false,'Nur nötig, wenn Okinawa mit Mietwagen geplant wird.'),
    item('suica-plan','Notiz zur physischen Suica',1,'Dokumente & Geld',true,false,'Mit Android nach Ankunft eine reguläre Karte kaufen.'),
    item('medication','Persönliche Medikamente',1,'Medikamente',true,true,'Genügend Reserve einplanen; wichtige Medikamente nie aufgeben.'),
    item('prescriptions','Rezepte oder ärztliche Bescheinigung',1,'Medikamente',true,true,'Bei verschreibungspflichtigen Medikamenten Einfuhrregeln prüfen.'),
    item('painkillers','Schmerzmittel',1,'Medikamente',true,true),
    item('stomach','Magen- und Durchfallmittel',1,'Medikamente',true,true),
    item('plasters','Pflaster und Blasenpflaster',1,'Medikamente',true,true),
    item('allergy','Allergiemittel',1,'Medikamente',true,true,'Nur falls benötigt.'),
    item('toothbrush','Zahnbürste und Zahnpasta',1,'Hygiene',false,true),
    item('deodorant','Deodorant',1,'Hygiene',false,true),
    item('shampoo','Kleine Pflegeprodukte',1,'Hygiene',false,true,'Viele Hotels stellen Shampoo und Duschgel bereit.'),
    item('razor','Rasierer',1,'Hygiene',false,false),
    item('sunscreen','Sonnencreme',1,'Hygiene',false,true),
    item('sanitizer','Kleine Handdesinfektion',1,'Hygiene',true,true),
    item('tissues','Taschentücher',2,'Hygiene',true,true),
    item('glasses','Brille oder Kontaktlinsen mit Reserve',1,'Hygiene',true,true),
    item('underwear','Unterwäsche',8,'Kleidung',false,false,'Für regelmässige Nutzung der Coin Laundry geplant.'),
    item('socks','Socken',8,'Kleidung',false,false),
    item('tshirts','T-Shirts',6,'Kleidung',false,false),
    item('longshirts','Langarmshirts',3,'Kleidung',false,false),
    item('trousers','Lange Hosen',3,'Kleidung',false,false),
    item('midlayer','Pullover oder Fleece',2,'Kleidung',false,false),
    item('jacket','Leichte wetterfeste Jacke',1,'Kleidung',false,true,'Für kühlere Abende in Kanazawa und Takayama.'),
    item('rainwear','Kompakter Regenschutz',1,'Kleidung',false,true),
    item('sleepwear','Schlafkleidung',1,'Kleidung',false,true),
    item('smart-outfit','Schickes Outfit für Bethel und Mitarbeit',1,'Kleidung',false,false,'Knitterarme Kombination aus Oberteil, Hose oder Rock und passenden Schuhen.'),
    item('walking-shoes','Bequeme eingelaufene Schuhe',1,'Kleidung',false,true),
    item('second-shoes','Leichte Ersatzschuhe',1,'Kleidung',false,false),
    item('overnight-underwear','Unterwäsche für die Takkyūbin-Etappen',3,'Kleidung',false,true),
    item('overnight-socks','Socken für die Takkyūbin-Etappen',3,'Kleidung',false,true),
    item('overnight-shirts','Oberteile für die Takkyūbin-Etappen',2,'Kleidung',false,true),
    item('phone','Android-Smartphone',1,'Elektronik',true,true),
    item('phone-charger','USB-C-Ladegerät',1,'Elektronik',true,true),
    item('usb-cables','USB-C-Kabel',2,'Elektronik',true,true),
    item('powerbank','Powerbank',1,'Elektronik',true,true,'Muss ins Handgepäck; Kapazitätsregeln der Airline prüfen.'),
    item('adapter','Japan-Reiseadapter Typ A',1,'Elektronik',true,true,'Schweizer Stecker benötigen meistens einen Adapter.'),
    item('earbuds','Kopfhörer',1,'Elektronik',true,true),
    item('esim-info','JJ-eSIM-Unterlagen und QR-Code offline',1,'Elektronik',true,true),
    item('watch-charger','Ladegerät für Uhr oder Tracker',1,'Elektronik',true,true,'Falls benötigt.'),
    item('laptop','Laptop für Remote-Arbeit',1,'Elektronik',true,true,'Nicht per Takkyūbin versenden; im Rucksack selbst tragen.'),
    item('laptop-charger','Laptop-Ladegerät',1,'Elektronik',true,true),
    item('laptop-sleeve','Gepolsterte Laptop-Hülle',1,'Elektronik',true,true),
    item('remote-work-kit','Kleine Maus oder USB-C-Hub',1,'Elektronik',true,true,'Nur mitnehmen, was du für die Arbeit wirklich brauchst.'),
    item('camera-body','Kamera',1,'Kamera',true,true,'Wertgegenstände nicht per Takkyūbin versenden.'),
    item('camera-lenses','Objektive',2,'Kamera',true,true),
    item('camera-batteries','Kamera-Akkus',3,'Kamera',true,true,'Ersatzakkus gehören ins Handgepäck.'),
    item('memory-cards','Speicherkarten',3,'Kamera',true,true),
    item('camera-charger','Kamera-Ladegerät',1,'Kamera',true,true),
    item('camera-cleaning','Mikrofasertuch und Blasebalg',1,'Kamera',true,true),
    item('cabin-suitcase','Kabinenkoffer',1,'Reisealltag',false,false,'Masse und Gewichtslimit aller gebuchten Airlines prüfen.'),
    item('daypack','Kleiner Tages- und Übernachtungsrucksack',1,'Reisealltag',true,true,'Für Fuji sowie Shirakawa-gō und Takayama.'),
    item('packing-cubes','Packwürfel',3,'Reisealltag',false,false),
    item('laundry-bag','Wäschebeutel',1,'Reisealltag',false,false),
    item('detergent','Waschmittelblätter',4,'Reisealltag',false,false),
    item('bottle','Leere Trinkflasche',1,'Reisealltag',true,true),
    item('umbrella','Kompakter Regenschirm',1,'Reisealltag',false,true),
    item('coin-purse','Kleines Münzportemonnaie',1,'Reisealltag',true,true),
    item('shopping-bag','Faltbare Einkaufstasche',1,'Reisealltag',false,true),
    item('pen','Kugelschreiber',1,'Reisealltag',true,true),
    item('luggage-tag','Kofferanhänger',1,'Reisealltag',false,false),
    item('luggage-scale','Kleine Kofferwaage',1,'Reisealltag',false,false,'Hilfreich für strenge Kabinengepäck-Limits und Rückflug-Einkäufe.'),
    item('small-lock','Kleines Gepäckschloss',1,'Reisealltag',false,false,'Für Capsule-Hotel und Gepäckaufbewahrung.'),
    item('snacks','Kleine Snacks für die Anreise',1,'Reisealltag',true,false),
    item('swimwear','Badebekleidung',1,'Kleidung',false,false,'Für Okinawa und spontane Hotel- oder Strandtage.'),
    item('water-shoes','Leichte Badeschuhe oder Sandalen',1,'Kleidung',false,false),
    item('quick-dry-towel','Kleines schnelltrocknendes Handtuch',1,'Reisealltag',false,false,'Optional; Hotels stellen normale Handtücher bereit.'),
    item('waterproof-pouch','Wasserdichte Hülle für Smartphone und Wertsachen',1,'Reisealltag',false,false),
    item('hiking-socks','Zusätzliche Wandersocken',2,'Kleidung',false,true,'Für Fuji-Region, Shirakawa-gō und Mt. Misen.'),
    item('cap','Kappe oder Sonnenhut',1,'Kleidung',false,true),
    item('backpack-cover','Regenhülle für den Rucksack',1,'Reisealltag',true,true)
  ];

  function cloneDefaults(){return DEFAULT_ITEMS.map(value=>({...value}));}
  function normalize(raw){
    if(!raw||!Array.isArray(raw.items))throw new Error('Keine gültige Packliste gefunden.');
    const seen=new Set();
    const items=raw.items.map((value,index)=>{
      const id=String(value.id||`import-${index}-${Date.now()}`);
      if(seen.has(id))throw new Error('Doppelte Gegenstands-ID in der Datei.');
      seen.add(id);
      const category=CATEGORIES.includes(value.category)?value.category:'Reisealltag';
      return {id,name:String(value.name||'').trim().slice(0,80),quantity:Math.max(1,Math.min(99,Number(value.quantity)||1)),category,hand:Boolean(value.hand),takkyubin:Boolean(value.takkyubin),note:String(value.note||'').slice(0,240),checked:Boolean(value.checked),custom:Boolean(value.custom)};
    }).filter(value=>value.name);
    if(!items.length)throw new Error('Die Packliste enthält keine Gegenstände.');
    return items;
  }

  function load(){
    try{
      const saved=JSON.parse(localStorage.getItem(STORAGE_KEY));
      const current=normalize(saved);
      const ids=new Set(current.map(value=>value.id));
      DEFAULT_ITEMS.forEach(value=>{if(!ids.has(value.id))current.push({...value});});
      const smart=current.find(value=>value.id==='smart-outfit'&&value.name==='Ordentliches Outfit für Bethel und Mitarbeit');
      if(smart){smart.name='Schickes Outfit für Bethel und Mitarbeit';smart.note='Knitterarme Kombination aus Oberteil, Hose oder Rock und passenden Schuhen.';}
      return current;
    }catch{return cloneDefaults();}
  }
  function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify({version:1,items:state.items}))}catch{} }
  function matchesView(value,view=state.view){return view==='all'||(view==='hand'&&value.hand)||(view==='takkyubin'&&value.takkyubin);}
  function filtered(){
    const query=state.query.toLocaleLowerCase('de');
    return state.items.filter(value=>matchesView(value)&&(state.category==='all'||value.category===state.category)&&(state.status==='all'||(state.status==='packed')===value.checked)&&`${value.name} ${value.note} ${value.category}`.toLocaleLowerCase('de').includes(query));
  }
  function progress(items=state.items.filter(value=>matchesView(value))){return {done:items.filter(value=>value.checked).length,total:items.length};}

  function render(){
    const visible=filtered();
    const current=state.items.filter(value=>matchesView(value));
    const count=progress(current);
    $('packingProgress').textContent=`${count.done} von ${count.total}`;
    $('packingSummary').textContent=`${visible.length} angezeigt · ${count.total-count.done} noch offen`;
    document.querySelectorAll('[data-pack-view]').forEach(button=>{const active=button.dataset.packView===state.view;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active));});
    const groups=CATEGORIES.map(category=>[category,visible.filter(value=>value.category===category)]).filter(([,items])=>items.length);
    $('packingList').innerHTML=groups.length?groups.map(([category,items])=>`<section class="packing-category"><h3>${esc(category)} · ${items.length}</h3>${items.map(renderItem).join('')}</section>`).join(''):'<div class="packing-empty">Keine passenden Gegenstände gefunden.</div>';
  }

  function renderItem(value){
    const tags=[value.hand?'Handgepäck':'',value.takkyubin?'Takkyūbin':''].filter(Boolean);
    const editing=state.editing===value.id;
    return `<article class="packing-item${value.checked?' packed':''}" data-pack-id="${esc(value.id)}"><label class="packing-check"><input type="checkbox" data-pack-field="checked" ${value.checked?'checked':''} aria-label="${esc(value.name)} eingepackt"></label><div class="packing-item-main"><span class="packing-item-name">${esc(value.name)}</span>${value.note?`<span class="packing-note">${esc(value.note)}</span>`:''}${tags.length?`<span class="packing-tags">${tags.map(tag=>`<span class="packing-tag">${tag}</span>`).join('')}</span>`:''}</div><div class="packing-qty"><label for="qty-${esc(value.id)}">Menge</label><input id="qty-${esc(value.id)}" type="number" min="1" max="99" value="${value.quantity}" data-pack-field="quantity"></div><button class="packing-edit" type="button" data-pack-action="edit">${editing?'Schliessen':'Bearbeiten'}</button>${editing?renderEditor(value):''}</article>`;
  }

  function renderEditor(value){
    return `<div class="packing-editing"><input data-edit-field="name" value="${esc(value.name)}" maxlength="80" aria-label="Bezeichnung bearbeiten"><select data-edit-field="category" aria-label="Kategorie bearbeiten">${CATEGORIES.map(category=>`<option ${category===value.category?'selected':''}>${esc(category)}</option>`).join('')}</select><textarea data-edit-field="note" rows="2" maxlength="240" placeholder="Notiz">${esc(value.note)}</textarea><div class="packing-destinations"><label><input type="checkbox" data-edit-field="hand" ${value.hand?'checked':''}> Handgepäck</label><label><input type="checkbox" data-edit-field="takkyubin" ${value.takkyubin?'checked':''}> Takkyūbin-Rucksack</label></div><div class="packing-editing-actions"><button type="button" data-pack-action="save-edit">Speichern</button><button type="button" data-pack-action="cancel-edit">Abbrechen</button><button type="button" class="danger" data-pack-action="delete">Löschen</button></div></div>`;
  }

  function toast(message){
    const node=$('packingToast');node.textContent=message;node.classList.add('show');
    clearTimeout(toast.timer);toast.timer=setTimeout(()=>node.classList.remove('show'),3200);
  }
  function findItem(element){return state.items.find(value=>value.id===element.closest('[data-pack-id]')?.dataset.packId);}
  function updateItem(element){
    const value=findItem(element);if(!value)return;
    if(element.dataset.packField==='checked')value.checked=element.checked;
    if(element.dataset.packField==='quantity')value.quantity=Math.max(1,Math.min(99,Number(element.value)||1));
    save();render();
  }

  function onListClick(event){
    const button=event.target.closest('[data-pack-action]');if(!button)return;
    const value=findItem(button);if(!value)return;
    const action=button.dataset.packAction;
    if(action==='edit'){state.editing=state.editing===value.id?null:value.id;render();return;}
    if(action==='cancel-edit'){state.editing=null;render();return;}
    if(action==='save-edit'){
      const row=button.closest('[data-pack-id]');
      const name=row.querySelector('[data-edit-field="name"]').value.trim();
      if(!name){toast('Bitte eine Bezeichnung eingeben.');return;}
      value.name=name.slice(0,80);value.category=row.querySelector('[data-edit-field="category"]').value;value.note=row.querySelector('[data-edit-field="note"]').value.trim().slice(0,240);value.hand=row.querySelector('[data-edit-field="hand"]').checked;value.takkyubin=row.querySelector('[data-edit-field="takkyubin"]').checked;state.editing=null;save();render();toast('Gegenstand aktualisiert.');return;
    }
    if(action==='delete'&&confirm(`„${value.name}“ aus der Packliste löschen?`)){state.items=state.items.filter(item=>item.id!==value.id);state.editing=null;save();render();toast('Gegenstand gelöscht.');}
  }

  function addItem(event){
    event.preventDefault();const name=$('packingNewName').value.trim();if(!name)return;
    const id=crypto.randomUUID?crypto.randomUUID():`custom-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    state.items.push({id,name:name.slice(0,80),quantity:Math.max(1,Math.min(99,Number($('packingNewQty').value)||1)),category:$('packingNewCategory').value,hand:$('packingNewHand').checked,takkyubin:$('packingNewTakkyubin').checked,note:$('packingNewNote').value.trim().slice(0,240),checked:false,custom:true});
    event.target.reset();$('packingNewQty').value='1';save();render();toast('Gegenstand hinzugefügt.');
  }

  function payload(){return {version:1,exportedAt:new Date().toISOString(),items:state.items};}
  function download(name,type,text){const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([text],{type}));link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(link.href),1000);}
  function exportJson(prefix='japan-packliste'){download(`${prefix}.json`,'application/json;charset=utf-8',JSON.stringify(payload(),null,2));}
  function csvCell(value){const text=String(value??'');return /[",\n\r]/.test(text)?`"${text.replaceAll('"','""')}"`:text;}
  function exportCsv(){
    const rows=[['id','name','quantity','category','hand_luggage','takkyubin','checked','note','custom'],...state.items.map(value=>[value.id,value.name,value.quantity,value.category,value.hand,value.takkyubin,value.checked,value.note,value.custom])];
    download('japan-packliste.csv','text/csv;charset=utf-8','\ufeff'+rows.map(row=>row.map(csvCell).join(',')).join('\r\n'));
  }
  function parseCsv(text){
    const rows=[];let row=[],cell='',quoted=false;
    for(let i=0;i<text.length;i++){
      const char=text[i];
      if(quoted&&char==='"'&&text[i+1]==='"'){cell+='"';i++;}
      else if(char==='"')quoted=!quoted;
      else if(char===','&&!quoted){row.push(cell);cell='';}
      else if((char==='\n'||char==='\r')&&!quoted){if(char==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(value=>value!==''))rows.push(row);row=[];cell='';}
      else cell+=char;
    }
    row.push(cell);if(row.some(value=>value!==''))rows.push(row);
    const headers=rows.shift()?.map(value=>value.replace(/^\ufeff/,'').trim())||[];
    const index=name=>headers.indexOf(name);const bool=value=>String(value).toLowerCase()==='true'||value==='1';
    return {version:1,items:rows.map((values,rowIndex)=>({id:values[index('id')]||`csv-${Date.now()}-${rowIndex}`,name:values[index('name')],quantity:values[index('quantity')],category:values[index('category')],hand:bool(values[index('hand_luggage')]),takkyubin:bool(values[index('takkyubin')]),checked:bool(values[index('checked')]),note:values[index('note')]||'',custom:bool(values[index('custom')])}))};
  }

  async function importFile(file){
    try{const text=await file.text();const raw=file.name.toLowerCase().endsWith('.csv')?parseCsv(text):JSON.parse(text);state.items=normalize(raw);state.editing=null;save();render();toast(`${state.items.length} Gegenstände importiert.`);}catch(error){toast(`Import fehlgeschlagen: ${error.message}`);}finally{$('packingImport').value='';}
  }

  function bytesToBase64Url(bytes){let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(binary).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');}
  function base64UrlToBytes(value){const padded=value.replaceAll('-','+').replaceAll('_','/')+'='.repeat((4-value.length%4)%4);const binary=atob(padded);return Uint8Array.from(binary,char=>char.charCodeAt(0));}
  async function encodeShare(raw){
    const bytes=new TextEncoder().encode(JSON.stringify(raw));
    if('CompressionStream' in window){const compressed=await new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer();return `z${bytesToBase64Url(new Uint8Array(compressed))}`;}
    return `j${bytesToBase64Url(bytes)}`;
  }
  async function decodeShare(value){
    const mode=value[0],bytes=base64UrlToBytes(value.slice(1));
    if(mode==='z'&&'DecompressionStream' in window){const expanded=await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer();return JSON.parse(new TextDecoder().decode(expanded));}
    if(mode==='j')return JSON.parse(new TextDecoder().decode(bytes));
    throw new Error('Dieser geteilte Link wird vom Browser nicht unterstützt.');
  }
  async function share(){
    try{
      const encoded=await encodeShare(payload());const url=`${location.href.split('#')[0]}#pack=${encoded}`;
      if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(url);toast('Teilbarer Link kopiert. Der Empfänger erhält eine eigene Kopie.');}
      else prompt('Diesen Link kopieren:',url);
    }catch(error){toast(`Link konnte nicht erstellt werden: ${error.message}`);}
  }
  async function receiveShare(){
    if(!location.hash.startsWith('#pack='))return;
    try{
      const imported=normalize(await decodeShare(location.hash.slice(6)));
      const hasLocal=localStorage.getItem(STORAGE_KEY);
      if(!hasLocal||confirm('Die geteilte Packliste als eigene Kopie übernehmen und deine aktuelle lokale Liste ersetzen?')){state.items=imported;save();toast('Geteilte Packliste als eigene Kopie übernommen.');}
    }catch(error){toast(`Geteilter Link konnte nicht gelesen werden: ${error.message}`);}
    history.replaceState(null,'',`${location.pathname}${location.search}#packliste`);render();
  }

  function printList(title,items){
    const groups=CATEGORIES.map(category=>[category,items.filter(value=>value.category===category)]).filter(([,values])=>values.length);
    return `<section class="print-list"><h2>${esc(title)}</h2>${groups.map(([category,values])=>`<div class="print-group"><h3>${esc(category)}</h3><ul>${values.map(value=>`<li><span class="print-check">${value.checked?'✓':''}</span>${value.quantity>1?`${value.quantity}× `:''}${esc(value.name)}${value.note?`<span class="print-note">${esc(value.note)}</span>`:''}</li>`).join('')}</ul></div>`).join('')}</section>`;
  }
  function printPacking(){
    const split=$('packingPrintLayout').value==='split';const node=$('packingPrint');
    node.className=`packing-print${split?' split':''}`;
    node.innerHTML=split?[printList('Gesamt-Packliste',state.items),printList('Handgepäck',state.items.filter(value=>value.hand)),printList('Takkyūbin-Rucksack',state.items.filter(value=>value.takkyubin))].join(''):printList('Japan 2027 · Gesamt-Packliste',state.items);
    window.print();
  }

  async function action(event){
    const button=event.target.closest('[data-pack-action]');if(!button||button.closest('#packingList'))return;
    switch(button.dataset.packAction){
      case 'export-json':exportJson();toast('JSON-Sicherung erstellt.');break;
      case 'export-csv':exportCsv();toast('CSV-Datei erstellt.');break;
      case 'import':$('packingImport').click();break;
      case 'share':await share();break;
      case 'print':printPacking();break;
      case 'reset':if(confirm('Aktuelle Liste sichern und danach die Standardliste wiederherstellen?')){exportJson('japan-packliste-vor-reset');state.items=cloneDefaults();state.editing=null;save();render();toast('Standardliste wiederhergestellt.');}break;
    }
  }

  async function init(){
    if(!$('packliste'))return;
    state.items=load();
    const categoryOptions=CATEGORIES.map(category=>`<option value="${esc(category)}">${esc(category)}</option>`).join('');
    $('packingCategory').insertAdjacentHTML('beforeend',categoryOptions);$('packingNewCategory').innerHTML=categoryOptions;
    document.querySelector('.packing-tabs').addEventListener('click',event=>{const button=event.target.closest('[data-pack-view]');if(button){state.view=button.dataset.packView;render();}});
    $('packingSearch').addEventListener('input',event=>{state.query=event.target.value.trim();render();});
    $('packingCategory').addEventListener('change',event=>{state.category=event.target.value;render();});
    $('packingStatus').addEventListener('change',event=>{state.status=event.target.value;render();});
    $('packingList').addEventListener('change',event=>{if(event.target.dataset.packField)updateItem(event.target);});
    $('packingList').addEventListener('click',onListClick);
    $('packingAddForm').addEventListener('submit',addItem);
    $('packliste').addEventListener('click',action);
    $('packingImport').addEventListener('change',event=>{if(event.target.files[0])importFile(event.target.files[0]);});
    render();await receiveShare();
  }

  init();
})();
