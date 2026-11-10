"use client";

import { useEffect, useRef, useState } from "react";
import { categories, products, type Category, type Product } from "@/lib/products";

const instagram = "https://www.instagram.com/kanasu_gari/";
const palettes = [{ name: "Dusty rose", hex: "#ca8e98" }, { name: "Sage green", hex: "#a8b89a" }, { name: "Sunflower", hex: "#e8b84b" }, { name: "Warm cream", hex: "#f2e6d0" }, { name: "Lilac", hex: "#b6a1c6" }];

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{name === "heart" ? <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" /> : name === "arrow" ? <path d="M5 12h14m-6-6 6 6-6 6" /> : name === "close" ? <path d="m6 6 12 12M6 18 18 6" /> : name === "bag" ? <><path d="M5 7h14l1 14H4L5 7Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/></> : name === "menu" ? <path d="M4 7h16M4 12h16M4 17h16"/> : name === "plus" ? <path d="M12 5v14M5 12h14"/> : name === "check" ? <path d="m5 12 4 4L19 6"/> : name === "play" ? <path d="m9 5 11 7-11 7V5Z"/> : <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></>}</svg>;
}

function Yarn({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 72 64" fill="none" aria-hidden="true"><circle cx="30" cy="29" r="22" stroke="currentColor" strokeWidth="1.4"/><path d="M12 16c19 1 31 11 37 24M9 24c17 0 29 11 35 23M11 34c10 1 18 7 23 17M21 9c3 14 12 24 27 29M29 7c2 11 9 19 21 24M12 41c13-17 24-24 37-22M18 48C31 31 39 27 51 27M47 44c15-1 5 18 22 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
}

function Flower({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 100 100" aria-hidden="true"><g fill="currentColor">{Array.from({length:8},(_,i)=><ellipse key={i} cx="50" cy="25" rx="11" ry="22" transform={`rotate(${i*45} 50 50)`}/>)}</g><circle cx="50" cy="50" r="14" fill="#e8b84b"/></svg>;
}

function ProductMedia({ product, className = "" }: { product: Product; className?: string }) {
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  return <div className={`product-media ${className}`} style={{ background: product.color }} onMouseEnter={()=>{if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches)setPlaying(true);}} onMouseLeave={()=>{setPlaying(false);setLoaded(false);}}>
    {imageFailed ? <div className={`product-illustration illustration-${product.id}`}><img src="/images/hero-crochet.webp" alt="Illustrative crochet still life"/><span>Collection inspiration</span></div> : <img src={product.image} alt={product.name} loading="lazy" draggable={false} onError={()=>setImageFailed(true)}/>}
    {playing&&!failed&&!["sunflower","daisy"].includes(product.id)&&<video className="hover-video" style={{opacity:loaded?1:0}} src={`/media/${product.id}.mp4`} muted loop playsInline preload="none" onError={()=>setFailed(true)} onLoadedData={e=>{setLoaded(true);void e.currentTarget.play().catch(()=>{});}} aria-hidden="true"/>}
  </div>;
}

export default function Home() {
  const [category, setCategory] = useState<Category>("All creations");
  const [saved, setSaved] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [menu, setMenu] = useState(false);
  const [color, setColor] = useState(palettes[0]);
  const [customType, setCustomType] = useState("A flower or bouquet");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState("");
  const [ready, setReady] = useState(false);
  const [shelfIndex, setShelfIndex] = useState(2);
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{x:number;scroll:number;moved:boolean}|null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(()=>{try{const value=JSON.parse(localStorage.getItem("kanasu-favorites") || "[]");if(Array.isArray(value))setSaved(value.filter((v:unknown):v is string=>typeof v==="string"));}catch{}setReady(true);},[]);
  useEffect(()=>{if(ready)localStorage.setItem("kanasu-favorites",JSON.stringify(saved));},[saved,ready]);
  useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(""),2600);return()=>clearTimeout(t);},[toast]);
  useEffect(()=>{
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("revealed");observer.unobserve(entry.target);}}),{threshold:.08});
    document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));return()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    if(!selected)return;
    lastFocus.current=document.activeElement as HTMLElement;
    const old=document.body.style.overflow;document.body.style.overflow="hidden";closeRef.current?.focus();
    const key=(e:KeyboardEvent)=>{if(e.key==="Escape")setSelected(null);if(e.key==="Tab"){
      const items=Array.from(document.querySelectorAll<HTMLElement>(".product-dialog button, .product-dialog a[href]"));const first=items[0],last=items[items.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
    }};window.addEventListener("keydown",key);return()=>{document.body.style.overflow=old;window.removeEventListener("keydown",key);lastFocus.current?.focus();};
  },[selected]);
  const toggleSaved=(id:string)=>setSaved(current=>current.includes(id)?current.filter(v=>v!==id):[...current,id]);
  const shown=products.filter(p=>(category==="All creations"||p.category===category)&&(!savedOnly||saved.includes(p.id)));
  const enquire=(p:Product)=>{setCustomType(p.name);setSelected(null);setTimeout(()=>document.getElementById("custom")?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"}),30);};
  const enquiry=`Hello Kanasu Gari! I'd love to enquire about ${customType.toLowerCase()}. My preferred color is ${color.name.toLowerCase()}.${message?`\n\n${message}`:""}\n\nCould you share the customization options, price and making time?`;
  const copyEnquiry=async()=>{try{await navigator.clipboard.writeText(enquiry);setCopied(true);setTimeout(()=>setCopied(false),3000);}catch{setToast("Please select and copy the enquiry text below.");}};

  return <>
    <a href="#main" className="skip-link">Skip to content</a>
    <div className="announcement">A little yarn. A little imagination. A whole lot of love. <span>✳</span> Handmade by Kanasu Gari</div>
    <header className="site-header">
      <a href="#" className="brand" aria-label="Kanasu Gari home"><Yarn/><span>Kanasu Gari<small>A LITTLE WORLD OF YARN</small></span></a>
      <nav className={menu?"nav open":"nav"} aria-label="Main navigation">
        <a href="#collections" onClick={()=>setMenu(false)}>The collections</a><a href="#creations" onClick={()=>setMenu(false)}>Little joys</a><a href="#story" onClick={()=>setMenu(false)}>Our world</a>
      </nav>
      <div className="nav-actions"><button className={`icon-button favorites-button ${savedOnly?"active":""}`} aria-label={`Show ${saved.length} saved creations`} onClick={()=>{setSavedOnly(v=>!v);document.getElementById("creations")?.scrollIntoView({behavior:"smooth"});}}><Icon name="heart"/><span>{saved.length}</span></button><a className="button small" href="#custom">Made for you <Icon name="arrow" size={16}/></a><button className="icon-button mobile-menu" aria-label="Toggle navigation" aria-expanded={menu} onClick={()=>setMenu(v=>!v)}><Icon name={menu?"close":"menu"}/></button></div>
    </header>
    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <span className="eyebrow"><i/> SMALL BATCH. BIG HEART.</span>
          <h1 id="hero-title">Little joys,<br/><em>handmade.</em><Flower className="title-flower"/></h1>
          <p>For thoughtful gifts, cozy corners, and the little things that make you smile. Welcome to our world of crochet.</p>
          <div className="hero-buttons"><a className="button" href="#creations">Find your little joy <span className="button-circle"><Icon name="arrow"/></span></a><a className="text-link" href="#custom">Dream it. We’ll crochet it. <span>↗</span></a></div>
          <div className="hero-foot"><span className="mini-yarn"><Yarn/></span><p>Made slowly.<br/><strong>Meant to be loved.</strong></p><div className="hero-foot-line"/><span className="handwritten">one stitch at a time ♡</span></div>
        </div>
        <div className="hero-art"><img className="hero-image" src="/images/hero-crochet.webp" alt="Concept still life of a crochet bunny, daisies and soft-colored yarn on linen" fetchPriority="high"/><div className="hero-stamp">HANDMADE<br/><span>with love</span><small>✳ KANASU GARI ✳</small></div><div className="hero-caption"><span>THE LITTLE THINGS COLLECTION</span><span>Concept styling · crochet inspiration</span></div><span className="floating-note">a little happiness,<br/>made by hand <svg viewBox="0 0 80 40" fill="none"><path d="M2 2c25 36 50 10 70 24m-12-1 13 2-5-11" stroke="currentColor" strokeWidth="1.5"/></svg></span></div>
        <a href="#collections" className="scroll-note">SCROLL TO UNRAVEL <span>↓</span></a>
      </section>
      <div className="values-strip"><span>Thoughtfully handmade</span><b>✳</b><span>A little more personal</span><b>✳</b><span>Made with imagination</span><b>✳</b><span>From our hands to your home</span><b>✳</b></div>

      <section className="collections section" id="collections">
        <div className="section-heading reveal"><div><span className="eyebrow">A WORLD OF LITTLE WONDERS</span><h2>What makes you <em>smile?</em></h2></div><p>A cozy corner. A forever flower. A tiny companion.<br/>There’s a little joy for everyone.</p></div>
        <div className="collection-grid">
          {[{name:"Forever flowers",sub:"A little bloom, every day",id:"sunflower",category:"Flowers"},{name:"Little companions",sub:"Small friends. Big feelings.",id:"bunny",category:"Little companions"},{name:"Everyday lovely",sub:"Carry a little handmade",id:"bag",category:"Bags & accessories"},{name:"Cozy little corners",sub:"Make yourself at home",id:"cushion",category:"Home & festive"}].map((c,i)=>{const p=products.find(p=>p.id===c.id)!;return <button className={`collection-card collection-${i} reveal`} key={c.id} onClick={()=>{setCategory(c.category as Category);setSavedOnly(false);document.getElementById("creations")?.scrollIntoView({behavior:"smooth"});}}><div className="collection-image"><ProductMedia product={p}/><span className="collection-number">0{i+1}</span><span className="collection-arrow"><Icon name="arrow"/></span></div><h3>{c.name}</h3><p>{c.sub}</p></button>;})}
        </div>
      </section>

      <section className="creations section" id="creations">
        <div className="section-heading reveal"><div><span className="eyebrow">FROM OUR HANDS, WITH LOVE</span><h2>Pick your <em>little joy.</em></h2></div><div className="carousel-controls"><button className="round-button" aria-label="Previous creations" onClick={()=>track.current?.scrollBy({left:-350,behavior:"smooth"})}>←</button><button className="round-button" aria-label="Next creations" onClick={()=>track.current?.scrollBy({left:350,behavior:"smooth"})}>→</button></div></div>
        <div className="filter-row" aria-label="Filter creations">{categories.map(c=><button key={c} className={`filter ${category===c?"on":""}`} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}<button className={`filter saved-filter ${savedOnly?"on":""}`} aria-pressed={savedOnly} onClick={()=>setSavedOnly(v=>!v)}><Icon name="heart" size={14}/> Saved ({saved.length})</button></div>
        <div className="product-track" ref={track} tabIndex={0} aria-label="Scrollable creations"
          onPointerDown={e=>{if(e.pointerType==="mouse")drag.current={x:e.clientX,scroll:e.currentTarget.scrollLeft,moved:false};}}
          onPointerMove={e=>{const d=drag.current;if(!d)return;const dx=e.clientX-d.x;if(Math.abs(dx)>6){d.moved=true;e.currentTarget.setPointerCapture(e.pointerId);}if(d.moved)e.currentTarget.scrollLeft=d.scroll-dx;}}
          onPointerUp={()=>{setTimeout(()=>{drag.current=null;},0);}}
          onPointerCancel={()=>{drag.current=null;}}
          onClickCapture={e=>{if(drag.current?.moved){e.preventDefault();e.stopPropagation();}}}>
          {shown.map((p,i)=><article className="product-card" key={p.id} style={{"--card-angle":`${i%2===0?-1:1}deg`} as React.CSSProperties}>
            <div className="product-photo"><button className="product-open" aria-label={`Explore ${p.name}`} onClick={()=>setSelected(p)}><ProductMedia product={p}/></button><span className="product-tag">HANDMADE CROCHET</span><button className={`save-button ${saved.includes(p.id)?"saved":""}`} aria-label={`${saved.includes(p.id)?"Unsave":"Save"} ${p.name}`} aria-pressed={saved.includes(p.id)} onClick={()=>toggleSaved(p.id)}><Icon name="heart" size={18}/></button><button className="product-plus" aria-label={`View ${p.name}`} onClick={()=>setSelected(p)}><Icon name="plus"/></button></div>
            <div className="product-meta"><div><span>{p.category}</span><h3><button onClick={()=>setSelected(p)}>{p.name}</button></h3><p>{p.note}</p></div></div>
          </article>)}
          {!shown.length&&<div className="empty-state"><Yarn/><h3>A little space for your favorites.</h3><p>Tap a heart on any creation to save it here.</p><button className="text-link" onClick={()=>{setSavedOnly(false);setCategory("All creations");}}>Explore all creations →</button></div>}
        </div>
        <div className="track-foot"><span>← &nbsp; Swipe, scroll, or use the arrows to explore</span><span>Curious about a piece? Let’s talk. <a href="#custom">Start an enquiry ↗</a></span></div>
      </section>

      <section className="shelf-section" aria-labelledby="shelf-title">
        <div className="shelf-heading"><span className="eyebrow">COME A LITTLE CLOSER</span><h2 id="shelf-title">Our little <em>happy shelf.</em></h2><p>A few handmade favorites, waiting to meet you.</p></div>
        <div className="handmade-shelf">{[products[4],products[5],products[0],products[2],products[6]].map((p,i)=><button key={p.id} className={`shelf-piece ${shelfIndex===i?"in-front":""}`} style={{"--offset":i-2} as React.CSSProperties} onMouseEnter={()=>setShelfIndex(i)} onFocus={()=>setShelfIndex(i)} onClick={()=>setSelected(p)} aria-label={`Explore ${p.name}`}><img src={p.image} alt={p.name} loading="lazy"/><span>{p.name}<small>Take a closer look ↗</small></span></button>)}<div className="shelf-wood"/></div>
        <span className="shelf-hint">A little curious? Tap a creation to say hello.</span>
      </section>
      <section className="custom-section" id="custom">
        <div className="custom-intro reveal"><span className="eyebrow">YOUR IMAGINATION. OUR CREATION.</span><h2>A little more<br/><em>you.</em></h2><p>Your favorite shade. A gift with a story. Something you haven’t found anywhere else. Let’s imagine a crochet creation together.</p><div className="custom-steps"><div><span>01</span><p>Tell us your idea</p></div><div><span>02</span><p>We discuss the little details</p></div><div><span>03</span><p>A quote, a plan, then the making</p></div></div><Flower className="custom-flower"/><span className="handwritten">made with you in mind</span></div>
        <div className="custom-builder reveal"><div className="builder-top"><Yarn/><span>LET’S MAKE SOMETHING LOVELY</span><b>✳</b></div><h3>What are you dreaming of?</h3><label htmlFor="creation-type">I have my heart set on</label><select id="creation-type" value={customType} onChange={e=>setCustomType(e.target.value)}>{[...new Set(["A flower or bouquet","A little companion","A bag or accessory","Something for my home","Something completely different",...products.map(p=>p.name)])].map(v=><option key={v}>{v}</option>)}</select><fieldset><legend>A color I love <span>{color.name}</span></legend><div className="swatches">{palettes.map(p=><button key={p.name} type="button" className={p.name===color.name?"chosen":""} style={{background:p.hex}} onClick={()=>setColor(p)} aria-label={p.name} aria-pressed={p.name===color.name}>{p.name===color.name&&<Icon name="check" size={17}/>}</button>)}</div></fieldset><label htmlFor="idea">The little details <span>(optional)</span></label><textarea id="idea" placeholder="Who’s it for? A size, an occasion, an idea…" maxLength={1000} rows={3} value={message} onChange={e=>setMessage(e.target.value)}/><button className="button builder-button" onClick={copyEnquiry}>{copied?"Enquiry copied!":"Copy my enquiry"}<Icon name={copied?"check":"arrow"}/></button><p className="builder-note">Copy your note, then <a href={instagram} target="_blank" rel="noreferrer">send it to us on Instagram ↗</a><br/>We’ll confirm options, pricing and making time together.</p><details className="enquiry-preview"><summary>Preview your enquiry</summary><p>{enquiry}</p></details></div>
      </section>

      <section className="story section" id="story"><div className="story-visual reveal"><img src="/images/hero-crochet.webp" alt="Illustrative crochet yarn, daisies and a handmade bunny" loading="lazy"/><div className="story-label"><span>A LITTLE YARN</span><Yarn/><span>A LOT OF HEART</span></div></div><div className="story-copy reveal"><span className="eyebrow">THE WORLD OF KANASU GARI</span><h2>Every little stitch.<br/><em>A little bit of heart.</em></h2><p>Some things feel special because you can see the hands behind them. The loops, the textures, the little details that make a creation its own.</p><p>At Kanasu Gari, handmade and customized creations are at the heart of what we do. From crochet flowers to playful companions, there’s always something new taking shape.</p><a className="text-link" href="https://www.youtube.com/@kanasu_gari" target="_blank" rel="noreferrer">Step inside our creative world <span>↗</span></a><span className="handwritten">slow stitches. happy little things.</span></div></section>

      <section className="journal section" id="journal"><div className="section-heading reveal"><div><span className="eyebrow">A PEEK BEHIND THE STITCHES</span><h2>Made by hand.<br/><em>Shared with love.</em></h2></div><a className="text-link" href={instagram} target="_blank" rel="noreferrer"><Icon name="instagram" size={17}/> @kanasu_gari ↗</a></div><div className="journal-grid">{[products[1],products[0],products[2]].map((p,i)=><a key={p.id} className={`journal-card journal-${i}`} href={p.post} target="_blank" rel="noreferrer"><ProductMedia product={p}/><span className="play-button"><Icon name="play" size={20}/></span><div><small>FROM THE KANASU GARI JOURNAL</small><h3>{["A little sunshine, stitch by stitch.","Say hello to your new little friend.","A bouquet you can take everywhere."][i]}</h3><span>Watch on Instagram ↗</span></div></a>)}</div></section>

      <section className="faq section"><div className="reveal"><span className="eyebrow">THE LITTLE DETAILS</span><h2>A stitch of<br/><em>information.</em></h2><p>Have something else on your mind?<br/><a href={instagram} target="_blank" rel="noreferrer">We’re a message away ↗</a></p></div><div className="faq-list">{[{q:"Can I request a custom creation?",a:"Yes, custom creations feature throughout the Kanasu Gari collection. Share your idea, preferred colors and size through an enquiry. The maker will confirm what is possible before you order."},{q:"How do I place an order?",a:"Explore a creation, then use the custom enquiry builder or message @kanasu_gari on Instagram. Confirm the design, price, payment arrangements and delivery details directly with the maker."},{q:"How long will my piece take?",a:"Making time depends on the piece, customization and the current order queue. Please share any gifting date when enquiring so the maker can confirm a realistic timeline."},{q:"Are all these creations currently available?",a:"This collection showcases pieces shared by Kanasu Gari. Stock, colors and prices are confirmed on enquiry. A previously shared piece may need to be made to order."},{q:"How should I care for my crochet piece?",a:"Care depends on the yarn, construction and any decorative parts. Request the care instructions for your specific piece when ordering."}].map(item=><details key={item.q}><summary>{item.q}<span>+</span></summary><p>{item.a}</p></details>)}</div></section>

      <section className="closing"><Flower/><span className="eyebrow">SOMETHING SMALL. SOMETHING SPECIAL.</span><h2>Your next little joy<br/>starts with <em>a hello.</em></h2><a className="button" href={instagram} target="_blank" rel="noreferrer">Let’s make something lovely <Icon name="arrow"/></a><svg className="closing-thread" viewBox="0 0 1400 200" fill="none" aria-hidden="true"><path d="M-10 140C180-40 270 240 450 100S650 90 700 130c110 70 100-140-10-70s170 180 380 50 270-90 370 30" stroke="currentColor" strokeWidth="2"/></svg></section>
    </main>
    <footer><div className="footer-main"><a className="brand" href="#"><Yarn/><span>Kanasu Gari<small>A LITTLE WORLD OF YARN</small></span></a><p>Little joys, handmade.<br/>For your world, with love.</p><div><a href={instagram} target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://www.youtube.com/@kanasu_gari" target="_blank" rel="noreferrer">YouTube ↗</a><a href="#custom">Custom enquiries ↗</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Kanasu Gari</span><span>Crafted with a little imagination and a lot of heart.</span><a href="#">Back to top ↑</a></div></footer>
    {selected&&<div className="modal-backdrop" onClick={e=>{if(e.target===e.currentTarget)setSelected(null);}}><section className="product-dialog" role="dialog" aria-modal="true" aria-labelledby="product-title"><button ref={closeRef} className="dialog-close icon-button" aria-label="Close product details" onClick={()=>setSelected(null)}><Icon name="close"/></button><ProductMedia product={selected}/><div className="dialog-copy"><span className="eyebrow">{selected.category}</span><h2 id="product-title">{selected.name}</h2><p>{selected.description}</p><p className="availability-note">Price, availability and customization are confirmed with the maker.</p><button className="button" onClick={()=>enquire(selected)}>Make an enquiry <Icon name="arrow"/></button><button className="text-link" onClick={()=>toggleSaved(selected.id)}><Icon name="heart"/>{saved.includes(selected.id)?"Saved to your little joys":"Save this little joy"}</button><a href={selected.post} className="text-link" target="_blank" rel="noreferrer">See the original creation ↗</a></div></section></div>}
    <div className={`toast ${toast?"visible":""}`} role="status">{toast}</div>
  </>;
}
