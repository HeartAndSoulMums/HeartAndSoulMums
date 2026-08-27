let SITE_CONFIG = null;
let PROMO_CODES = {};
let activePromo = null;

const FALLBACK_CONFIG = {"hero":{"eyebrow":"PREMIUM • PERSONALIZED • ONE OF A KIND","title_before":"No two mums","title_emphasis":"should be the same.","body":"Every Heart & Soul mum is designed around the student wearing it — their school, colors, personality, activities, accomplishments and homecoming memories."},"difference":{"heading":"A wearable keepsake of their high-school experience.","body":"Names, sports, clubs, jersey numbers, school pride, favorite things, photos, custom ribbon and personal details can all become part of the design.","tagline":"Don’t see it? Ask us. If we can make it, we’ll put it on your mum."},"packages":{"Classic":{"price":195,"label":"TRADITIONAL + PERSONAL","description":"A smaller, beautifully personalized traditional mum."},"Signature":{"price":325,"label":"OUR SIGNATURE EXPERIENCE","description":"A full-size custom mum with more ribbon, texture and personality."},"Deluxe":{"price":450,"label":"BIG TEXAS ENERGY","description":"Oversized, extra-detailed and built to make people ask where you got it."},"Showstopper":{"price":600,"label":"TELL US YOUR VISION","description":"Our most elaborate custom work. Individually designed and quoted."}},"pricing":{"sizes":{"Standard":0,"Large":50,"XL":100,"Oversized":150},"lengths":{"Standard":0,"Long":40,"Floor Length":75,"Extra Floor Length":100},"fullness":{"Classic":0,"Extra Full":50,"Extreme":125},"addons":{"Light It Up Package":35,"Bling Package":40,"Feather Package":25,"Charm Package":30,"Photo Package":35,"Sport Package":35,"Senior Package":40,"Sweetheart Package":35},"braids":{"None":0,"Simple specialty braid":15,"Detailed specialty braid":25,"Elaborate braid":35},"printed_ribbon":{"None":0,"1 custom ribbon":20,"2 custom ribbons":40,"3 custom ribbons":60}},"referral":{"discount_percent":10,"reward_orders":5,"reward_text":"Free Classic mum after 5 fully paid, non-refunded qualifying orders.","codes":[]},"senior":{"heading":"Four years. One final homecoming.","body":"Senior mums can incorporate their name, Class of 2027, school, mascot, sports, clubs, accomplishments, photos, custom ribbon, premium metallics and the memories that defined high school."},"policies":[{"title":"Payment in Full","body":"Full payment is required before production begins and confirms the order."},{"title":"Custom Order Refunds","body":"Because every mum is custom-made, payments are nonrefundable once materials have been purchased or production has begun."},{"title":"Design Changes","body":"Changes after materials or design are approved may require a change fee and are subject to material availability."},{"title":"Rush Orders","body":"Rush orders may carry an additional fee and are accepted only when schedule and materials allow."}],"rush":[{"window":"14+ days","fee":"Standard pricing"},{"window":"7–13 days","fee":"+15%"},{"window":"4–6 days","fee":"+25%"},{"window":"72 hours or less","fee":"+40–50% if accepted"}],"gallery":[{"image":"/assets/gallery/senior-showstopper-full.jpg","alt":"Pink, white and silver custom senior homecoming mum with feathers and specialty ribbon","caption":"Senior Showstopper • Pink, white + silver"},{"image":"/assets/gallery/senior-showstopper-front.jpg","alt":"Full front view of a custom senior homecoming mum","caption":"Designed from top to ribbon tip"},{"image":"/assets/gallery/senior-showstopper-detail.jpg","alt":"Close-up of custom homecoming mum flowers, teddy bear, Texas accent and ribbon work","caption":"Custom details that make it personal"},{"image":"/assets/gallery/senior-showstopper-close.jpg","alt":"Close-up of premium flowers, rhinestones and ribbon details on a homecoming mum","caption":"Layered texture, sparkle + school spirit"},{"image":"/assets/gallery/senior-showstopper-length.jpg","alt":"Full-length custom senior homecoming mum with long ribbons and feathers","caption":"A keepsake made for their final homecoming"}],"footer_text":"Custom homecoming mums made with heart and designed for spirit.","branding":{"business_name":"Heart & Soul Signature Mums","logo":"/heart-and-soul-logo.jpeg","tagline":"Made with Heart. Designed for Spirit.","phone":"","email":"","instagram":"","facebook":"","service_area":"Local pickup"},"announcement":{"enabled":true,"text":"Now accepting custom Homecoming orders — reserve your spot early."},"ordering":{"accepting_orders":true,"closed_message":"We are currently at capacity for new orders. Please check back soon.","minimum_lead_days":14,"pickup_instructions":"Pickup details and payment instructions are confirmed after your order is reviewed.","payment_policy":"Full payment is required before production begins.","refund_policy":"Because every mum is custom-made, payments are nonrefundable once materials have been purchased or production has begun."}};


function normalizeOwnerConfig(cfg){
  cfg = cfg || {};
  cfg.branding = cfg.branding || {
    business_name: cfg.business_name || 'Heart & Soul Signature Mums',
    logo: '/heart-and-soul-logo.jpeg',
    tagline: 'Made with Heart. Designed for Spirit.',
    phone:'', email:'', instagram:'', facebook:'', service_area:'Local pickup'
  };
  cfg.ordering = cfg.ordering || {
    accepting_orders:true,
    closed_message:'We are currently at capacity for new orders.',
    minimum_lead_days:14,
    pickup_instructions:''
  };
  cfg.announcement = cfg.announcement || {enabled:false,text:''};
  return cfg;
}

function applyOwnerControls(){
  const b=SITE_CONFIG.branding || {};
  const logo=b.logo || '/heart-and-soul-logo.jpeg';
  document.querySelectorAll('.cms-logo').forEach(img=>{img.src=logo; img.alt=b.business_name || 'Heart & Soul Signature Mums';});
  document.title=(b.business_name || 'Heart & Soul Signature Mums') + ' | Custom Homecoming Mums';
  setText('#contactBusinessName', b.business_name);
  setText('#serviceArea', b.service_area);
  setText('#pickupInstructions', SITE_CONFIG.ordering?.pickup_instructions);

  const ann=document.getElementById('announcementBar');
  if(ann){
    if(SITE_CONFIG.announcement?.enabled && SITE_CONFIG.announcement?.text){
      ann.textContent=SITE_CONFIG.announcement.text; ann.hidden=false;
    } else ann.hidden=true;
  }
  const setLink=(id, text, href)=>{
    const a=document.getElementById(id); if(!a) return;
    if(text){a.textContent=text; a.href=href; a.hidden=false;} else a.hidden=true;
  };
  setLink('phoneLink', b.phone, b.phone ? 'tel:'+b.phone.replace(/[^\d+]/g,'') : '');
  setLink('emailLink', b.email, b.email ? 'mailto:'+b.email : '');
  setLink('instagramLink', b.instagram ? 'Instagram' : '', b.instagram || '');
  setLink('facebookLink', b.facebook ? 'Facebook' : '', b.facebook || '');

  const accepting=SITE_CONFIG.ordering?.accepting_orders !== false;
  const submit=document.querySelector('.submit-button');
  if(submit){
    submit.disabled=!accepting;
    submit.textContent=accepting ? 'Review Order Request' : 'Orders Temporarily Closed';
  }
  const submitCard=document.querySelector('.submit-card');
  let closed=document.getElementById('closedOrderMessage');
  if(submitCard && !accepting){
    if(!closed){closed=document.createElement('p');closed.id='closedOrderMessage';closed.className='helper';submitCard.prepend(closed);}
    closed.textContent=SITE_CONFIG.ordering?.closed_message || 'We are currently at capacity for new orders.';
  } else if(closed) closed.remove();
}

function setText(selector, value){
  const el = document.querySelector(selector);
  if(el && value !== undefined && value !== null) el.textContent = value;
}

function priceLabel(value, suffix=''){
  return `$${Number(value).toLocaleString('en-US')}${suffix}`;
}

function applyPackageConfig(){
  const cards = [...document.querySelectorAll('.package-card')];
  for(const [name, cfg] of Object.entries(SITE_CONFIG.packages || {})){
    const radio = document.querySelector(`input[name="package"][value="${CSS.escape(name)}"]`);
    if(radio){
      radio.dataset.price = cfg.price;
      const small = radio.closest('label')?.querySelector('small');
      if(small) small.textContent = name === 'Showstopper' ? `${priceLabel(cfg.price,'+')} / quote` : priceLabel(cfg.price,'+');
    }
    const card = cards.find(c => c.querySelector('h3')?.textContent.trim() === name);
    if(card){
      const label=card.querySelector('.package-label'); if(label && cfg.label) label.textContent=cfg.label;
      const price=card.querySelector('.price'); if(price) price.textContent=priceLabel(cfg.price,'+');
      const desc=card.querySelector('p'); if(desc && cfg.description) desc.textContent=cfg.description;
    }
  }
}

function applySelectPrices(selectName, map){
  const sel = document.querySelector(`select[name="${selectName}"]`);
  if(!sel || !map) return;
  [...sel.options].forEach(opt => {
    if(Object.prototype.hasOwnProperty.call(map,opt.value)){
      const p=Number(map[opt.value]);
      opt.dataset.price=p;
      const base=opt.value;
      opt.textContent = p === 0 ? `${base} — Included` : `${base} — +${priceLabel(p)}`;
    }
  });
}

function applyAddonPrices(){
  const map=SITE_CONFIG.pricing?.addons || {};
  document.querySelectorAll('input[name="addons"]').forEach(input=>{
    if(Object.prototype.hasOwnProperty.call(map,input.value)){
      const p=Number(map[input.value]); input.dataset.price=p;
      const small=input.closest('label')?.querySelector('small');
      if(small){
        const description=small.textContent.split('•')[0].trim();
        small.textContent=`${description} • +${priceLabel(p)}`;
      }
    }
  });
}

function applyPolicies(){
  const grid=document.getElementById('policyGrid');
  if(!grid || !Array.isArray(SITE_CONFIG.policies)) return;
  grid.innerHTML=SITE_CONFIG.policies.map(p=>`<article><h3>${escapeHtml(p.title)}</h3><p>${escapeHtml(p.body)}</p></article>`).join('');
}

function applyRush(){
  const grid=document.getElementById('rushGrid');
  if(!grid || !Array.isArray(SITE_CONFIG.rush)) return;
  grid.innerHTML=SITE_CONFIG.rush.map(r=>`<div><strong>${escapeHtml(r.window)}</strong><span>${escapeHtml(r.fee)}</span></div>`).join('');
}

function applyGallery(){
  const section=document.getElementById('gallery');
  const grid=document.getElementById('galleryGrid');
  const items=SITE_CONFIG.gallery || [];
  if(!section || !grid) return;
  if(!items.length){ section.hidden=true; return; }
  section.hidden=false;
  grid.innerHTML=items.map(item=>`<figure><img src="${escapeAttr(item.image)}" alt="${escapeAttr(item.alt || 'Custom homecoming mum')}"><figcaption>${escapeHtml(item.caption || '')}</figcaption></figure>`).join('');
}

function escapeHtml(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
function escapeAttr(v=''){return escapeHtml(v);}

function applySiteConfig(){
  setText('#heroEyebrow',SITE_CONFIG.hero?.eyebrow);
  setText('#heroTitleBefore',SITE_CONFIG.hero?.title_before);
  setText('#heroTitleEmphasis',SITE_CONFIG.hero?.title_emphasis);
  setText('#heroBody',SITE_CONFIG.hero?.body);
  setText('#differenceHeading',SITE_CONFIG.difference?.heading);
  setText('#differenceBody',SITE_CONFIG.difference?.body);
  setText('#differenceTagline',SITE_CONFIG.difference?.tagline);
  setText('#seniorHeading',SITE_CONFIG.senior?.heading);
  setText('#seniorBody',SITE_CONFIG.senior?.body);
  setText('#footerText',SITE_CONFIG.footer_text);
    setText('#discountLabel',`Student promo (${SITE_CONFIG.referral.discount_percent}% off)`);
  const helper=document.querySelector('.promo-card .helper');
  if(helper) helper.textContent=`Have a code from one of our selected student representatives? Enter it here for ${SITE_CONFIG.referral.discount_percent}% off your mum order.`;
  document.title=`${SITE_CONFIG.business_name} | Custom Homecoming Mums`;
  applyPackageConfig();
  applySelectPrices('size',SITE_CONFIG.pricing?.sizes);
  applySelectPrices('length',SITE_CONFIG.pricing?.lengths);
  applySelectPrices('fullness',SITE_CONFIG.pricing?.fullness);
  applySelectPrices('braid',SITE_CONFIG.pricing?.braids);
  applySelectPrices('printedRibbon',SITE_CONFIG.pricing?.printed_ribbon);
  applyAddonPrices();
  applyPolicies();
  applyRush();
  applyGallery();
  applyOwnerControls();
  PROMO_CODES={};
  (SITE_CONFIG.referral?.codes || []).filter(x=>x.active!==false).forEach(x=>{
    PROMO_CODES[String(x.code).trim().toUpperCase()]={name:x.student,school:x.school};
  });
}

async function loadSiteConfig(){
  try{
    const res=await fetch('/content/site.json',{cache:'no-store'});
    if(!res.ok) throw new Error('Could not load site settings');
    SITE_CONFIG=await res.json();
  }catch(err){
    console.warn('Using fallback website settings:',err);
    SITE_CONFIG=FALLBACK_CONFIG;
  }
  applySiteConfig();
  calc();
}

const form = document.getElementById('mumForm');
const packageRadios = [...document.querySelectorAll('input[name="package"]')];
const addonChecks = [...document.querySelectorAll('input[name="addons"]')];
const pricedSelects = [...document.querySelectorAll('.priced-select')];

const packagePrice = document.getElementById('packagePrice');
const structurePrice = document.getElementById('structurePrice');
const addonPrice = document.getElementById('addonPrice');
const totalPrice = document.getElementById('totalPrice');
const payInFullPrice = document.getElementById('payInFullPrice');
const summaryPackage = document.getElementById('summaryPackage');
const preview = document.getElementById('summaryPreview');
const quoteNote = document.getElementById('quoteNote');
const discountRow = document.getElementById('discountRow');
const discountPrice = document.getElementById('discountPrice');
const referralNote = document.getElementById('referralNote');
const promoInput = document.getElementById('promoCode');
const promoMessage = document.getElementById('promoMessage');

function selectPrice(select){
  const opt = select.options[select.selectedIndex];
  return Number(opt.dataset.price || 0);
}
function money(n){
  return n.toLocaleString('en-US',{style:'currency',currency:'USD',minimumFractionDigits:Number.isInteger(n)?0:2});
}
function calc(){
  const pkg = document.querySelector('input[name="package"]:checked');
  const base = Number(pkg.dataset.price);
  const structure = pricedSelects
    .filter(s => ['size','length','fullness'].includes(s.name))
    .reduce((a,s)=>a+selectPrice(s),0);
  const specialty = pricedSelects
    .filter(s => ['braid','printedRibbon'].includes(s.name))
    .reduce((a,s)=>a+selectPrice(s),0);
  const addons = addonChecks.filter(a=>a.checked).reduce((sum,a)=>sum+Number(a.dataset.price),0);
  const extras = specialty + addons;
  const subtotal = base + structure + extras;
  const discount = activePromo ? subtotal * (SITE_CONFIG.referral.discount_percent / 100) : 0;
  const total = subtotal - discount;

  summaryPackage.textContent = `${pkg.value} Mum`;
  packagePrice.textContent = money(base);
  structurePrice.textContent = money(structure);
  addonPrice.textContent = money(extras);
  discountRow.hidden = !activePromo;
  discountPrice.textContent = `-${money(discount)}`;
  totalPrice.textContent = money(total);
  if(payInFullPrice) payInFullPrice.textContent = money(total);
  referralNote.hidden = !activePromo;
  referralNote.textContent = activePromo ? `Referral credited to ${activePromo.name}${activePromo.school ? ` • ${activePromo.school}` : ''} • Code ${activePromo.code}` : '';
  quoteNote.textContent = pkg.value === 'Showstopper'
    ? 'Showstopper pricing begins here. Final price requires a custom design quote before payment.'
    : 'Final price is confirmed after design review. Highly custom requests or special-order materials may affect pricing.';

  preview.style.setProperty('--preview-primary', form.elements.primaryColor.value);
  preview.style.setProperty('--preview-secondary', form.elements.secondaryColor.value);
  return {pkg,base,structure,extras,subtotal,discount,total};
}
[...packageRadios,...addonChecks,...pricedSelects].forEach(x=>x.addEventListener('change',calc));
form.elements.primaryColor.addEventListener('input',calc);
form.elements.secondaryColor.addEventListener('input',calc);

document.getElementById('applyPromo').addEventListener('click',()=>{
  const code = promoInput.value.trim().toUpperCase();
  const rep = PROMO_CODES[code];
  if(rep){
    activePromo = { ...rep, code };
    promoInput.value = code;
    promoMessage.textContent = `Code applied! ${SITE_CONFIG.referral.discount_percent}% off — referred by ${rep.name}.`;
    promoMessage.className = 'promo-message success';
  }else{
    activePromo = null;
    promoMessage.textContent = code ? 'That promo code is not recognized. Please double-check the code.' : 'Enter a promo code first.';
    promoMessage.className = 'promo-message error';
  }
  calc();
});
promoInput.addEventListener('input',()=>{
  if(activePromo && promoInput.value.trim().toUpperCase() !== activePromo.code){
    activePromo = null;
    promoMessage.textContent = 'Code changed — click Apply Code to verify it.';
    promoMessage.className = 'promo-message';
    calc();
  }
});
promoInput.addEventListener('keydown',e=>{
  if(e.key==='Enter'){e.preventDefault();document.getElementById('applyPromo').click();}
});

document.querySelectorAll('.select-package').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const r=packageRadios.find(x=>x.value===btn.dataset.package);
    r.checked=true;calc();document.getElementById('customize').scrollIntoView({behavior:'smooth'});
  });
});

function orderText(){
  const d=new FormData(form), c=calc();
  const add=addonChecks.filter(x=>x.checked).map(x=>`${x.value} (+$${x.dataset.price})`);
  const braid=form.elements.braid.options[form.elements.braid.selectedIndex].text;
  const printed=form.elements.printedRibbon.options[form.elements.printedRibbon.selectedIndex].text;
  const fileCount=form.elements.inspiration.files?.length || 0;
  return `HEART & SOUL SIGNATURE MUMS — ORDER REQUEST

TIER
${c.pkg.value} — starting at ${money(c.base)}

SIZE / STRUCTURE
Size: ${d.get('size')}
Length: ${d.get('length')}
Fullness: ${d.get('fullness')}

COLORS + STYLE
Primary: ${d.get('primaryColorName') || d.get('primaryColor')}
Secondary: ${d.get('secondaryColorName') || d.get('secondaryColor')}
Accent: ${d.get('accentColor') || '—'}
Style: ${d.get('style')}

STUDENT
Name: ${d.get('studentName')}
Nickname: ${d.get('nickname') || '—'}
School: ${d.get('school')}
Mascot: ${d.get('mascot') || '—'}
Grade: ${d.get('grade')}
Graduation year: ${d.get('gradYear') || '—'}
Jersey / player number: ${d.get('number') || '—'}
Homecoming date: ${d.get('homecomingDate')}

ACTIVITIES + PERSONAL
Sports / clubs / activities:
${d.get('activities') || '—'}

Favorite things: ${d.get('favorites') || '—'}
Favorite song: ${d.get('song') || '—'}
Bible verse / quote: ${d.get('quote') || '—'}
Special date / relationship detail: ${d.get('specialDate') || '—'}

PREMIUM UPGRADES
${add.length ? add.join('\n') : 'None selected'}
Specialty braid: ${braid}
Custom printed ribbon: ${printed}
Ribbon wording: ${d.get('ribbonText') || '—'}

CUSTOM VISION
${d.get('instructions') || '—'}

Inspiration photos selected: ${fileCount}

STUDENT REFERRAL
Promo code: ${activePromo ? activePromo.code : 'None'}
Referral student: ${activePromo ? activePromo.name : '—'}
School: ${activePromo ? activePromo.school : '—'}
Discount: ${activePromo ? money(c.discount) : '$0'}
Referral status: ${activePromo ? `Counts toward ${SITE_CONFIG.referral.reward_orders} qualifying orders only after payment. Reward: ${SITE_CONFIG.referral.reward_text}` : '—'}

CUSTOMER
Name: ${d.get('customerName')}
Phone: ${d.get('phone')}
Email: ${d.get('email')}
Preferred contact: ${d.get('contactMethod')}

SUBTOTAL: ${money(c.subtotal)}
PROMO DISCOUNT: ${activePromo ? '-' + money(c.discount) : '$0'}
ESTIMATED TOTAL: ${money(c.total)}
PAYMENT DUE IN FULL: ${money(c.total)}

Final design and pricing subject to review and approval.`;
}

const dialog=document.getElementById('orderDialog');
form.addEventListener('submit',e=>{
  e.preventDefault();
  document.getElementById('dialogSummary').textContent=orderText();
  dialog.showModal();
});
document.getElementById('closeDialog').addEventListener('click',()=>dialog.close());
document.getElementById('editOrder').addEventListener('click',()=>dialog.close());
document.getElementById('copyOrder')?.addEventListener('click',async()=>{
  try{
    await navigator.clipboard.writeText(orderText());
    const b=document.getElementById('copyOrder');
    if(!b) return;
    const old=b.textContent;
    b.textContent='Copied!';
    setTimeout(()=>b.textContent=old,1500);
  }catch(e){
    alert('Copy failed. You can select the order details manually.');
  }
});




function buildPrivateOrderPayload(orderNo,c){
  const d=new FormData(form);
  return {
    orderNumber:orderNo,
    botField:d.get('bot-field')||'',
    package:d.get('package'),
    size:d.get('size'),
    length:d.get('length'),
    fullness:d.get('fullness'),
    primaryColor:d.get('primaryColor'),
    primaryColorName:d.get('primaryColorName'),
    secondaryColor:d.get('secondaryColor'),
    secondaryColorName:d.get('secondaryColorName'),
    accentColor:d.get('accentColor'),
    style:d.get('style'),
    studentName:d.get('studentName'),
    nickname:d.get('nickname'),
    school:d.get('school'),
    mascot:d.get('mascot'),
    grade:d.get('grade'),
    gradYear:d.get('gradYear'),
    number:d.get('number'),
    homecomingDate:d.get('homecomingDate'),
    activities:d.get('activities'),
    favorites:d.get('favorites'),
    song:d.get('song'),
    quote:d.get('quote'),
    specialDate:d.get('specialDate'),
    addons:addonChecks.filter(x=>x.checked).map(x=>x.value),
    braid:d.get('braid'),
    printedRibbon:d.get('printedRibbon'),
    ribbonText:d.get('ribbonText'),
    instructions:d.get('instructions'),
    inspirationCount:form.elements.inspiration.files?.length||0,
    customerName:d.get('customerName'),
    phone:d.get('phone'),
    email:d.get('email'),
    contactMethod:d.get('contactMethod'),
    estimatedTotal:c.total,
    promoCodeApplied:activePromo?.code||'',
    referralStudent:activePromo?.name||'',
    referralSchool:activePromo?.school||''
  };
}
async function savePrivateOrder(orderNo,c){
  const response=await fetch('/.netlify/functions/save-order',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(buildPrivateOrderPayload(orderNo,c))
  });
  const data=await response.json().catch(()=>({}));
  if(!response.ok) throw new Error(data.error||'Private order save failed.');
  return data;
}

function realOrderNumber(){
  const d=new Date();
  const y=String(d.getFullYear()).slice(-2);
  const m=String(d.getMonth()+1).padStart(2,'0');
  const day=String(d.getDate()).padStart(2,'0');
  const rand=Math.floor(1000+Math.random()*9000);
  return `HS-${y}${m}${day}-${rand}`;
}

function encodeFormData(formData){
  return new URLSearchParams(formData).toString();
}

async function submitOrderToNetlify(){
  const submitBtn=document.getElementById('submitRealOrder');
  if(TEST_MODE){
    alert('Test mode never submits a real order. Use “Simulate Paid Test Order” instead.');
    return;
  }
  const c=calc();
  const orderNo=realOrderNumber();

  document.getElementById('orderSummaryField').value = orderText();
  document.getElementById('estimatedTotalField').value = c.total.toFixed(2);
  document.getElementById('promoCodeAppliedField').value = activePromo?.code || '';
  document.getElementById('referralStudentField').value = activePromo?.name || '';
  document.getElementById('referralSchoolField').value = activePromo?.school || '';

  const fd=new FormData(form);
  fd.append('orderNumber',orderNo);
  fd.append('submittedAt',new Date().toISOString());

  submitBtn.disabled=true;
  const old=submitBtn.textContent;
  submitBtn.textContent='Submitting…';

  try{
    const response=await fetch('/',{
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:encodeFormData(fd)
    });
    if(!response.ok) throw new Error('Submission failed');

    await savePrivateOrder(orderNo,c);

    document.getElementById('confirmationOrderNumber').textContent=orderNo;
    document.getElementById('confirmationTotal').textContent=money(c.total);
    dialog.close();
    document.getElementById('confirmationDialog').showModal();
  }catch(err){
    console.error(err);
    alert('The order could not be submitted. Please try again.');
  }finally{
    submitBtn.disabled=false;
    submitBtn.textContent=old;
  }
}

document.getElementById('submitRealOrder')?.addEventListener('click',submitOrderToNetlify);
document.getElementById('closeConfirmation')?.addEventListener('click',()=>document.getElementById('confirmationDialog').close());
document.getElementById('finishConfirmation')?.addEventListener('click',()=>{
  document.getElementById('confirmationDialog').close();
  form.reset();
  activePromo=null;
  calc();
  window.scrollTo({top:0,behavior:'smooth'});
});

const TEST_MODE = new URLSearchParams(window.location.search).get('test') === '1' || window.location.pathname.startsWith('/test');
const testModeBanner = document.getElementById('testModeBanner');
const simulatePaidOrderBtn = document.getElementById('simulatePaidOrder');
const testOrderDialog = document.getElementById('testOrderDialog');

if(TEST_MODE){
  if(testModeBanner) testModeBanner.hidden = false;
  if(simulatePaidOrderBtn) simulatePaidOrderBtn.hidden = false;
  const realSubmitBtn=document.getElementById('submitRealOrder');
  if(realSubmitBtn) realSubmitBtn.hidden=true;
}

function ownerField(label,value){
  const safeValue = value === null || value === undefined || String(value).trim()==='' ? '—' : String(value);
  return `<div class="owner-field"><span>${escapeHtml(label)}</span><strong>${escapeHtml(safeValue)}</strong></div>`;
}

function friendlyColor(name, hex){
  const n=(name || '').trim();
  if(n) return n;
  const common={
    '#ffffff':'White','#000000':'Black','#e64b7d':'Pink','#ff0000':'Red',
    '#0000ff':'Blue','#000080':'Navy','#800000':'Maroon','#008000':'Green',
    '#800080':'Purple','#ffd700':'Gold','#c0c0c0':'Silver','#ffa500':'Orange'
  };
  return common[String(hex || '').toLowerCase()] || String(hex || '—').toUpperCase();
}

function createTestOrderNumber(){
  const d=new Date();
  const stamp=[
    String(d.getMonth()+1).padStart(2,'0'),
    String(d.getDate()).padStart(2,'0'),
    String(d.getHours()).padStart(2,'0'),
    String(d.getMinutes()).padStart(2,'0')
  ].join('');
  return `TEST-${stamp}`;
}

function buildOwnerOrderView(){
  const d=new FormData(form), c=calc();
  const add=addonChecks.filter(x=>x.checked).map(x=>x.value);
  const braid=form.elements.braid.options[form.elements.braid.selectedIndex].text;
  const printed=form.elements.printedRibbon.options[form.elements.printedRibbon.selectedIndex].text;
  const primaryHex=d.get('primaryColor'), secondaryHex=d.get('secondaryColor');
  const primary=friendlyColor(d.get('primaryColorName'),primaryHex);
  const secondary=friendlyColor(d.get('secondaryColorName'),secondaryHex);
  const fileCount=form.elements.inspiration.files?.length || 0;

  document.getElementById('testOrderNumber').textContent=createTestOrderNumber();
  document.getElementById('testOrderTime').textContent=new Date().toLocaleString();

  document.getElementById('ownerStudent').innerHTML =
    ownerField('Student',d.get('studentName'))+
    ownerField('Nickname',d.get('nickname'))+
    ownerField('School',d.get('school'))+
    ownerField('Mascot',d.get('mascot'))+
    ownerField('Grade',d.get('grade'))+
    ownerField('Graduation year',d.get('gradYear'))+
    ownerField('Jersey / player #',d.get('number'))+
    ownerField('Homecoming date',d.get('homecomingDate'));

  document.getElementById('ownerBuild').innerHTML =
    ownerField('Tier',`${c.pkg.value} • starts at ${money(c.base)}`)+
    ownerField('Size',d.get('size'))+
    ownerField('Length',d.get('length'))+
    ownerField('Fullness',d.get('fullness'));

  document.getElementById('ownerColors').innerHTML = `
    <div class="color-chip"><span class="color-swatch" style="background:${escapeAttr(primaryHex)}"></span>Primary: ${escapeHtml(primary)} <small>${escapeHtml(primaryHex)}</small></div>
    <div class="color-chip"><span class="color-swatch" style="background:${escapeAttr(secondaryHex)}"></span>Secondary: ${escapeHtml(secondary)} <small>${escapeHtml(secondaryHex)}</small></div>
    <div class="color-chip">Accent: ${escapeHtml(d.get('accentColor') || 'None')}</div>
    <div class="color-chip">Style: ${escapeHtml(d.get('style') || '—')}</div>`;

  document.getElementById('ownerPersonal').textContent =
`Sports / clubs / activities:
${d.get('activities') || '—'}

Favorite things: ${d.get('favorites') || '—'}
Favorite song: ${d.get('song') || '—'}
Bible verse / quote: ${d.get('quote') || '—'}
Special date / relationship detail: ${d.get('specialDate') || '—'}`;

  document.getElementById('ownerUpgrades').textContent =
`Premium packages:
${add.length ? '• '+add.join('\n• ') : 'None selected'}

Specialty braid: ${braid}
Custom printed ribbon: ${printed}
Printed ribbon wording: ${d.get('ribbonText') || '—'}
Inspiration photos selected: ${fileCount}`;

  document.getElementById('ownerInstructions').textContent=d.get('instructions') || 'No additional instructions provided.';

  document.getElementById('ownerSubtotal').textContent=money(c.subtotal);
  document.getElementById('ownerDiscount').textContent='-'+money(c.discount);
  document.getElementById('ownerDiscountRow').hidden=!activePromo;
  document.getElementById('ownerTotal').textContent=money(c.total);
  document.getElementById('ownerPaid').textContent=money(c.total);

  document.getElementById('ownerCustomer').textContent =
`Name: ${d.get('customerName') || '—'}
Phone: ${d.get('phone') || '—'}
Email: ${d.get('email') || '—'}
Preferred contact: ${d.get('contactMethod') || '—'}`;

  const referralCard=document.getElementById('ownerReferralCard');
  if(activePromo){
    referralCard.hidden=false;
    document.getElementById('ownerReferral').textContent =
`Code: ${activePromo.code}
Student: ${activePromo.name}
School: ${activePromo.school || '—'}
Customer discount: ${SITE_CONFIG.referral.discount_percent}%
Referral credit: TEST ONLY — not counted`;
  }else{
    referralCard.hidden=true;
  }
}

function ownerOrderText(){
  const d=new FormData(form), c=calc();
  return `HEART & SOUL SIGNATURE MUMS
TEST ORDER — PAYMENT SIMULATED

${orderText()}

PAYMENT STATUS
PAID IN FULL — TEST
Amount paid: ${money(c.total)}
Balance due: $0.00

This test order was not submitted, stored, charged, emailed, or counted as a referral.`;
}

if(simulatePaidOrderBtn){
  simulatePaidOrderBtn.addEventListener('click',()=>{
    buildOwnerOrderView();
    dialog.close();
    testOrderDialog.showModal();
  });
}
document.getElementById('closeTestOrder')?.addEventListener('click',()=>testOrderDialog.close());
document.getElementById('closeOwnerView')?.addEventListener('click',()=>testOrderDialog.close());
document.getElementById('copyOwnerOrder')?.addEventListener('click',async()=>{
  try{
    await navigator.clipboard.writeText(ownerOrderText());
    const b=document.getElementById('copyOwnerOrder'), old=b.textContent;
    b.textContent='Copied!';
    setTimeout(()=>b.textContent=old,1500);
  }catch(e){
    alert('Copy failed. You can still review the test order on screen.');
  }
});

loadSiteConfig();
