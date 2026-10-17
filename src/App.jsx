import { useEffect, useMemo, useState } from "react";
import catalog from "./data/products.json";
import "../css/style.css";

const fmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const products = catalog.products;
const img = (p) => "/" + String(p || "").replace(/^\/+/, "");
const product = (id) => products.find((p) => p.id === id);
const route = () => {
  const [path, qs = ""] = location.hash.replace(/^#\/?/, "").split("?");
  const [page, id] = path.startsWith("product/") ? ["product", path.split("/")[1]] : [path || "home", null];
  return { page, id, params: new URLSearchParams(qs) };
};
const go = (path = "") => { location.hash = "/" + path; window.scrollTo({ top: 0, behavior: "smooth" }); };

function I({ children = "→" }) { return <span className="arrow" aria-hidden="true">{children}</span>; }

function Header({ count, search, cart }) {
  const [menu, setMenu] = useState(false);
  return <>
    <div className="announcement">CONSIDERED ESSENTIALS <b>✳</b> MADE FOR EVERYDAY MOVEMENT</div>
    <header className="header">
      <button className="hamb" onClick={() => setMenu(!menu)} aria-label="Toggle menu">{menu ? "×" : "☰"}</button>
      <a className="logo" href="#/">LEORÉ<span>®</span></a>
      <nav className="nav"><a href="#/shop">Shop</a><a href="#/shop?sort=new">New arrivals</a><a href="#/about">Our story</a><a href="#/faq">Help</a></nav>
      <div className="actions"><button aria-label="Search" onClick={search}>⌕</button><button aria-label="Shopping bag" onClick={cart}>Bag <b>{count}</b></button></div>
    </header>
    {menu && <nav className="mobile-nav">{[["Shop","shop"],["New arrivals","shop?sort=new"],["Our story","about"],["FAQs","faq"],["Shipping & returns","shipping"],["Contact","contact"]].map(([t,p])=><a key={t} href={`#/${p}`} onClick={()=>setMenu(false)}>{t}<I/></a>)}</nav>}
  </>;
}

function Footer() {
  return <footer className="footer"><div className="footer-grid"><div><a className="logo" href="#/">LEORÉ<span>®</span></a><p>Considered essentials.<br/>Made to move with you.</p><small>THE EVERYDAY UNIFORM.</small></div><div><h4>EXPLORE</h4><a href="#/shop">Shop all</a><a href="#/about">Our story</a><a href="#/shop?category=Hoodies">Hoodies</a></div><div><h4>NEED HELP?</h4><a href="#/faq">FAQs</a><a href="#/shipping">Shipping & returns</a><a href="#/contact">Contact us</a></div><div><h4>THE LEORÉ LETTER</h4><p>New drops and notes from our world.</p><Newsletter compact/></div></div><div className="footer-bottom"><span>© 2026 LEORÉ. ALL RIGHTS RESERVED.</span><span>DESIGNED WITH INTENTION.</span></div></footer>;
}

function Newsletter({ compact = false }) {
  const [email,setEmail] = useState(""); const [done,setDone] = useState(false);
  return done ? <p className="success">Thanks for joining. (Demo only — not sent.)</p> : <form className={`newsletter ${compact?"compact":""}`} onSubmit={e=>{e.preventDefault();setDone(true);}}><input aria-label="Email address" type="email" required placeholder="Your email address" value={email} onChange={e=>setEmail(e.target.value)}/><button aria-label="Subscribe">→</button></form>;
}

function Card({ p, quick }) {
  return <article className="card"><div className="card-image"><a href={`#/product/${p.id}`}><img src={img(p.image)} alt={p.imageAlt || p.name} loading="lazy"/></a>{p.tag && <span className="tag">{p.tag}</span>}<button className="quick" onClick={()=>quick(p)}>{p.inStock?"QUICK ADD +":"VIEW DETAILS"}</button></div><div className="card-meta"><div><a className="pname" href={`#/product/${p.id}`}>{p.name}</a><small>{p.category}</small></div><span>{fmt.format(p.price)}</span></div></article>;
}
function Grid({ items, quick }) { return items.length ? <div className="grid">{items.map(p=><Card key={p.id} p={p} quick={quick}/>)}</div> : <div className="empty"><h3>No pieces found.</h3><button className="btn outline" onClick={()=>go("shop")}>Explore all products →</button></div>; }

function Home({ quick }) {
  const featured = products.filter(p=>p.inStock).slice(0,4);
  return <main>
    <section className="hero"><img src={img(catalog.heroImage)} alt="LEORÉ campaign editorial" /><div className="hero-overlay"/><div className="hero-copy"><p className="eyebrow gold">THE EVERYDAY UNIFORM — 001</p><h1>Less noise.<br/><em>More presence.</em></h1><p>Considered silhouettes. Tactile fabrics. Essentials designed to become part of your everyday.</p><div className="hero-buttons"><a className="btn light" href="#/shop">SHOP THE COLLECTION <I/></a><a className="underlink" href="#/about">Discover LEORÉ</a></div></div><span className="hero-index">01 / THE NEW UNIFORM</span></section>
    <div className="ticker">BUILT FOR THE EVERYDAY <b>✳</b> CONSIDERED BY DESIGN <b>✳</b> MADE TO MOVE WITH YOU <b>✳</b></div>
    <section className="section"><div className="section-title"><div><p className="eyebrow">THE ROTATION STARTS HERE</p><h2>Everyday, <em>elevated.</em></h2></div><a className="underlink" href="#/shop">SHOP ALL →</a></div><Grid items={featured} quick={quick}/></section>
    <section className="story"><div className="story-photo"><img src={img(product("signature-hoodie")?.image)} alt="Signature hoodie"/></div><div className="story-copy"><p className="eyebrow gold">A STUDY IN SIMPLICITY</p><h2>Good design<br/>doesn't ask<br/><em>for attention.</em></h2><p>It earns a place in your everyday. LEORÉ is built around thoughtful proportions, tactile materials and comfort you'll return to.</p><a className="btn light" href="#/about">OUR APPROACH <I/></a></div></section>
    <section className="section"><div className="section-title"><div><p className="eyebrow">FIND YOUR FORM</p><h2>Made for <em>your rotation.</em></h2></div><p className="muted">The pieces you'll reach for, again and again.</p></div><div className="tiles">{[["Hoodies","signature-hoodie","Hoodies"],["Outerwear","trench-coat","Outerwear"],["Bottoms","cargo-pants","Pants"]].map(([title,id,cat],i)=><a className="tile" href={`#/shop?category=${cat}`} key={id}><img src={img(product(id)?.image)} alt={title}/><span>0{i+1} / {title.toUpperCase()}</span><b>{["Comfort, considered","Layer with intent","Grounded essentials"][i]} <I/></b></a>)}</div></section>
    <section className="newsletter-panel"><p className="eyebrow gold">A LITTLE SOMETHING, OCCASIONALLY</p><h2>Stay in the <em>know.</em></h2><p>First looks, new drops and notes from the LEORÉ world.</p><Newsletter/></section>
  </main>;
}

function Shop({ quick, params }) {
  const [cat,setCat] = useState(params.get("category")||"All");
  const [sort,setSort] = useState(params.get("sort")||"featured");
  const cats = ["All",...new Set(products.map(p=>p.category))];
  const items = useMemo(()=>{let a=cat==="All"?[...products]:products.filter(p=>p.category===cat);if(sort==="price-low")a.sort((x,y)=>x.price-y.price);if(sort==="price-high")a.sort((x,y)=>y.price-x.price);if(sort==="name")a.sort((x,y)=>x.name.localeCompare(y.name));if(sort==="new")a.reverse();return a;},[cat,sort]);
  return <main><div className="page-intro"><p className="eyebrow">THE LEORÉ COLLECTION</p><h1>Pieces for <em>every day.</em></h1><p>Thoughtful essentials. Distinct by design.</p></div><div className="toolbar"><div className="filters">{cats.map(c=><button key={c} className={cat===c?"active":""} onClick={()=>setCat(c)}>{c}</button>)}</div><label>{items.length} PIECES <select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="new">New arrivals</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name</option></select></label></div><section className="section shop-grid"><Grid items={items} quick={quick}/></section></main>;
}

function ProductPage({ id, add, quick }) {
  const p = product(id)||products[0]; const [size,setSize]=useState(""); const [guide,setGuide]=useState(false); const [notice,setNotice]=useState("");
  const related=products.filter(x=>x.id!==p.id&&x.category===p.category).slice(0,3);
  return <main><div className="crumb"><a href="#/">Home</a> / <a href="#/shop">Shop</a> / {p.name}</div><section className="detail"><div><div className="detail-image"><img src={img(p.image)} alt={p.imageAlt||p.name}/><span>LEORÉ / OBJECT 001</span></div><p className="image-caption">Considered fabric. Thoughtful construction. Designed to live in.</p></div><div className="detail-copy"><p className="eyebrow gold">{p.tag||"THE COLLECTION"}</p><h1>{p.name}</h1><p className="detail-price">{fmt.format(p.price)} <small>INCL. OF TAXES</small></p><p className="muted description">{p.details}</p><hr/><div className="size-row"><span className="eyebrow">SELECT SIZE</span><button className="underlink" onClick={()=>setGuide(!guide)}>SIZE GUIDE ↗</button></div>{guide&&<div className="guide"><b>Find your fit</b><p>Choose your usual size for a regular fit. Size guidance is illustrative; confirm garment measurements before launch.</p></div>}<div className="sizes">{(p.sizes||["S","M","L","XL"]).map(s=><button key={s} className={size===s?"selected":""} onClick={()=>{setSize(s);setNotice("");}}>{s}</button>)}</div><button disabled={!p.inStock} className="btn gold-btn wide" onClick={()=>{if(!size){setNotice("Please select a size first.");return;}add(p.id,size);setNotice("Added to your bag.");}}>{p.inStock?"ADD TO BAG":"CURRENTLY UNAVAILABLE"} <I/></button>{notice&&<p className="success">{notice}</p>}<div className="delivery"><p>↗ Shipping & delivery information <a href="#/shipping">Learn more</a></p><details><summary>PRODUCT DETAILS <I>⌄</I></summary><p>{p.details}</p></details><details><summary>SHIPPING & RETURNS <I>⌄</I></summary><p>Read the <a href="#/shipping">shipping and returns information</a>. Final policy details must be confirmed before launch.</p></details></div></div></section>{related.length>0&&<section className="section"><div className="section-title"><div><p className="eyebrow">KEEP EXPLORING</p><h2>Goes well <em>with.</em></h2></div><a className="underlink" href="#/shop">VIEW ALL →</a></div><Grid items={related} quick={quick}/></section>}</main>;
}

function CartLines({ cart, qty, remove, close }) {
  const subtotal=cart.reduce((s,l)=>s+(product(l.id)?.price||0)*l.qty,0);
  if(!cart.length)return <div className="empty bag-empty"><div className="bag-icon">⌑</div><h3>Your bag is taking a breather.</h3><p>Find something you'll want to live in.</p><button className="btn gold-btn" onClick={()=>{close?.();go("shop");}}>EXPLORE THE COLLECTION →</button></div>;
  return <><div className="cart-lines">{cart.map(l=>{const p=product(l.id);if(!p)return null;return <div className="cart-line" key={l.id+l.size}><a href={`#/product/${p.id}`} onClick={close}><img src={img(p.image)} alt={p.name}/></a><div><a className="pname" href={`#/product/${p.id}`} onClick={close}>{p.name}</a><p>Size: {l.size}</p><div className="qty"><button onClick={()=>qty(l.id,l.size,-1)}>-</button><span>{l.qty}</span><button onClick={()=>qty(l.id,l.size,1)}>+</button></div></div><div className="line-end"><span>{fmt.format(p.price*l.qty)}</span><button onClick={()=>remove(l.id,l.size)}>Remove</button></div></div>;})}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{fmt.format(subtotal)}</strong></div><p>Shipping and applicable discounts are calculated at checkout.</p>{close && <button className="btn outline wide view-bag" onClick={()=>{close();go("cart");}}>VIEW BAG DETAILS <I/></button>}<button className="btn gold-btn wide" onClick={()=>go("checkout")}>CONTINUE TO CHECKOUT <I/></button><small>Prototype only — payments are not connected.</small></div></>;
}
function CartPage({ cart, qty, remove }) { return <main><div className="page-intro"><p className="eyebrow">ALMOST YOURS</p><h1>Your <em>bag.</em></h1><p>Take another look at your selection.</p></div><div className="cart-page"><CartLines cart={cart} qty={qty} remove={remove}/><a className="underlink" href="#/shop">← CONTINUE SHOPPING</a></div></main>; }

function Drawer({ cart, qty, remove, close }) { return <div className="scrim" onMouseDown={e=>{if(e.target===e.currentTarget)close();}}><aside className="drawer"><div className="drawer-head"><div><p className="eyebrow">YOUR SELECTION</p><h2>Your bag <small>({cart.reduce((n,l)=>n+l.qty,0)})</small></h2></div><button onClick={close}>×</button></div><CartLines cart={cart} qty={qty} remove={remove} close={close}/></aside></div>; }

function Search({ close, quick }) {
  const [q,setQ]=useState("");const matches=q.trim()?products.filter(p=>(p.name+" "+p.category+" "+p.details).toLowerCase().includes(q.toLowerCase())):products.slice(0,4);
  return <div className="scrim search-scrim" onMouseDown={e=>{if(e.target===e.currentTarget)close();}}><section className="search-box"><div className="drawer-head"><p className="eyebrow">FIND YOUR EVERYDAY</p><button onClick={close}>×</button></div><input autoFocus placeholder="Search products, categories..." value={q} onChange={e=>setQ(e.target.value)}/><p className="eyebrow">{q?`${matches.length} RESULTS`:"A FEW PLACES TO START"}</p>{matches.length?matches.map(p=><div className="search-line" key={p.id}><a href={`#/product/${p.id}`} onClick={close}><img src={img(p.image)} alt={p.name}/></a><div><a className="pname" href={`#/product/${p.id}`} onClick={close}>{p.name}</a><p>{p.category} · {fmt.format(p.price)}</p></div><button className="underlink" onClick={()=>{close();quick(p);}}>QUICK ADD</button></div>):<p className="muted">No matches. Try another search.</p>}</section></div>;
}
function Quick({ p, close, add }) {
  const [size,setSize]=useState("");
  return <div className="scrim" onMouseDown={e=>{if(e.target===e.currentTarget)close();}}><section className="quick-box"><button className="x" onClick={close}>×</button><img src={img(p.image)} alt={p.name}/><div><p className="eyebrow gold">{p.tag}</p><h2>{p.name}</h2><p>{fmt.format(p.price)}</p><p className="muted">{p.details}</p><span className="eyebrow">SELECT SIZE</span><div className="sizes">{(p.sizes||[]).map(s=><button key={s} className={size===s?"selected":""} onClick={()=>setSize(s)}>{s}</button>)}</div><button disabled={!p.inStock} className="btn gold-btn wide" onClick={()=>{if(size){add(p.id,size);close();}}}>{!p.inStock?"SOLD OUT":size?"ADD TO BAG":"SELECT A SIZE →"}</button><a className="underlink" href={`#/product/${p.id}`} onClick={close}>VIEW PRODUCT DETAILS →</a></div></section></div>;
}

const faqs=[
["How do I choose the right size?","Use the sizes listed on each product page. A garment-specific size guide can be added once measurements are confirmed."],
["How can I track my order?","Order tracking will be available once the live order and shipping integrations are connected. This prototype does not create real orders."],
["What is the shipping timeline?","Shipping rates, pin-code coverage and delivery estimates must be confirmed in the final store policy before checkout is enabled."],
["Can I return or exchange an item?","Return windows and eligibility depend on the final published policy. Please confirm the policy before launch."],
["Are payments enabled?","No. This prototype does not collect payments or create confirmed orders."],
["How do I contact LEORÉ?","Use the contact page to preview a message. The form does not send messages until a support service is connected."]
];
function Info({ page }) {
  const [sent,setSent]=useState(false);
  if(page==="about")return <main><section className="editorial"><p className="eyebrow gold">THE LEORÉ POINT OF VIEW</p><h1>Quiet confidence.<br/><em>Everyday form.</em></h1><p>Pieces you wear most should be the ones you think about least — considered in every detail, effortless in every moment.</p></section><section className="about"><img src={img(catalog.heroImage)} alt="LEORÉ campaign"/><div><p className="eyebrow">OUR APPROACH</p><h2>Less, but <em>better.</em></h2><p>LEORÉ is a study in modern essentials: balanced silhouettes, tactile materials and a restrained point of view. We design around the everyday, where comfort and character should never compete.</p><p>Intentional design. Everyday confidence. No unnecessary noise.</p><a className="btn gold-btn" href="#/shop">EXPLORE THE COLLECTION →</a></div></section><section className="manifesto"><p className="eyebrow gold">OUR MANIFESTO</p><h2>Wear what feels <em>like you.</em></h2></section></main>;
  if(page==="faq")return <main><div className="page-intro"><p className="eyebrow">HERE TO HELP</p><h1>Frequently <em>asked.</em></h1><p>Useful answers for your LEORÉ journey.</p></div><section className="info-layout"><div><p className="eyebrow">SUPPORT / 001</p><h2>Good to <em>know.</em></h2><p className="muted">Can't find what you're looking for?</p><a className="underlink" href="#/contact">CONTACT US →</a></div><div className="faqs">{faqs.map(([q,a])=><details key={q}><summary>{q}<I>＋</I></summary><p>{a}</p></details>)}</div></section></main>;
  if(page==="shipping")return <main><div className="page-intro"><p className="eyebrow">THE PRACTICAL DETAILS</p><h1>Shipping <em>& returns.</em></h1><p>Clear information, without the fine-print feeling.</p></div><section className="policies">{[["01","Shipping","Rates, delivery estimates, serviceable pin codes and dispatch timelines will be confirmed before launch. This prototype does not create shipments."],["02","Returns & exchanges","Return windows, item eligibility and exchange availability must be set in the final policy. No return request is submitted here."],["03","Need a hand?","Have a question about a product? Our contact page is ready for your message."]].map(([n,t,d])=><article key={n}><span>{n}</span><h2>{t}</h2><p>{d}</p>{n==="03"&&<a className="underlink" href="#/contact">CONTACT LEORÉ →</a>}</article>)}</section><p className="disclaimer">Prototype policy content — confirm the final commercial terms before publishing to customers.</p></main>;
  if(page==="contact")return <main><div className="page-intro"><p className="eyebrow">WE'RE LISTENING</p><h1>Let's <em>talk.</em></h1><p>Questions, feedback or just want to say hello?</p></div><section className="contact"><div><p className="eyebrow gold">CONTACT / 001</p><h2>Every good conversation <em>starts somewhere.</em></h2><p className="muted">This demo form validates locally. Add your official support email and connect a form service before launch.</p></div>{sent?<div className="confirm"><h2>Thank you.</h2><p>Your message passed local validation, but was not sent or stored.</p><button className="btn outline" onClick={()=>setSent(false)}>WRITE ANOTHER</button></div>:<form onSubmit={e=>{e.preventDefault();setSent(true);}}><label>Your name<input required placeholder="Name"/></label><label>Email address<input required type="email" placeholder="you@example.com"/></label><label>What's this about?<select><option>Product enquiry</option><option>Order support</option><option>Shipping & returns</option><option>Collaboration</option><option>Other</option></select></label><label>Your message<textarea required rows="5" placeholder="Tell us a little more..."/></label><button className="btn gold-btn wide">PREVIEW MESSAGE →</button></form>}</section></main>;
  return <main><div className="page-intro"><p className="eyebrow">CHECKOUT PREVIEW</p><h1>One step <em>closer.</em></h1><p>This static prototype does not take payments or create orders.</p></div><section className="checkout-placeholder"><h2>Checkout isn't connected yet.</h2><p className="muted">Payments, customer details, order records, invoices and shipping integrations will be added in a later phase.</p><button className="btn gold-btn" onClick={()=>go("cart")}>RETURN TO YOUR BAG →</button></section></main>;
}

export default function App() {
  const [r,setR]=useState(route);
  const [cart,setCart]=useState(()=>{try{return JSON.parse(localStorage.getItem("leore_cart_v2"))||[];}catch{return [];}});
  const [searching,setSearching]=useState(false),[drawer,setDrawer]=useState(false),[quickP,setQuickP]=useState(null),[toast,setToast]=useState("");
  useEffect(()=>{const sync=()=>{setR(route());setDrawer(false);setQuickP(null);setSearching(false);};window.addEventListener("hashchange",sync);return()=>window.removeEventListener("hashchange",sync);},[]);
  useEffect(()=>{try{localStorage.setItem("leore_cart_v2",JSON.stringify(cart));}catch{}},[cart]);
  useEffect(()=>{const esc=e=>{if(e.key==="Escape"){setSearching(false);setDrawer(false);setQuickP(null);}};window.addEventListener("keydown",esc);return()=>window.removeEventListener("keydown",esc);},[]);
  useEffect(()=>{document.body.style.overflow=searching||drawer||quickP?"hidden":"";return()=>{document.body.style.overflow="";};},[searching,drawer,quickP]);
  const add=(id,size)=>{setCart(c=>{const old=c.find(x=>x.id===id&&x.size===size);return old?c.map(x=>x===old?{...x,qty:x.qty+1}:x):[...c,{id,size,qty:1}];});setToast("Added to your bag");setTimeout(()=>setToast(""),2200);};
  const qty=(id,size,d)=>setCart(c=>c.map(x=>x.id===id&&x.size===size?{...x,qty:x.qty+d}:x).filter(x=>x.qty>0));
  const remove=(id,size)=>setCart(c=>c.filter(x=>!(x.id===id&&x.size===size)));
  const quick=p=>p.inStock?setQuickP(p):go(`product/${p.id}`);
  let view;
  if(r.page==="shop")view=<Shop quick={quick} params={r.params}/>;
  else if(r.page==="product")view=<ProductPage id={r.id} add={add} quick={quick}/>;
  else if(r.page==="cart")view=<CartPage cart={cart} qty={qty} remove={remove}/>;
  else if(["about","faq","shipping","contact","checkout"].includes(r.page))view=<Info page={r.page}/>;
  else view=<Home quick={quick}/>;
  return <><Header count={cart.reduce((n,x)=>n+x.qty,0)} search={()=>setSearching(true)} cart={()=>setDrawer(true)}/>{view}<Footer/>{drawer&&<Drawer cart={cart} qty={qty} remove={remove} close={()=>setDrawer(false)}/ >}{searching&&<Search close={()=>setSearching(false)} quick={quick}/ >}{quickP&&<Quick p={quickP} close={()=>setQuickP(null)} add={add}/ >}{toast&&<div className="toast">{toast}</div>}</>;
}
