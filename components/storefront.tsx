"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform, useSpring } from "motion/react";
import Lenis from "lenis";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Heart,
  Instagram,
  Menu,
  Minus,
  Plus,
  RotateCcw,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import HeroScene, { type ColorwayKey, type MaterialKey } from "@/components/hero-scene";
import ProductArt from "@/components/product-art";
import { categories, formatPrice, products, timeline, type Product } from "@/lib/products";

type Currency = "PKR" | "USD";
type CartLine = { productId: string; quantity: number };
type CheckoutFields = { name: string; phone: string; city: string; address: string };

const reveal3d = {
  hidden: { opacity: 0, rotateX: 16, translateZ: -70 },
  visible: { opacity: 1, rotateX: 0, translateZ: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const } },
};

function Tilt3D({ children, intensity = 6 }: { children: ReactNode; intensity?: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 22 });
  const springY = useSpring(y, { stiffness: 180, damping: 22 });
  const rotateX = useTransform(springY, [-[intensity], intensity], [intensity, -intensity]);
  const rotateY = useTransform(springX, [-[intensity], intensity], [-intensity, intensity]);

  return (
    <motion.div
      className="tilt-3d"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(((event.clientX - centerX) / rect.width) * 2);
        y.set(((event.clientY - centerY) / rect.height) * 2);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX: springX as any, rotateY: springY as any }}
    >
      {children}
    </motion.div>
  );
}

function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <a className={`brand-lockup ${inverse ? "brand-lockup--inverse" : ""}`} href="#top" aria-label="Saleem and Sons home">
      <span className="brand-monogram">S<span>&</span>S</span>
      <span className="brand-name">SALEEM <i>&</i> SONS</span>
      <span className="brand-subline">OBJECTS WITH PURPOSE</span>
    </a>
  );
}

function ProductCard({
  product,
  currency,
  onOpen,
  onAdd,
}: {
  product: Product;
  currency: Currency;
  onOpen: (product: Product) => void;
  onAdd: (product: Product) => void;
}) {
  const [saved, setSaved] = useState(false);
  return (
    <Tilt3D intensity={5}>
      <motion.article className="product-card" variants={reveal3d} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.16 }} whileHover={{ y: -5, rotateX: 2 }}>
      <button className="product-card__visual" onClick={() => onOpen(product)} aria-label={`View ${product.name}`}>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <ProductArt art={product.art} />
        <span className="product-card__quick">Quick view <ArrowUpRight size={14} /></span>
      </button>
      <div className="product-card__meta">
        <div>
          <span className="eyebrow product-category">{product.category}</span>
          <button className="product-name" onClick={() => onOpen(product)}>{product.name}</button>
          <span className="product-material">{product.material}</span>
        </div>
        <button className={`save-button ${saved ? "is-saved" : ""}`} aria-label={saved ? "Remove from saved items" : "Save item"} onClick={() => setSaved((value) => !value)}>
          <Heart size={17} fill={saved ? "currentColor" : "none"} strokeWidth={1.5} />
        </button>
      </div>
      <div className="product-card__bottom">
        <div className="price-line">
          <span>{formatPrice(product.price, currency)}</span>
          {product.compareAt && <del>{formatPrice(product.compareAt, currency)}</del>}
        </div>
        <button className="add-small" onClick={() => onAdd(product)} aria-label={`Add ${product.name} to bag`}><Plus size={16} /></button>
      </div>
    </motion.article>
    </Tilt3D>
  );
}

function Drawer({
  open,
  onClose,
  children,
  title,
  side = "right",
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
  side?: "right" | "left";
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button className="drawer-scrim" aria-label="Close panel" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside className={`drawer drawer--${side}`} role="dialog" aria-modal="true" aria-label={title} initial={{ x: side === "right" ? "102%" : "-102%" }} animate={{ x: 0 }} exit={{ x: side === "right" ? "102%" : "-102%" }} transition={{ type: "spring", damping: 30, stiffness: 280 }}>
            <div className="drawer__head">
              <div><span className="eyebrow">SALEEM & SONS</span><h2>{title}</h2></div>
              <button className="icon-button" onClick={onClose} aria-label="Close"><X size={19} /></button>
            </div>
            <div className="drawer__body">{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default function Storefront() {
  const [currency, setCurrency] = useState<Currency>("PKR");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All pieces");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeMaterial, setActiveMaterial] = useState<MaterialKey>("leather");
  const [activeColorway, setActiveColorway] = useState<ColorwayKey>("cognac");
  const [activeYear, setActiveYear] = useState(0);
  const [toast, setToast] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutFields, setCheckoutFields] = useState<CheckoutFields>({ name: "", phone: "", city: "", address: "" });
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [orderReference, setOrderReference] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterDone, setNewsletterDone] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, duration: 1.08, smoothWheel: true });
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("saleem-sons-bag");
      if (saved) setCart(JSON.parse(saved) as CartLine[]);
    } catch {
      window.localStorage.removeItem("saleem-sons-bag");
    }
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (storageReady) window.localStorage.setItem("saleem-sons-bag", JSON.stringify(cart));
  }, [cart, storageReady]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const lock = bagOpen || searchOpen || mobileMenuOpen || Boolean(selectedProduct);
    document.body.style.overflow = lock ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [bagOpen, searchOpen, mobileMenuOpen, selectedProduct]);

  const cartCount = cart.reduce((count, line) => count + line.quantity, 0);
  const cartLines = cart.map((line) => ({ ...line, product: products.find((product) => product.id === line.productId) })).filter((line): line is CartLine & { product: Product } => Boolean(line.product));
  const subtotal = cartLines.reduce((total, line) => total + line.product.price * line.quantity, 0);
  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch = activeCategory === "All pieces" || product.category === activeCategory;
      const queryMatch = `${product.name} ${product.category} ${product.material}`.toLowerCase().includes(search.toLowerCase());
      return categoryMatch && queryMatch;
    });
  }, [activeCategory, search]);
  const searchResults = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products.slice(0, 3);
    return products.filter((product) => `${product.name} ${product.category} ${product.material}`.toLowerCase().includes(term));
  }, [search]);

  const addToBag = (product: Product) => {
    setCart((current) => {
      const existing = current.find((line) => line.productId === product.id);
      return existing
        ? current.map((line) => line.productId === product.id ? { ...line, quantity: line.quantity + 1 } : line)
        : [...current, { productId: product.id, quantity: 1 }];
    });
    setToast(`${product.name} added to your bag`);
    setBagOpen(true);
    setSelectedProduct(null);
  };

  const changeQuantity = (productId: string, delta: number) => {
    setCart((current) => current
      .map((line) => line.productId === productId ? { ...line, quantity: line.quantity + delta } : line)
      .filter((line) => line.quantity > 0));
  };

  const submitCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCheckoutBusy(true);
    setOrderReference("");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: checkoutFields,
          items: cart.map(({ productId, quantity }) => ({ productId, quantity })),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not prepare your order preview.");
      setOrderReference(result.reference as string);
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setCheckoutBusy(false);
    }
  };

  const handleNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterDone(true);
    setNewsletterEmail("");
  };

  return (
    <main id="top" className="storefront-shell layout-3d">
      <div className="announcement-bar">
        <span>Considered goods. Made to be kept.</span>
        <span className="announcement-center">A NEW STANDARD IN THE EVERYDAY</span>
        <a href="#story">Our point of view <ArrowUpRight size={12} /></a>
      </div>

      <header className="site-header">
        <button className="mobile-menu-trigger icon-button" aria-label="Open menu" onClick={() => setMobileMenuOpen(true)}><Menu size={21} /></button>
        <nav className="main-nav main-nav--left" aria-label="Main navigation">
          <a href="#collections">Collections</a>
          <a href="#edit">The edit</a>
          <a href="#story">Our story</a>
        </nav>
        <BrandMark />
        <div className="header-actions">
          <button className="header-action search-trigger" onClick={() => setSearchOpen(true)}><Search size={17} strokeWidth={1.7} /><span>Search</span></button>
          <label className="currency-select-wrap" aria-label="Select currency">
            <select value={currency} onChange={(event) => setCurrency(event.target.value as Currency)}>
              <option value="PKR">PKR</option>
              <option value="USD">USD*</option>
            </select>
            <ChevronDown size={12} />
          </label>
          <button className="header-action bag-trigger" onClick={() => setBagOpen(true)} aria-label={`Open shopping bag, ${cartCount} items`}>
            <ShoppingBag size={17} strokeWidth={1.7} /><span>Bag</span><b>{cartCount.toString().padStart(2, "0")}</b>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div className="mobile-menu" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <div className="mobile-menu__top"><BrandMark inverse /><button className="icon-button" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu"><X /></button></div>
            {[["Collections", "#collections"], ["The edit", "#edit"], ["Our story", "#story"]].map(([label, href]) => <a key={href} href={href} onClick={() => setMobileMenuOpen(false)}>{label}<ArrowUpRight size={16} /></a>)}
            <p>Built on tradition. Crafted for the modern era.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="hero-section" aria-labelledby="hero-heading">
        <div className="hero-background-grid" aria-hidden="true" />
        <div className="hero-copy">
          <motion.div className="hero-kicker" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.7 }}>
            <span className="gold-rule" /> CRAFT OVER NOISE <span className="kicker-dot">·</span> MADE WITH INTENTION
          </motion.div>
          <motion.h1 id="hero-heading" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            Built on <em>Tradition.</em><br />Crafted for the<br />Modern Era<span className="hero-period">.</span>
          </motion.h1>
          <motion.p className="hero-intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.46, duration: 0.8 }}>
            Thoughtful objects, honest materials and enduring design. For the things you use, and the moments that stay.
          </motion.p>
          <motion.div className="hero-ctas" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.62, duration: 0.7 }}>
            <a className="button button--gold" href="#edit">Explore the collection <ArrowUpRight size={15} /></a>
            <a className="text-link text-link--light" href="#story">Discover our story <ArrowDownRight size={16} /></a>
          </motion.div>
          <motion.div className="hero-footnote" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.92, duration: 0.8 }}>
            <span>01 / 04</span><span className="footnote-line" /><span>THE EVERYDAY, ELEVATED</span>
          </motion.div>
        </div>

        <motion.div className="hero-visual" initial={{ opacity: 0, scale: 0.96, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ delay: 0.32, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}>
          <div className="hero-visual__halo" />
          <div className="hero-visual__frame">
            <div className="hero-visual__topline"><span>OBJECT No. 001</span><span>THE HERITAGE CARRYALL</span></div>
            <HeroScene material="leather" />
            <div className="hero-visual__bottomline"><span>01 / 03 — FULL-GRAIN LEATHER</span><span className="orbit-instruction"><RotateCcw size={12} /> DRAG TO EXPLORE</span></div>
          </div>
          <div className="hero-stamp"><span>THE</span><b>GOOD</b><span>LASTS</span><i>✳</i></div>
          <div className="hero-vertical-label">OBJECTS WITH PURPOSE — MADE TO LAST</div>
        </motion.div>
        <div className="hero-bottom-rule"><span>01</span><span>CRAFT OVER NOISE</span><span>SCROLL TO EXPLORE <ArrowDownRight size={14} /></span></div>
      </section>

      <section className="trust-strip" aria-label="Our values">
        <div><span className="trust-index">01</span><span>Honest materials</span></div>
        <div><span className="trust-index">02</span><span>Considered design</span></div>
        <div><span className="trust-index">03</span><span>Made to be kept</span></div>
        <div><span className="trust-index">04</span><span>Details that matter</span></div>
      </section>

      <section className="collections-section section-light" id="collections">
        <div className="section-heading collections-heading">
          <motion.div variants={reveal3d} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="eyebrow eyebrow--dark"><span className="small-gold-dot" /> FIND YOUR EVERYDAY</span>
            <h2>Made for the way<br /><em>you move.</em></h2>
          </motion.div>
          <motion.p variants={reveal3d} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            A small collection of well-considered essentials. Each has a purpose. Every detail has a reason.
          </motion.p>
        </div>
        <div className="category-grid">
          {categories.map((category, index) => (
            <Tilt3D key={category.name} intensity={5}>
              <motion.button
                className={`category-card category-card--${index + 1}`}
                variants={reveal3d}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: index * 0.08, duration: 0.7 }}
                onClick={() => { setActiveCategory(category.name); document.getElementById("edit")?.scrollIntoView({ behavior: "smooth" }); }}
              >
                <div className="category-card__art"><ProductArt art={category.art} /></div>
                <div className="category-card__veil" />
                <div className="category-card__top"><span>{category.number} / 04</span><ArrowUpRight size={19} /></div>
                <div className="category-card__bottom"><span>{category.note}</span><h3>{category.name}</h3></div>
              </motion.button>
            </Tilt3D>
          ))}
        </div>
      </section>

      <section className="edit-section" id="edit">
        <div className="section-heading edit-heading">
          <div>
            <span className="eyebrow"><span className="small-gold-dot" /> THE SALEEM & SONS EDIT</span>
            <h2>Good things.<br /><em>Chosen well.</em></h2>
          </div>
          <p>Pieces designed to find their place in your life, then stay there.</p>
        </div>
        <div className="collection-toolbar">
          <div className="collection-tabs" role="tablist" aria-label="Filter products by category">
            {["All pieces", ...categories.map((category) => category.name)].map((category) => (
              <button key={category} className={activeCategory === category ? "is-active" : ""} role="tab" aria-selected={activeCategory === category} onClick={() => setActiveCategory(category)}>{category}</button>
            ))}
          </div>
          <span className="results-count">SHOWING {visibleProducts.length.toString().padStart(2, "0")} PIECES</span>
        </div>
        <motion.div className="product-grid" layout>
          <AnimatePresence mode="popLayout">
            {visibleProducts.map((product) => (
              <motion.div key={product.id} layout variants={reveal3d} initial="hidden" animate="visible" exit={{ opacity: 0, rotateX: 12, translateZ: -40 }} transition={{ duration: 0.32 }}>
                <ProductCard product={product} currency={currency} onOpen={setSelectedProduct} onAdd={addToBag} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        {visibleProducts.length === 0 && <p className="empty-state">No pieces in this selection. Try another collection.</p>}
        <div className="edit-bottom"><span>THE COLLECTION — 2026</span><span>LESS, BUT BETTER.</span><span>MADE TO LAST <ArrowRight size={14} /></span></div>
      </section>

      <section className="material-section" id="materials">
        <div className="material-copy">
          <span className="eyebrow"><span className="small-gold-dot" /> FEEL THE DIFFERENCE</span>
          <h2>Character in<br /><em>every detail.</em></h2>
          <p>Materials should get better with use. Explore the same signature form in three tactile finishes, each with its own character.</p>
          <div className="material-options" role="group" aria-label="Choose a material finish">
            {([
              ["leather", "Full-grain leather", "Rich · naturally patinated"],
              ["canvas", "Washed canvas", "Textured · easy-going"],
              ["suede", "Earth suede", "Soft · quietly distinctive"],
            ] as [MaterialKey, string, string][]).map(([key, label, detail]) => (
              <button key={key} className={`material-option ${activeMaterial === key ? "is-active" : ""}`} onClick={() => setActiveMaterial(key)}>
                <span className={`material-swatch material-swatch--${key}`} />
                <span><b>{label}</b><small>{detail}</small></span>
                <span className="material-check">{activeMaterial === key && <Check size={13} />}</span>
              </button>
            ))}
          </div>
          <div className="colorway-picker" role="group" aria-label="Choose a colourway">
            <span>COLOURWAY</span>
            {([
              ["cognac", "Cognac", "#986342"],
              ["espresso", "Espresso", "#38271e"],
              ["olive", "Olive", "#68664a"],
            ] as [ColorwayKey, string, string][]).map(([key, label, color]) => (
              <button key={key} className={`colorway-chip ${activeColorway === key ? "is-active" : ""}`} onClick={() => setActiveColorway(key)} aria-label={`${label} colourway`} aria-pressed={activeColorway === key}>
                <span style={{ background: color }} />{label}
              </button>
            ))}
          </div>
          <a href="#edit" className="text-link text-link--light">Find your piece <ArrowUpRight size={15} /></a>
        </div>
        <div className="material-stage">
          <div className="material-stage__label"><span>FORM STUDY / 001</span><span>360° INSPECTION</span></div>
          <HeroScene material={activeMaterial} colorway={activeColorway} compact />
          <div className="material-stage__note"><span>01 — THE HERITAGE CARRYALL</span><span>DRAG TO ROTATE <RotateCcw size={12} /></span></div>
          <div className="material-stage__caption">A closer look at the form, finish and feel.</div>
        </div>
      </section>

      <section className="story-section" id="story">
        <div className="story-topline"><span className="eyebrow"><span className="small-gold-dot" /> THE STORY SO FAR</span><span className="story-topline__right">A LEGACY IN THE MAKING <ArrowDownRight size={14} /></span></div>
        <div className="story-layout">
          <div className="story-heading">
            <h2>Time gives<br />things <em>meaning.</em></h2>
            <p>Not everything needs to be new. Some things simply need to be made well, cared for and carried forward.</p>
            <div className="story-index"><span>OUR</span><b>VALUES</b><span>MADE TO LAST</span></div>
          </div>
          <div className="timeline-panel">
            <div className="timeline-years" role="tablist" aria-label="Our history">
              {timeline.map((item, index) => <button key={item.year} role="tab" aria-selected={activeYear === index} className={activeYear === index ? "is-active" : ""} onClick={() => setActiveYear(index)}>{item.year}</button>)}
            </div>
            <AnimatePresence mode="wait">
              <motion.div className="timeline-content" key={activeYear} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
                <span className="eyebrow">{timeline[activeYear].eyebrow}</span>
                <h3>{timeline[activeYear].title}</h3>
                <p>{timeline[activeYear].body}</p>
                <span className="timeline-mark">{timeline[activeYear].year}</span>
              </motion.div>
            </AnimatePresence>
            <div className="timeline-progress"><span style={{ width: `${((activeYear + 1) / timeline.length) * 100}%` }} /></div>
            <div className="timeline-controls">
              <span>CHAPTER {(activeYear + 1).toString().padStart(2, "0")} / 03</span>
              <div><button aria-label="Previous chapter" onClick={() => setActiveYear((year) => Math.max(0, year - 1))} disabled={activeYear === 0}><ArrowRight size={16} className="flip-arrow" /></button><button aria-label="Next chapter" onClick={() => setActiveYear((year) => Math.min(timeline.length - 1, year + 1))} disabled={activeYear === timeline.length - 1}><ArrowRight size={16} /></button></div>
            </div>
          </div>
        </div>
        <div className="story-values">
          <div><b>01</b><span>Quality over quantity</span></div>
          <div><b>02</b><span>Honesty in every detail</span></div>
          <div><b>03</b><span>Design with a long view</span></div>
        </div>
      </section>

      <section className="newsletter-section">
        <div className="newsletter-ornament" aria-hidden="true">S<span>&</span>S</div>
        <div className="newsletter-copy"><span className="eyebrow"><span className="small-gold-dot" /> A NOTE FROM US</span><h2>Good things<br /><em>are worth sharing.</em></h2><p>Occasional notes on new pieces, considered living and the craft behind what we make.</p></div>
        <form className="newsletter-form" onSubmit={handleNewsletter}>
          <label htmlFor="newsletter-email">YOUR EMAIL ADDRESS</label>
          <div className="newsletter-input-row"><input id="newsletter-email" type="email" value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value)} placeholder="you@example.com" required /><button type="submit" aria-label="Subscribe"><ArrowUpRight size={18} /></button></div>
          <span className="newsletter-note">{newsletterDone ? "You're on the list. Thank you." : "No noise. Just the occasional good thing."}</span>
        </form>
      </section>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand"><BrandMark inverse /><p>Built on tradition.<br />Crafted for the modern era.</p><a className="footer-social" href="https://www.instagram.com/" target="_blank" rel="noreferrer"><Instagram size={15} /> FOLLOW THE JOURNEY <ArrowUpRight size={12} /></a></div>
          <div className="footer-column"><span>EXPLORE</span><a href="#collections">Collections</a><a href="#edit">The edit</a><a href="#materials">Materials</a><a href="#story">Our story</a></div>
          <div className="footer-column"><span>THE DETAILS</span><a href="#story">Our philosophy</a><a href="#materials">Craft & materials</a><a href="mailto:hello@saleemandsons.example">Contact us</a><a href="#top">Shipping & returns</a></div>
          <div className="footer-contact"><span>HAVE A QUESTION?</span><h3>Let's talk<br /><em>good things.</em></h3><a href="mailto:hello@saleemandsons.example">hello@saleemandsons.example <ArrowUpRight size={14} /></a><small>Replace this demo email with your store's official contact.</small></div>
        </div>
        <div className="footer-bottom"><span>© 2026 SALEEM & SONS STORE</span><span>DESIGNED WITH INTENTION</span><a href="#top">BACK TO TOP ↑</a></div>
      </footer>

      <Drawer open={bagOpen} onClose={() => setBagOpen(false)} title={`Your bag (${cartCount.toString().padStart(2, "0")})`}>
        {cartLines.length === 0 ? (
          <div className="bag-empty"><div className="bag-empty__icon"><ShoppingBag size={25} /></div><h3>A little room for<br /><em>something good.</em></h3><p>Your bag is waiting for a piece you'll want to keep.</p><button className="button button--gold button--full" onClick={() => { setBagOpen(false); document.getElementById("edit")?.scrollIntoView({ behavior: "smooth" }); }}>Explore the collection <ArrowUpRight size={15} /></button></div>
        ) : (
          <>
            <div className="bag-items">{cartLines.map(({ product, quantity }) => (
              <div className="bag-item" key={product.id}>
                <div className="bag-item__art"><ProductArt art={product.art} /></div>
                <div className="bag-item__details"><span className="eyebrow">{product.category}</span><b>{product.name}</b><span>{formatPrice(product.price, currency)}</span><div className="quantity-control"><button onClick={() => changeQuantity(product.id, -1)} aria-label="Decrease quantity"><Minus size={12} /></button><span>{quantity.toString().padStart(2, "0")}</span><button onClick={() => changeQuantity(product.id, 1)} aria-label="Increase quantity"><Plus size={12} /></button></div></div>
                <button className="remove-item" onClick={() => setCart((current) => current.filter((line) => line.productId !== product.id))} aria-label={`Remove ${product.name}`}><X size={15} /></button>
              </div>
            ))}</div>
            <div className="bag-summary"><div><span>Subtotal</span><b>{formatPrice(subtotal, currency)}</b></div><small>Delivery and taxes are calculated at confirmation.</small>
              {!checkoutOpen && <button className="button button--gold button--full" onClick={() => setCheckoutOpen(true)}>Continue to details <ArrowRight size={15} /></button>}
              {checkoutOpen && !orderReference && <form className="checkout-form" onSubmit={submitCheckout}>
                <div className="checkout-form__heading"><h3>Delivery details</h3><span>DEMO CHECKOUT</span></div>
                <label>Full name<input value={checkoutFields.name} onChange={(event) => setCheckoutFields({ ...checkoutFields, name: event.target.value })} required minLength={2} autoComplete="name" /></label>
                <label>Phone number<input value={checkoutFields.phone} onChange={(event) => setCheckoutFields({ ...checkoutFields, phone: event.target.value })} required minLength={7} autoComplete="tel" placeholder="+92 ..." /></label>
                <label>City<input value={checkoutFields.city} onChange={(event) => setCheckoutFields({ ...checkoutFields, city: event.target.value })} required autoComplete="address-level2" /></label>
                <label>Delivery address<textarea value={checkoutFields.address} onChange={(event) => setCheckoutFields({ ...checkoutFields, address: event.target.value })} required minLength={8} rows={2} autoComplete="street-address" /></label>
                <button className="button button--gold button--full" type="submit" disabled={checkoutBusy}>{checkoutBusy ? "Preparing preview…" : "Prepare order preview"}<ArrowRight size={15} /></button>
                <p className="demo-disclaimer">Demo only: no payment is taken and no live order is placed.</p>
              </form>}
              {orderReference && <div className="order-preview"><span className="order-preview__check"><Check size={19} /></span><span className="eyebrow">PREVIEW CREATED</span><h3>Thank you, {checkoutFields.name.split(" ")[0]}.</h3><p>Your order summary is ready for review. This is a demonstration only; the store is not yet connected to live fulfilment.</p><b>{orderReference}</b><button className="text-link" onClick={() => { setBagOpen(false); setCheckoutOpen(false); setOrderReference(""); }}>Continue browsing <ArrowUpRight size={14} /></button></div>}
            </div>
          </>
        )}
      </Drawer>

      <Drawer open={searchOpen} onClose={() => { setSearchOpen(false); setSearch(""); }} title="Find your piece" side="left">
        <div className="search-panel"><label htmlFor="store-search">SEARCH THE COLLECTION</label><div className="search-field"><Search size={18} /><input id="store-search" autoFocus placeholder="Try leather, travel, journal…" value={search} onChange={(event) => setSearch(event.target.value)} /><button aria-label="Clear search" onClick={() => setSearch("")}><X size={15} /></button></div>
          <div className="search-results"><span className="eyebrow">{search.trim() ? `${searchResults.length} MATCHES` : "A FEW GOOD PLACES TO START"}</span>
            {searchResults.map((product) => <button key={product.id} className="search-result" onClick={() => { setSelectedProduct(product); setSearchOpen(false); setSearch(""); }}><div><ProductArt art={product.art} /></div><span><small>{product.category}</small><b>{product.name}</b><small>{formatPrice(product.price, currency)}</small></span><ArrowUpRight size={16} /></button>)}
            {searchResults.length === 0 && <p className="empty-state">Nothing found. Try another word.</p>}
          </div>
        </div>
      </Drawer>

      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.button className="modal-scrim" aria-label="Close product details" onClick={() => setSelectedProduct(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div className="product-modal" role="dialog" aria-modal="true" aria-label={`${selectedProduct.name} details`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.24 }}>
              <button className="product-modal__close icon-button" onClick={() => setSelectedProduct(null)} aria-label="Close"><X size={19} /></button>
              <div className="product-modal__visual"><ProductArt art={selectedProduct.art} /></div>
              <div className="product-modal__copy"><span className="eyebrow">{selectedProduct.category} / OBJECT {products.findIndex((item) => item.id === selectedProduct.id) + 1}</span><h2>{selectedProduct.name}</h2><span className="product-modal__price">{formatPrice(selectedProduct.price, currency)}</span><p>{selectedProduct.description}</p><div className="product-modal__spec"><span>MATERIAL</span><b>{selectedProduct.material}</b></div><div className="product-modal__spec"><span>AVAILABLE FINISHES</span><b>{selectedProduct.colors.join(" · ")}</b></div><button className="button button--gold button--full" onClick={() => addToBag(selectedProduct)}>Add to bag <Plus size={16} /></button><span className="modal-note">Thoughtfully made. Designed to stay.</span></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <motion.div className="toast-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Check size={15} />{toast}</motion.div>}
      </AnimatePresence>
      {currency === "USD" && <div className="currency-disclaimer">* Indicative demo conversion at Rs. 280 / USD.</div>}
    </main>
  );
}
