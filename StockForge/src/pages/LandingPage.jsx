import {
  AppBar, Avatar, Box, Button, Chip, Container,
  Drawer, IconButton, Toolbar, Typography,
} from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import {
  Menu, Close, Star, Verified, LocalShipping,
  Phone, Email, LocationOn, ArrowForward,
  CheckCircle, WhatsApp,
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '../css/landing.css';
import brandLogo from '../assets/logo.png';
import { enquiriesAPI } from '../services/api';
import AnimatedBanner from '../components/AnimatedBanner';

/* ─── MUI Theme ──────────────────────────────────────────────────────────── */
const theme = createTheme({
  typography: { fontFamily: 'Manrope, sans-serif', button: { textTransform: 'none' } },
  components: { MuiButton: { styleOverrides: { root: { borderRadius: 10, fontWeight: 700 } } } },
});

/* ─── DATA ───────────────────────────────────────────────────────────────── */
const NAV = ['About', 'Capabilities', 'Products', 'Process', 'Reviews', 'Contact'];

const TRUST_BADGES = [
  '🌿 All Natural', '🚫 No Preservatives', '🏭 Factory Sealed', '🔬 Lab Tested',
  '📦 Pan India Delivery', '♻️ Eco Packaging', '⭐ 1200+ Partners',
  '✅ FSSAI Licensed', '🏆 98.4% On-Time', '🥇 Premium Quality',
];

const OPS = [
  { icon: '🏪', label: 'Retail Partners',   value: '1,200+', note: 'Across Maharashtra & nearby markets', color: '#f59e0b' },
  { icon: '🚚', label: 'On-Time Dispatch',   value: '98.4%',  note: 'Against committed dispatch windows',  color: '#10b981' },
  { icon: '🫙', label: 'Product SKUs',        value: '42+',    note: 'Pickles, chutneys & speciality',      color: '#3b82f6' },
  { icon: '✅', label: 'Quality Pass Rate',   value: '99.1%',  note: 'Internal QC before every outbound',   color: '#8b5cf6' },
];

const CAPS = [
  { id:'01', icon:'🧪', color:'#f59e0b', title:'Raw Material Intelligence',
    copy:'Source traceability, vendor quality snapshots, and lot-level reconciliation in one planning flow.',
    stat:'99.1%', statLabel:'Quality Pass Rate' },
  { id:'02', icon:'⚙️', color:'#10b981', title:'Production Line Control',
    copy:'Job-wise schedules, yield variance checks, and shift-level updates designed for real factory floors.',
    stat:'42+', statLabel:'Active SKUs' },
  { id:'03', icon:'🚚', color:'#3b82f6', title:'Dispatch and Demand Sync',
    copy:'From dispatch planning to customer commitments, keep inventory movement and demand always aligned.',
    stat:'98.4%', statLabel:'On-Time Dispatch' },
  { id:'04', icon:'✅', color:'#8b5cf6', title:'Quality and Compliance',
    copy:'Track hygiene checks, packaging quality, and batch confidence across each production cycle.',
    stat:'1200+', statLabel:'Retail Partners' },
];

const PRODUCTS = [
  {
    emoji:'🥭', name:'Aam ka Achaar', subtitle:'Traditional Mango Pickle',
    tag:'Bestseller', tagColor:'#f59e0b', price:'Rs 180',
    desc:'Raw Alphonso mangoes with stone-ground masala and cold-pressed mustard oil.',
    img:'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&q=85&auto=format&fit=crop',
    rating:4.9, reviews:348, badge:'🏆',
  },
  {
    emoji:'🌶️', name:'Lal Mirchi Chutney', subtitle:'Signature Red Chutney',
    tag:'Hot Batch', tagColor:'#ef4444', price:'Rs 150',
    desc:'Slow-cooked garlic chilli blend engineered for depth, heat, and long shelf life.',
    img:'https://images.unsplash.com/photo-1583224994559-3ecfb9d4bf7d?w=600&q=85&auto=format&fit=crop',
    rating:4.8, reviews:212, badge:'🌶️',
  },
  {
    emoji:'🧈', name:'Gir Cow Ghee', subtitle:'Bilona Clarified Butter',
    tag:'Premium', tagColor:'#8b5cf6', price:'Rs 650',
    desc:'A2 milk curd cultured and churned in small runs with aroma-rich finishing.',
    img:'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=85&auto=format&fit=crop',
    rating:5.0, reviews:189, badge:'⭐',
  },
  {
    emoji:'🥜', name:'Shengdana Chutney', subtitle:'Roasted Peanut Mix',
    tag:'Classic', tagColor:'#10b981', price:'Rs 120',
    desc:'Balanced roast profile and coarse texture tuned for meal and snack pairing.',
    img:'https://images.unsplash.com/photo-1596791051880-a20e5bb7a8ab?w=600&q=85&auto=format&fit=crop',
    rating:4.7, reviews:276, badge:'🥜',
  },
  {
    emoji:'🌿', name:'Methi Mathri', subtitle:'Crisp Whole Wheat Snack',
    tag:'Crunchy', tagColor:'#06b6d4', price:'Rs 200',
    desc:'Low moisture, high crunch and consistent seasoning for retail-ready batches.',
    img:'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600&q=85&auto=format&fit=crop',
    rating:4.8, reviews:154, badge:'🌿',
  },
  {
    emoji:'🫙', name:'Imli Chutney', subtitle:'Sweet Tangy Tamarind',
    tag:'Street Fav', tagColor:'#f97316', price:'Rs 140',
    desc:'Jaggery-forward tamarind reduction with clean finish and broad serving range.',
    img:'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&q=85&auto=format&fit=crop',
    rating:4.9, reviews:301, badge:'🫙',
  },
];

const PROCESS = [
  { step:'01', icon:'🌾', title:'Source & Verify',  color:'#f59e0b',
    desc:'Premium raw materials sourced directly from certified farms with lot-level traceability.' },
  { step:'02', icon:'🧪', title:'Test & Approve',   color:'#3b82f6',
    desc:'Every batch undergoes rigorous in-house and third-party lab testing before production.' },
  { step:'03', icon:'⚙️', title:'Process & Craft',  color:'#10b981',
    desc:'Stone-ground masalas, traditional recipes, and precision-controlled cooking processes.' },
  { step:'04', icon:'📦', title:'Pack & Seal',       color:'#8b5cf6',
    desc:'FSSAI-compliant packaging with tamper-proof seals and accurate nutritional labelling.' },
  { step:'05', icon:'🚚', title:'Dispatch & Deliver',color:'#ef4444',
    desc:'Same-day dispatch for confirmed orders with real-time tracking across India.' },
];

const REVIEWS = [
  { name:'Meena Sharma',   city:'Mumbai', role:'Home Chef',        init:'M', bg:'#f59e0b',
    text:'The flavor consistency is excellent. Every jar tastes as if it was made in my own kitchen — every single time.', },
  { name:'Rajiv Kulkarni', city:'Pune',   role:'Retail Store Owner',init:'R', bg:'#10b981',
    text:'Packaging quality and aroma retention are top-notch. A reliable premium line I stock and reorder every month.', },
  { name:'Priya Desai',    city:'Nashik', role:'Wholesale Buyer',  init:'P', bg:'#8b5cf6',
    text:'Great product quality, clear labels, fast dispatch. Our bulk orders always arrive on time and in perfect condition.', },
];

const CONTACT_ITEMS = [
  { Icon:Phone,         label:'Phone',     val:'+91 98765 43210',     sub:'Mon–Sat, 9am–7pm',       color:'#f59e0b', href:'tel:+919876543210' },
  { Icon:Email,         label:'Email',     val:'orders@grihudyog.in',  sub:'Response within 24 hrs', color:'#3b82f6', href:'mailto:orders@grihudyog.in' },
  { Icon:LocationOn,    label:'Address',   val:'Deccan Gymkhana, Pune',sub:'Maharashtra 411004',     color:'#ef4444', href:'#' },
  { Icon:LocalShipping, label:'Wholesale', val:'Bulk Orders Open',     sub:'Min. order Rs 2,000',    color:'#10b981', href:'#contact' },
];

const FOOTER_COLS = [
  {
    title: 'Products',
    links: ['Mango Pickle','Chilli Pickle','Gir Cow Ghee','Peanut Chutney','Methi Mathri','Imli Chutney'],
  },
  {
    title: 'Company',
    links: ['About Us','Capabilities','Production Process','Quality Standards','ERP Login','Careers'],
  },
  {
    title: 'Support',
    links: ['Contact Us','Wholesale Enquiry','Track Order','Return Policy','FAQs','Privacy Policy'],
  },
];

/* ─── Sub-components ─────────────────────────────────────────────────────── */
const Stars = ({ n }) => (
  <Box sx={{ display:'flex', gap:'2px' }}>
    {[1,2,3,4,5].map(s => (
      <Star key={s} sx={{ fontSize:'.7rem', color: s <= Math.round(n) ? '#fbbf24':'#d1d5db' }} />
    ))}
  </Box>
);

const StatCard = ({ icon, label, value, note, color }) => {
  const [show, setShow] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setShow(true); }, { threshold:.2 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <Box ref={ref} className="sc reveal" style={{ '--cc': color }}>
      <Box className="sc-icon-wrap" style={{ background:`${color}18`, border:`1.5px solid ${color}28` }}>
        <span className="sc-icon">{icon}</span>
      </Box>
      <Box className="sc-val" style={{
        color, opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all .6s ease',
      }}>{value}</Box>
      <Box className="sc-label">{label}</Box>
      <Box className="sc-note">{note}</Box>
    </Box>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [activeSection, setActiveSection] = useState('about');
  const [drawerOpen,    setDrawerOpen]    = useState(false);
  const [scrolled,      setScrolled]      = useState(false);
  const [form, setForm] = useState({ name:'', phone:'', email:'', message:'' });
  const [formSent,  setFormSent]  = useState(false);
  const [formError, setFormError] = useState('');
  const [submitting,setSubmitting]= useState(false);

  const onChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (formSent)  setFormSent(false);
    if (formError) setFormError('');
  };
  const onSubmit = async e => {
    e.preventDefault();
    setSubmitting(true); setFormError('');
    try {
      const res = await enquiriesAPI.create({ ...form, source:'landing-page' });
      if (res.success) { setFormSent(true); setForm({ name:'', phone:'', email:'', message:'' }); }
      else setFormError(res.message || 'Unable to submit right now.');
    } catch(err) {
      setFormError(err.code==='ERR_NETWORK'
        ? 'Network error. Please try again.'
        : (err.response?.data?.message || 'Unable to submit right now.'));
    } finally { setSubmitting(false); }
  };

  /* reveal observer */
  useEffect(() => {
    const run = () => {
      const nodes = document.querySelectorAll('.reveal:not(.revealed)');
      const io = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } }),
        { threshold:.08, rootMargin:'0px 0px -20px 0px' }
      );
      nodes.forEach(n => io.observe(n));
      return io;
    };
    const io = run();
    return () => io.disconnect();
  }, []);

  /* scroll nav */
  useEffect(() => {
    const sections = ['about','capabilities','products','process','reviews','contact'];
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      const m = window.scrollY + 130;
      let cur = 'about';
      sections.forEach(id => { const el = document.getElementById(id); if (el && m >= el.offsetTop) cur = id; });
      setActiveSection(cur);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive:true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box className="lp-root">

        {/* ══ NAVBAR ════════════════════════════════════════════════════════ */}
        <AppBar position="fixed" elevation={0} className={`lp-nav${scrolled?' scrolled':''}`}>
          <Container maxWidth="xl">
            <Toolbar disableGutters className="lp-nav-inner">
              <Box className="lp-brand">
                <Box className="lp-brand-logo-wrap">
                  <img src={brandLogo} alt="logo" className="lp-brand-logo" />
                </Box>
                <Box>
                  <p className="lp-brand-name">Classic गृह उद्योग</p>
                  <p className="lp-brand-sub">Food Industries, Pune</p>
                </Box>
              </Box>

              <Box className="lp-nav-links">
                {NAV.map(item => (
                  <a key={item} href={`#${item.toLowerCase()}`}
                    className={`lp-nav-link${activeSection===item.toLowerCase()?' active':''}`}>
                    {item}
                  </a>
                ))}
              </Box>

              <Box className="lp-nav-right">
                <a href="tel:+919876543210" className="lp-nav-call">📞 98765 43210</a>
                <Button href="/login"   variant="outlined"   className="lp-login-btn">ERP Login</Button>
                <Button href="#contact" variant="contained"  className="lp-book-btn"
                  sx={{ display:{ xs:'none', lg:'inline-flex' } }}>
                  Book Factory Call
                </Button>
                <IconButton className="lp-hamburger" onClick={() => setDrawerOpen(true)}>
                  <Menu />
                </IconButton>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        {/* ══ DRAWER ════════════════════════════════════════════════════════ */}
        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
          PaperProps={{ className:'lp-drawer' }}>
          <Box className="lp-drawer-top">
            <Box sx={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <img src={brandLogo} alt="logo" className="lp-drawer-logo" />
              <p className="lp-drawer-brand">Classic गृह उद्योग</p>
            </Box>
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ color:'#4b2a0c' }}>
              <Close />
            </IconButton>
          </Box>
          <nav className="lp-drawer-nav">
            {NAV.map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                onClick={() => setDrawerOpen(false)}
                className={`lp-drawer-link${activeSection===item.toLowerCase()?' active':''}`}>
                <span>{item}</span>
                <ArrowForward sx={{ fontSize:'.9rem', opacity:.4 }} />
              </a>
            ))}
          </nav>
          <Box className="lp-drawer-footer">
            <Button href="tel:+919876543210" variant="outlined" fullWidth className="lp-d-call">
              📞 Call Now
            </Button>
            <Button href="/login" variant="contained" fullWidth className="lp-d-erp"
              onClick={() => setDrawerOpen(false)}>
              ERP Login
            </Button>
          </Box>
        </Drawer>

        {/* ══ BANNER ════════════════════════════════════════════════════════ */}
        <Box id="about" sx={{ pt:{ xs:'60px', md:'68px' } }}>
          <AnimatedBanner />
        </Box>

        {/* ══ TRUST TICKER ══════════════════════════════════════════════════ */}
        <Box className="lp-ticker-outer">
          <Box className="lp-ticker-inner">
            {[...TRUST_BADGES, ...TRUST_BADGES, ...TRUST_BADGES].map((b,i) => (
              <span key={i} className="lp-ticker-item">{b}</span>
            ))}
          </Box>
        </Box>

        {/* ══ MOB QUICK STRIP ═══════════════════════════════════════════════ */}
        <Box className="lp-mob-strip-wrap">
          <Container maxWidth="lg">
            <Box className="lp-mob-strip reveal">
              <a href="tel:+919876543210" className="lp-ms-btn lp-ms-call">📞 Call Now</a>
              <a href="/login"            className="lp-ms-btn lp-ms-erp">ERP Login</a>
              <a href="#products"         className="lp-ms-btn lp-ms-explore">View Products →</a>
            </Box>
          </Container>
        </Box>

        {/* ══ OPS STATS ═════════════════════════════════════════════════════ */}
        <Box className="lp-stats-section">
          <Container maxWidth="lg">
            <Box className="lp-stats-hd reveal">
              <p className="kicker">Operations Snapshot</p>
              <h2 className="sec-title">Numbers That Matter To Buyers</h2>
            </Box>
            <Box className="lp-stats-grid">
              {OPS.map(d => <StatCard key={d.label} {...d} />)}
            </Box>
          </Container>
        </Box>

        {/* ══ CAPABILITIES ══════════════════════════════════════════════════ */}
        <Box id="capabilities" className="lp-section lp-warm-bg">
          <Container maxWidth="lg">
            <Box className="sec-head reveal">
              <p className="kicker">Core Capabilities</p>
              <h2 className="sec-title">Designed For Real Production Floors</h2>
              <p className="sec-copy">
                We treat food manufacturing like a disciplined operation — measurable inputs,
                controlled processing, and predictable dispatch outcomes.
              </p>
            </Box>
            <Box className="lp-cap-grid">
              {CAPS.map((c,i) => (
                <Box key={c.id} className="cap-card reveal"
                  style={{ transitionDelay:`${i*70}ms`, '--cc':c.color }}>
                  <Box className="cap-top">
                    <Box className="cap-icon-box" style={{ background:`${c.color}18`, border:`1.5px solid ${c.color}28` }}>
                      <span>{c.icon}</span>
                    </Box>
                    <Box className="cap-stat-box" style={{ background:`${c.color}0d`, border:`1.5px solid ${c.color}22` }}>
                      <span className="cap-sv" style={{ color:c.color }}>{c.stat}</span>
                      <span className="cap-sl">{c.statLabel}</span>
                    </Box>
                  </Box>
                  <p className="cap-id">MODULE {c.id}</p>
                  <h3 className="cap-title">{c.title}</h3>
                  <p className="cap-copy">{c.copy}</p>
                  <span className="cap-bar" style={{ background:`linear-gradient(90deg,${c.color}44,${c.color})` }} />
                </Box>
              ))}
            </Box>
          </Container>
        </Box>

        {/* ══ PRODUCTS ══════════════════════════════════════════════════════ */}
        <Box id="products" className="lp-section lp-products-bg">
          <Container maxWidth="lg">
            <Box className="prod-head reveal">
              <Box>
                <p className="kicker">Product Portfolio</p>
                <h2 className="sec-title">Stable Quality Across Product Families</h2>
              </Box>
              <Button href="#contact" variant="outlined" className="cat-btn" endIcon={<ArrowForward />}>
                Request Catalogue
              </Button>
            </Box>

            <Box className="lp-prod-grid">
              {PRODUCTS.map((p,i) => (
                <Box key={p.name} className="prod-card reveal" style={{ transitionDelay:`${i*55}ms` }}>
                  <Box className="prod-img-wrap">
                    <img src={p.img} alt={p.name} className="prod-img"
                      onError={e => { e.currentTarget.parentElement.style.background='#f3f0ea'; e.currentTarget.style.display='none'; }} />
                    <Box className="prod-img-gradient" />
                    <span className="prod-tag" style={{ background:p.tagColor }}>{p.tag}</span>
                    <span className="prod-badge">{p.badge}</span>
                  </Box>
                  <Box className="prod-body">
                    <Box className="prod-meta-row">
                      <Box sx={{ display:'flex', alignItems:'center', gap:'5px' }}>
                        <span className="prod-emoji">{p.emoji}</span>
                        <Stars n={p.rating} />
                        <span className="prod-rating-val">{p.rating.toFixed(1)}</span>
                      </Box>
                      <span className="prod-rev-count">({p.reviews})</span>
                    </Box>
                    <h3 className="prod-name">{p.name}</h3>
                    <p className="prod-sub">{p.subtitle}</p>
                    <p className="prod-desc">{p.desc}</p>
                    <Box className="prod-tags">
                      {['Factory Sealed','Batch Tested','Ready Stock'].map(t => (
                        <span key={t} className="prod-micro-tag">{t}</span>
                      ))}
                    </Box>
                    <Box className="prod-footer">
                      <span className="prod-price">{p.price}</span>
                      <button className="prod-cta">Request Sample</button>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>

        {/* ══ WHY US ════════════════════════════════════════════════════════ */}
        <Box className="lp-why-section">
          <Container maxWidth="lg">
            <Box className="lp-why-grid">
              <Box className="lp-why-left reveal">
                <p className="kicker" style={{ color:'#fcd34d' }}>Why Classic Griha Udyog</p>
                <h2 className="sec-title" style={{ color:'#f8fafc' }}>Built For Taste.<br/>Built For Scale.</h2>
                <p className="lp-why-copy">
                  From sourcing premium raw materials to dispatching shelf-ready products,
                  every step follows a rigorous process engineered for consistency and trust.
                </p>
                <Box className="lp-why-points">
                  {[
                    ['🌿','Stone-ground masalas — no shortcuts or additives'],
                    ['🔬','Third-party lab tested before every dispatch batch'],
                    ['🏭','FSSAI licensed & hygiene-certified production facility'],
                    ['🚚','98.4% on-time dispatch record across India'],
                    ['🎯','Direct farm-to-factory sourcing for freshness'],
                  ].map(([ic,txt]) => (
                    <Box key={txt} className="lp-why-point">
                      <Box className="lp-why-icon">{ic}</Box>
                      <span className="lp-why-text">{txt}</span>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box className="lp-why-right reveal">
                <Box className="lp-why-card-grid">
                  {[
                    { label:'Customer Satisfaction', val:97,  color:'#f59e0b', icon:'😊' },
                    { label:'Repeat Order Rate',      val:84,  color:'#10b981', icon:'🔄' },
                    { label:'Batch Quality Pass',     val:99,  color:'#8b5cf6', icon:'✅' },
                    { label:'Dispatch Accuracy',      val:98,  color:'#3b82f6', icon:'📦' },
                  ].map(bar => (
                    <Box key={bar.label} className="lp-why-metric-card">
                      <Box className="lp-wmc-top">
                        <span className="lp-wmc-icon">{bar.icon}</span>
                        <span className="lp-wmc-pct" style={{ color:bar.color }}>{bar.val}%</span>
                      </Box>
                      <Box className="lp-wmc-track">
                        <Box className="lp-wmc-fill" style={{ width:`${bar.val}%`, background:`linear-gradient(90deg,${bar.color}66,${bar.color})` }} />
                      </Box>
                      <span className="lp-wmc-label">{bar.label}</span>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* ══ PROCESS ═══════════════════════════════════════════════════════ */}
        <Box id="process" className="lp-section lp-warm-bg">
          <Container maxWidth="lg">
            <Box className="sec-head reveal" sx={{ textAlign:'center' }}>
              <p className="kicker">How We Work</p>
              <h2 className="sec-title">From Farm To Shelf — 5 Steps</h2>
              <p className="sec-copy" style={{ margin:'0 auto' }}>
                A disciplined, traceable production process that ensures every jar and packet
                meets our uncompromising quality standards.
              </p>
            </Box>
            <Box className="lp-process-track">
              <Box className="lp-process-line" />
              {PROCESS.map((p,i) => (
                <Box key={p.step} className={`lp-process-step reveal${i%2===0?'':' lp-ps-alt'}`}
                  style={{ transitionDelay:`${i*80}ms` }}>
                  <Box className="lp-ps-connector">
                    <Box className="lp-ps-node" style={{ background:`${p.color}18`, border:`2.5px solid ${p.color}`, color:p.color }}>
                      <span className="lp-ps-step-num">{p.step}</span>
                    </Box>
                  </Box>
                  <Box className="lp-ps-card" style={{ '--psc':p.color }}>
                    <Box className="lp-ps-icon-wrap" style={{ background:`${p.color}18`, border:`1.5px solid ${p.color}28` }}>
                      <span className="lp-ps-icon">{p.icon}</span>
                    </Box>
                    <h4 className="lp-ps-title">{p.title}</h4>
                    <p className="lp-ps-desc">{p.desc}</p>
                    <Box className="lp-ps-bar" style={{ background:`linear-gradient(90deg,${p.color}44,${p.color})` }} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>

        {/* ══ REVIEWS ═══════════════════════════════════════════════════════ */}
        <Box id="reviews" className="lp-reviews-bg">
          <Container maxWidth="lg">
            <Box className="sec-head reveal">
              <p className="kicker" style={{ color:'#fcd34d' }}>Market Feedback</p>
              <h2 className="sec-title" style={{ color:'#f8fafc' }}>
                Trusted By Families &amp; Retail Partners
              </h2>
              <p className="sec-copy" style={{ color:'#94a3b8' }}>
                Consistent quality and disciplined dispatch have made our products a dependable shelf choice.
              </p>
            </Box>

            <Box className="lp-reviews-grid">
              {REVIEWS.map((r,i) => (
                <Box key={r.name} className="rv-card reveal" style={{ transitionDelay:`${i*80}ms` }}>
                  <Box className="rv-quote-icon">"</Box>
                  <Box className="rv-stars">
                    {[1,2,3,4,5].map(s => <Star key={s} sx={{ fontSize:'.88rem', color:'#fbbf24' }} />)}
                  </Box>
                  <p className="rv-text">{r.text}</p>
                  <Box className="rv-author">
                    <Avatar sx={{ bgcolor:r.bg, color:'#111', fontWeight:800, width:42, height:42, fontSize:'1.05rem' }}>
                      {r.init}
                    </Avatar>
                    <Box>
                      <Box sx={{ display:'flex', alignItems:'center', gap:'5px' }}>
                        <span className="rv-name">{r.name}</span>
                        <Verified sx={{ fontSize:'.8rem', color:'#3b82f6' }} />
                      </Box>
                      <span className="rv-loc">{r.city} · {r.role}</span>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Rating summary */}
            <Box className="rv-summary reveal">
              <Box className="rv-score-block">
                <span className="rv-big-num">4.9</span>
                <Box sx={{ display:'flex', gap:'3px', my:'6px' }}>
                  {[1,2,3,4,5].map(s => <Star key={s} sx={{ color:'#fbbf24', fontSize:'1.1rem' }} />)}
                </Box>
                <span className="rv-count-lbl">1,480+ verified reviews</span>
              </Box>
              <Box className="rv-bars">
                {[['5 stars',86],['4 stars',11],['3 stars',2],['2 stars',1]].map(([lbl,pct]) => (
                  <Box key={lbl} className="rv-bar-row">
                    <span className="rv-bar-lbl">{lbl}</span>
                    <Box className="rv-bar-track">
                      <Box className="rv-bar-fill" style={{ width:`${pct}%` }} />
                    </Box>
                    <span className="rv-bar-pct">{pct}%</span>
                  </Box>
                ))}
              </Box>
            </Box>
          </Container>
        </Box>

        {/* ══ CONTACT ═══════════════════════════════════════════════════════ */}
        <Box id="contact" className="lp-section lp-warm-bg">
          <Container maxWidth="lg">
            <Box className="sec-head reveal">
              <p className="kicker">Contact Factory Team</p>
              <h2 className="sec-title">Ready For Retail, Distribution &amp; Bulk Supply</h2>
            </Box>

            {/* Info cards */}
            <Box className="lp-cic-grid">
              {CONTACT_ITEMS.map(({ Icon, label, val, sub, color, href },i) => (
                <Box key={label} component="a" href={href}
                  className="cic reveal" style={{ transitionDelay:`${i*55}ms`, textDecoration:'none' }}>
                  <Box className="cic-icon-box" style={{ background:`${color}18`, border:`1.5px solid ${color}28`, color }}>
                    <Icon sx={{ fontSize:'1.2rem' }} />
                  </Box>
                  <Box>
                    <p className="cic-lbl">{label}</p>
                    <p className="cic-val">{val}</p>
                    <p className="cic-sub">{sub}</p>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Two-col layout: form left, info right */}
            <Box className="lp-contact-two-col">
              {/* Enquiry form */}
              <Box className="lp-enquiry-wrap reveal">
                <Box className="lp-eq-header">
                  <h3 className="lp-eq-title">Send an Enquiry</h3>
                  <p className="lp-eq-sub">Share your requirement for retail, wholesale, or partnership enquiries.</p>
                  <Box className="lp-eq-badges">
                    {['⚡ Response in 24 hrs','🤝 Dedicated support','📦 Wholesale onboarding'].map(b => (
                      <span key={b} className="lp-eq-badge">{b}</span>
                    ))}
                  </Box>
                </Box>
                <form onSubmit={onSubmit} className="lp-eq-grid">
                  {[
                    { id:'f-name', name:'name', label:'Full Name', type:'text', placeholder:'Your full name' },
                    { id:'f-phone',name:'phone',label:'Phone',     type:'tel',  placeholder:'+91 XXXXX XXXXX' },
                    { id:'f-email',name:'email',label:'Email',     type:'email',placeholder:'you@example.com' },
                  ].map(f => (
                    <div key={f.id} className="lp-ef">
                      <label htmlFor={f.id}>{f.label}</label>
                      <input id={f.id} name={f.name} type={f.type}
                        value={form[f.name]} onChange={onChange}
                        className="lp-ef-input" placeholder={f.placeholder} required />
                    </div>
                  ))}
                  <div className="lp-ef lp-ef-full">
                    <label htmlFor="f-msg">Requirement Details</label>
                    <textarea id="f-msg" name="message" value={form.message} onChange={onChange}
                      className="lp-ef-textarea" rows={4}
                      placeholder="Tell us your requirement, location, and expected quantity" required />
                  </div>
                  <div className="lp-ef-full lp-ef-actions">
                    <button type="submit" className="lp-ef-submit" disabled={submitting}>
                      {submitting ? 'Sending…' : '📨 Send Enquiry'}
                    </button>
                    {formSent  && <span className="lp-ef-ok">✅ Thanks! We'll contact you shortly.</span>}
                    {formError && <span className="lp-ef-err">⚠️ {formError}</span>}
                  </div>
                </form>
              </Box>

              {/* Right info panel */}
              <Box className="lp-contact-right reveal">
                <Box className="lp-cr-card">
                  <h4 className="lp-cr-title">Why Partner With Us?</h4>
                  <Box className="lp-cr-points">
                    {[
                      ['📦','Consistent stock availability across all SKUs'],
                      ['🚚','Timely dispatch with tracking for every order'],
                      ['🤝','Dedicated account manager for wholesale partners'],
                      ['💰','Competitive pricing with bulk order discounts'],
                      ['🔬','Certificate of Analysis with every batch'],
                      ['🏷️','Custom label and private labelling available'],
                    ].map(([ic,tx]) => (
                      <Box key={tx} className="lp-cr-point">
                        <span className="lp-cr-pt-icon">{ic}</span>
                        <span className="lp-cr-pt-text">{tx}</span>
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box className="lp-cr-hours">
                  <p className="lp-cr-hours-title">Business Hours</p>
                  <Box className="lp-cr-hours-grid">
                    {[
                      ['Monday – Saturday','9:00 AM – 7:00 PM'],
                      ['Sunday','Closed'],
                    ].map(([day,time]) => (
                      <Box key={day} className="lp-cr-hours-row">
                        <span>{day}</span><span className="lp-cr-time">{time}</span>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* ERP CTA stripe */}
            <Box className="lp-erp-cta reveal">
              <Box className="lp-erp-cta-glow" />
              <Box>
                <h4 className="lp-erp-title">Run Your Manufacturing On StockForge ERP</h4>
                <p className="lp-erp-sub">One integrated view of purchase, production, stock, sales, and dispatch.</p>
              </Box>
              <Button href="/login" variant="contained" className="lp-erp-btn" endIcon={<ArrowForward />}>
                Login To ERP
              </Button>
            </Box>
          </Container>
        </Box>

        {/* ══ FOOTER ════════════════════════════════════════════════════════ */}
        <Box className="lp-footer">
          <Container maxWidth="lg">
            <Box className="lp-footer-top">
              {/* Brand col */}
              <Box className="lp-ft-brand-col">
                <Box sx={{ display:'flex', alignItems:'center', gap:'11px', mb:'14px' }}>
                  <img src={brandLogo} alt="logo" className="lp-ft-logo" />
                  <Box>
                    <p className="lp-ft-name">Classic गृह उद्योग</p>
                    <p className="lp-ft-tagline">Sabse Best · Homemade Taste</p>
                  </Box>
                </Box>
                <p className="lp-ft-about">
                  Premium homemade-taste food products crafted with traditional recipes and
                  modern quality standards. Serving 1,200+ retail partners across India.
                </p>
                <Box className="lp-ft-social">
                  {['📘 Facebook','📸 Instagram','▶️ YouTube'].map(s => (
                    <a key={s} href="#" className="lp-ft-social-btn">{s}</a>
                  ))}
                </Box>
              </Box>
              {/* Link cols */}
              {FOOTER_COLS.map(col => (
                <Box key={col.title} className="lp-ft-link-col">
                  <p className="lp-ft-col-title">{col.title}</p>
                  {col.links.map(lnk => (
                    <a key={lnk} href="#" className="lp-ft-link">{lnk}</a>
                  ))}
                </Box>
              ))}
              {/* Newsletter col */}
              <Box className="lp-ft-nl-col">
                <p className="lp-ft-col-title">Stay Updated</p>
                <p className="lp-ft-nl-sub">Get new product launches and offers directly in your inbox.</p>
                <Box className="lp-ft-nl-form">
                  <input type="email" placeholder="Your email address" className="lp-ft-nl-input" />
                  <button className="lp-ft-nl-btn">Subscribe</button>
                </Box>
                <Box className="lp-ft-certbadges">
                  {['✅ FSSAI','🏭 ISO','🌿 Organic'].map(b => (
                    <span key={b} className="lp-ft-cert">{b}</span>
                  ))}
                </Box>
              </Box>
            </Box>

            <Box className="lp-footer-divider" />

            <Box className="lp-footer-bottom">
              <p className="lp-ft-copy">© 2026 Classic गृह उद्योग Food Industries. All rights reserved.</p>
              <Box className="lp-ft-bottom-links">
                {['Privacy Policy','Terms of Service','Sitemap'].map(l => (
                  <a key={l} href="#" className="lp-ft-bottom-link">{l}</a>
                ))}
              </Box>
              <p className="lp-ft-made">Crafted with ❤️ in Pune</p>
            </Box>
          </Container>
        </Box>

        {/* ══ FLOATING WHATSAPP ═════════════════════════════════════════════ */}
        <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer"
          className="lp-whatsapp-fab" aria-label="Chat on WhatsApp">
          <WhatsApp sx={{ fontSize:'1.8rem' }} />
          <span className="lp-wa-label">WhatsApp</span>
        </a>

      </Box>
    </ThemeProvider>
  );
}