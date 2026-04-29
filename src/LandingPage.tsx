import React from 'react';
import { ArrowRight, Menu, X, ShieldCheck, Scissors, TrendingUp, Activity, Tag, Check, Ruler, RefreshCw, Truck } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function LandingPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [content, setContent] = useState({
    headline: "Investasi Gaya dalam Setiap Langkahmu.",
    description: "Koleksi celana denim dan streetwear impor pilihan dengan kualitas material premium untuk tampilan keren dan percaya diri setiap hari.",
    tagline: "Setiap Langkahmu.",
  });
  const [settings, setSettings] = useState({
    faviconUrl: "",
    logoUrl: "",
    waAdmin: "0895630454035"
  });

  useEffect(() => {
    async function loadData() {
      try {
        const productsSnap = await getDocs(collection(db, 'products'));
        const productsData = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsData);
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'products');
      }

      try {
        const contentSnap = await getDoc(doc(db, 'siteContent', 'landingPage'));
        if (contentSnap.exists()) {
          const data = contentSnap.data() as any;
          if (data.headline === "Investasi Gaya dalam Setiap Langkahmu.") {
             const newContent = {
                headline: "Esensi Ketegasan dalam Gaya Autentik.",
                description: "Dikurasi khusus untuk pria yang memahami bahwa kualitas tidak bisa dikompromikan. Koleksi denim impor dan streetwear dengan material premium yang membentuk karakter Anda.",
                tagline: "Gaya Autentik.",
                updatedAt: new Date().toISOString()
             };
             // Optional: Don't strictly await the setDoc to not block render, but it should be fast
             setDoc(doc(db, 'siteContent', 'landingPage'), newContent, { merge: true }).catch(console.error);
             setContent(newContent);
          } else {
             setContent(data);
          }
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'siteContent/landingPage');
      }
      
      try {
        const settingsSnap = await getDoc(doc(db, 'settings', 'general'));
        if (settingsSnap.exists()) {
          setSettings(settingsSnap.data() as any);
        }
      } catch (err) {
        // ignore if not setup yet
      }
    }
    loadData();
  }, []);

  return (
    <div className="bg-brand-canvas min-h-screen selection:bg-brand-bronze selection:text-white">
      <Helmet>
        <title>NAKADUO | Premium Imported Denim & Streetwear</title>
        <meta name="description" content={content.description || "Koleksi denim impor premium dan streetwear autentik dengan kualitas tanpa kompromi."} />
        <meta name="keywords" content={(content as any).metaKeywords || "denim impor, raw denim, selvedge denim, streetwear pria, celana jeans premium, jaket denim, fashion pria modern, NAKADUO"} />
        {(content as any).metaAuthor && <meta name="author" content={(content as any).metaAuthor} />}
        <meta property="og:title" content="NAKADUO | Premium Imported Denim & Streetwear" />
        <meta property="og:description" content={content.description || "Koleksi denim impor premium dan streetwear autentik dengan kualitas tanpa kompromi."} />
        <meta property="og:url" content="https://nakaduo.com/" />
      </Helmet>
      <Navbar />
      <main>
        <Hero content={content} />
        <WhySection />
        <CollectionSection products={products} waAdmin={settings.waAdmin} />
        <CareGuideSection />
        <GallerySection />
        <FAQSection />
      </main>
      <Footer waAdmin={settings.waAdmin} />
    </div>
  );
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="fixed w-full z-50 bg-brand-canvas/90 backdrop-blur-xl text-brand-charcoal border-b border-brand-charcoal/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div className="flex-shrink-0 flex items-center">
            <span className="font-serif text-2xl font-semibold tracking-[0.2em] text-brand-charcoal">NAKADUO<span className="text-brand-bronze font-sans">.</span></span>
          </div>
          <div className="hidden md:flex items-center space-x-10">
            <a href="#home" className="hover:text-brand-bronze transition-colors text-[11px] uppercase tracking-[0.15em] font-medium">Beranda</a>
            <a href="#collection" className="hover:text-brand-bronze transition-colors text-[11px] uppercase tracking-[0.15em] font-medium">Koleksi</a>
            <a href="#care" className="hover:text-brand-bronze transition-colors text-[11px] uppercase tracking-[0.15em] font-medium">Panduan</a>
            <a href="#gallery" className="hover:text-brand-bronze transition-colors text-[11px] uppercase tracking-[0.15em] font-medium">Galeri</a>
            <Link to="/blog" className="hover:text-brand-bronze transition-colors text-[11px] uppercase tracking-[0.15em] font-medium">Jurnal</Link>
            <a href="#collection" className="border border-brand-charcoal text-brand-charcoal px-8 py-3 text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-brand-charcoal hover:text-white transition-colors">
              Jelajahi Koleksi
            </a>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-brand-charcoal focus:outline-none">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-brand-canvas border-t border-brand-charcoal/5">
          <div className="px-4 pt-4 pb-8 space-y-6">
             <a href="#home" onClick={() => setIsOpen(false)} className="block text-sm uppercase tracking-widest font-medium hover:text-brand-bronze">Beranda</a>
             <a href="#collection" onClick={() => setIsOpen(false)} className="block text-sm uppercase tracking-widest font-medium hover:text-brand-bronze">Koleksi</a>
             <a href="#care" onClick={() => setIsOpen(false)} className="block text-sm uppercase tracking-widest font-medium hover:text-brand-bronze">Panduan</a>
             <a href="#gallery" onClick={() => setIsOpen(false)} className="block text-sm uppercase tracking-widest font-medium hover:text-brand-bronze">Galeri</a>
             <Link to="/blog" onClick={() => setIsOpen(false)} className="block text-sm uppercase tracking-widest font-medium hover:text-brand-bronze">Jurnal</Link>
             <a href="#collection" onClick={() => setIsOpen(false)} className="block w-full text-center bg-brand-charcoal text-white px-3 py-4 mt-6 text-sm uppercase tracking-widest font-medium">
              Jelajahi Koleksi
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

function Hero({ content }: { content: any }) {
  const headlineParts = content.headline.split('dalam');
  const { scrollY } = useScroll();
  const floatY = useTransform(scrollY, [0, 500], [0, -50]);
  const mainImageParallax = useTransform(scrollY, [0, 1000], [0, 120]);
  
  return (
    <section id="home" className="relative min-h-[100svh] flex flex-col lg:flex-row items-center justify-center bg-brand-charcoal pt-32 lg:pt-32 pb-20 overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-stone-800/50 rounded-full blur-[100px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2a2a2a]/40 rounded-full blur-[100px] mix-blend-screen"></div>
      </div>

      <div className="max-w-[90rem] mx-auto w-full px-4 sm:px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative z-10">
        
        {/* Left Typography */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-5/12 flex flex-col justify-center"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="w-12 h-px bg-brand-bronze"></span>
            <span className="text-brand-bronze font-mono uppercase tracking-[0.25em] text-[10px] sm:text-xs font-semibold">Premium Imports</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-serif text-white leading-[1.05] tracking-[-0.02em] mb-8">
            {headlineParts[0]}
            <br />
            <span className="italic font-light text-stone-400 lg:pl-12 sm:pl-8 block mt-2">
              {headlineParts.length > 1 ? `dalam ${headlineParts[1]}` : content.tagline}
            </span>
          </h1>
          
          <p className="text-base sm:text-lg text-stone-400 max-w-md leading-relaxed font-light mb-10 border-l border-brand-bronze/30 pl-6 ml-2">
            {content.description}
          </p>

          <div className="flex flex-wrap items-center gap-8 ml-2">
            <a href="#collection" className="inline-flex items-center justify-center gap-4 bg-white text-brand-charcoal px-8 py-4 text-[10px] sm:text-xs tracking-[0.2em] uppercase hover:bg-brand-bronze hover:text-white transition-all duration-500 group shadow-xl hover:-translate-y-1">
              <span>Jelajahi Koleksi</span> 
              <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
            </a>
            <a href="#gallery" className="text-[10px] sm:text-xs font-mono tracking-[0.15em] uppercase text-stone-400 hover:text-white transition-colors flex items-center gap-2 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[1px] after:bg-brand-bronze/0 hover:after:bg-brand-bronze/100 after:transition-all">
              Lihat Galeri
            </a>
          </div>
        </motion.div>

        {/* Right Images (Editorial Collage) */}
        <div className="w-full lg:w-7/12 relative h-[50vh] sm:h-[60vh] lg:h-[75vh] mt-10 lg:mt-0 flex-shrink-0">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 right-0 w-[85%] sm:w-[80%] h-[90%] sm:h-[95%] bg-stone-200 overflow-hidden shadow-2xl"
          >
            <motion.img 
              style={{ y: mainImageParallax }}
              src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1974&auto=format&fit=crop" 
              alt="Premium denim"
              initial={{ scale: 1.15 }}
              animate={{ scale: 1.1 }}
              transition={{ duration: 2.5, ease: "easeOut" }}
              className="w-full h-full object-cover object-center filter contrast-110 saturate-50 origin-top"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-charcoal/40 via-transparent to-transparent pointer-events-none"></div>
          </motion.div>

          {/* Overlapping offset image */}
          <motion.div 
            initial={{ opacity: 0, x: -30, y: 30 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-[2%] sm:bottom-0 left-0 w-[55%] h-[50%] sm:h-[60%] bg-stone-100 overflow-hidden shadow-2xl border-4 sm:border-8 border-brand-charcoal"
            style={{ y: floatY }}
          >
            <img 
              src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=2070&auto=format&fit=crop" 
              alt="Denim texture details"
              className="w-full h-full object-cover object-center filter grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>

          {/* Small accent badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 1, type: "spring" }}
            className="absolute top-[8%] sm:top-[25%] left-[-2%] sm:left-[5%] bg-brand-charcoal rounded-full p-4 shadow-xl text-center aspect-square flex flex-col justify-center items-center h-24 w-24 sm:h-28 sm:w-28 z-20 border border-brand-bronze/30"
          >
             <span className="text-[10px] sm:text-xs font-serif italic text-white leading-none mb-1">Authentic</span>
             <span className="text-sm sm:text-base font-bold text-brand-bronze leading-none font-mono">DENIM</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  const points = [
    { icon: ShieldCheck, title: "Material Autentik", desc: "Denim impor kelas berat dan material dengan durabilitas tinggi yang teruji untuk pemakaian ekstrem." },
    { icon: Scissors, title: "Konstruksi Presisi", desc: "Kekuatan jahitan rantai dan perkuatan struktur untuk keawetan mutlak tanpa kompromi." },
    { icon: TrendingUp, title: "Siluet Modern", desc: "Potongan arsitektural yang dirancang khusus untuk menyempurnakan postur dengan gaya kontemporer." },
  ];
  const points2 = [
    { icon: Activity, title: "Kenyamanan Maksimal", desc: "Tenunan inovatif yang memberikan fleksibilitas pergerakan tanpa mengorbankan ketebalan fabrik." },
    { icon: Tag, title: "Nilai Tanpa Tanding", desc: "Standar craftsmanship luxury internasional, dengan aksesibilitas harga yang sepenuhnya rasional." },
  ]

  return (
    <section className="py-32 bg-brand-charcoal text-brand-canvas relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="text-brand-bronze font-mono uppercase tracking-[0.2em] text-xs mb-4 block">Standar Tanpa Kompromi</span>
            <h2 className="text-5xl lg:text-7xl font-serif text-brand-canvas leading-none">Kualitas <br/><span className="italic text-stone-400">Tanpa Kompromi</span></h2>
          </div>
          <p className="text-stone-400 font-light max-w-sm text-sm leading-relaxed md:text-right">
            Seluruh koleksi kami melalui proses kurasi ketat, memastikan setiap elemen dari material hingga jahitan merepresentasikan standar pergerakan gaya hidup modern.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-8 mb-12">
          {points.map((pt, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col border-t border-brand-canvas/10 pt-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <pt.icon className="h-6 w-6 text-brand-bronze" strokeWidth={1.5} />
                <h3 className="text-lg font-serif tracking-wide">{pt.title}</h3>
              </div>
              <p className="text-sm text-stone-400 font-light leading-relaxed">{pt.desc}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
           {points2.map((pt, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col border-t border-brand-canvas/10 pt-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <pt.icon className="h-6 w-6 text-brand-bronze" strokeWidth={1.5} />
                <h3 className="text-lg font-serif tracking-wide">{pt.title}</h3>
              </div>
              <p className="text-sm text-stone-400 font-light leading-relaxed">{pt.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ p, idx, waAdmin, formatIDR }: { p: any, idx: number, waAdmin: string, formatIDR: (price: number) => string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1, duration: 0.8, ease: "easeOut" }}
      className="group flex flex-col bg-white border border-transparent hover:border-stone-200 transition-all duration-500 shadow-sm hover:shadow-[0_30px_60px_rgba(26,26,26,0.12)] hover:-translate-y-2 hover:scale-[1.02] relative"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
        {p.imageUrl ? (
          <motion.img 
            style={{ y }}
            src={p.imageUrl} 
            alt={p.name} 
            className="absolute top-[-20%] left-0 w-full h-[140%] object-cover object-center group-hover:scale-105 transition-transform duration-[1.5s] ease-out origin-center"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300 font-mono text-xs uppercase relative z-10">No Image</div>
        )}
        {p.countryOfOrigin && (
          <div className="absolute top-0 right-0 bg-brand-charcoal text-white text-[9px] z-20 font-mono px-3 py-1.5 tracking-[0.15em] uppercase">
            {p.countryOfOrigin}
          </div>
        )}
        
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-brand-charcoal/0 group-hover:bg-brand-charcoal/10 transition-colors duration-500 pointer-events-none z-10"></div>
      </div>
      
      <div className="p-8 flex flex-col flex-grow relative z-20 bg-white">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-serif text-brand-charcoal">{p.name}</h3>
          <p className="text-brand-charcoal font-medium text-lg tracking-wide">{formatIDR(p.price)}</p>
        </div>
        
        <div className="flex items-center gap-4 text-[10px] font-mono text-stone-500 uppercase tracking-widest mb-8">
          <span className="border border-stone-200 px-2 py-1">{p.fit}</span>
          <span>Stok: <span className="text-brand-charcoal font-semibold">{p.stock}</span></span>
        </div>
        
        <div className="mt-auto grid grid-cols-2 gap-3 opacity-90 group-hover:opacity-100 transition-opacity">
          <a 
            href={`https://wa.me/${waAdmin}?text=Halo%20Admin%20NAKADUO,%20saya%20tertarik%20dengan%20produk%20${encodeURIComponent(p.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-2 bg-brand-charcoal text-white text-center py-4 text-[10px] tracking-[0.15em] font-medium uppercase hover:bg-black transition-colors border border-brand-charcoal"
          >
            Beli via WhatsApp
          </a>
          {p.marketplaceLink && (
             <a 
               href={p.marketplaceLink}
               target="_blank"
               rel="noopener noreferrer"
               className="col-span-2 bg-transparent text-brand-charcoal text-center py-3 text-[10px] tracking-[0.15em] font-medium uppercase hover:bg-stone-50 transition-colors border border-stone-200"
             >
               Lihat di Marketplace
             </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function CollectionSection({ products, waAdmin }: { products: any[], waAdmin: string }) {
  const formatIDR = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <section id="collection" className="py-32 bg-stone-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-20 pb-8 border-b border-stone-200">
          <div>
            <span className="text-brand-bronze font-mono uppercase tracking-[0.2em] text-[10px] mb-4 block">Katalog Arsip</span>
            <h2 className="text-5xl lg:text-7xl font-serif text-brand-charcoal mb-4">Investasi <span className="italic font-light">Sartorial</span></h2>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 border border-stone-200 bg-white">
             <p className="text-stone-500 font-mono text-[10px] uppercase tracking-widest">Katalog Saat Ini Kosong. Harap Lakukan Kurasi Produk melalui Dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
            {products.map((p, idx) => (
              <ProductCard key={p.id} p={p} idx={idx} waAdmin={waAdmin} formatIDR={formatIDR} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CareGuideSection() {
  return (
    <section id="care" className="py-32 bg-brand-canvas text-brand-charcoal relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          <div className="flex-1">
             <div className="mb-16">
                <span className="text-brand-bronze font-mono uppercase tracking-[0.2em] text-[10px] mb-4 block">Manifesto Durabilitas</span>
                <h2 className="text-5xl lg:text-7xl font-serif text-brand-charcoal mb-6 leading-none">Seni <br/><span className="italic font-light text-stone-400">Preservasi</span></h2>
                <p className="text-stone-500 text-lg font-light leading-relaxed max-w-md">Karakter sesungguhnya lahir dari perjalanan, bukan etalase. Pahami protokol perawatan esensial untuk merawat mahakarya denim Anda agar fudar menua dengan estetika maksimal.</p>
             </div>
             
             <div className="aspect-square bg-stone-200 overflow-hidden shrink-0 hidden lg:block">
               <img src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1974&auto=format&fit=crop" className="w-full h-full object-cover filter grayscale opacity-80 mix-blend-multiply" alt="Care Guide" />
             </div>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-12">
            <div className="group border-l-2 border-transparent hover:border-brand-bronze pl-6 transition-colors duration-300">
               <div className="text-brand-bronze text-sm font-mono tracking-widest mb-3">#01</div>
               <h3 className="text-2xl font-serif mb-3 text-brand-charcoal group-hover:text-black transition-colors">Ritual Air Dingin</h3>
               <p className="text-stone-500 text-sm font-light leading-relaxed max-w-md">Sebuah purifikasi. Gunakan air bersuhu rendah guna mempertahankan integritas benang ikat indigo, meminimalisasi penyusutan struktural, dan menstabilkan kontras warna.</p>
            </div>
            <div className="group border-l-2 border-transparent hover:border-brand-bronze pl-6 transition-colors duration-300">
               <div className="text-brand-bronze text-sm font-mono tracking-widest mb-3">#02</div>
               <h3 className="text-2xl font-serif mb-3 text-brand-charcoal group-hover:text-black transition-colors">Pengeringan Natural</h3>
               <p className="text-stone-500 text-sm font-light leading-relaxed max-w-md">Hindari agresi mesin termal. Proses pengeringan harus dilakukan secara bertahap dalam konfigurasi terbalik (inside-out) pada sirkulasi udara terbuka, melindungi serat kapas murni dari kelelahan material.</p>
            </div>
            <div className="group border-l-2 border-transparent hover:border-brand-bronze pl-6 transition-colors duration-300">
               <div className="text-brand-bronze text-sm font-mono tracking-widest mb-3">#03</div>
               <h3 className="text-2xl font-serif mb-3 text-brand-charcoal group-hover:text-black transition-colors">Restorasi Tekstur</h3>
               <p className="text-stone-500 text-sm font-light leading-relaxed max-w-md">Biarkan gravitasi bekerja. Jika intervensi mekanis dibutuhkan, aplikasikan penetrasi uap suhu rendah perlahan dari lapisan interior, memastikan tekstur mentah (raw texture) tidak tergantikan oleh kilap sintetis.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GallerySection() {
  return (
    <section id="gallery" className="py-32 bg-brand-charcoal text-brand-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-brand-bronze font-mono uppercase tracking-[0.2em] text-[10px] mb-4 block">Kurasi Dokumenter</span>
          <h2 className="text-5xl lg:text-6xl font-serif text-brand-canvas mb-4 tracking-tight">Arsip <span className="italic font-light">Representasi</span></h2>
          <p className="text-stone-400 font-light max-w-lg mx-auto">Rekam jejak mereka yang memahami nilai dari material superior. Lebih dari sekadar pakaian, ini tentang pernyataan karakter absolut.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-[1px] auto-rows-[300px] bg-brand-charcoal border border-brand-canvas/10">
          <div className="md:col-span-2 md:row-span-2 bg-stone-900 relative group overflow-hidden">
             <img src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover filter brightness-75 transition-all duration-[2s] group-hover:scale-105 group-hover:brightness-100" alt="Store stocks" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-bottom p-8 flex-col justify-end">
                <span className="text-white font-serif text-2xl mb-2">Gudang Penyimpanan</span>
                <span className="text-stone-400 font-mono text-[10px] uppercase tracking-widest">In-house inventory control</span>
             </div>
          </div>
          <div className="bg-brand-canvas p-10 flex flex-col justify-center text-brand-charcoal">
             <div className="flex gap-1 mb-6">
               {[1,2,3,4,5].map(i => <span key={i} className="text-brand-charcoal text-xs">★</span>)}
             </div>
             <p className="font-serif italic text-lg leading-relaxed mb-6">"Arsitektur potongan sangat presisi. Ketebalan material memberi bobot premium namun tetap memfasilitasi artikulasi gerak dinamis. Absolute masterpiece."</p>
             <span className="text-stone-500 font-mono text-[10px] uppercase tracking-widest">- Bima, Jakarta</span>
          </div>
          <div className="bg-stone-900 relative group overflow-hidden">
             <img src="https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?q=80&w=1974&auto=format&fit=crop" className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-1000" alt="Detail" />
          </div>
          <div className="bg-stone-900 relative group overflow-hidden">
             <img src="https://images.unsplash.com/photo-1604147706283-d7119b5b822c?q=80&w=1974&auto=format&fit=crop" className="w-full h-full object-cover filter brightness-75 group-hover:brightness-100 transition-all duration-1000" alt="Detail" />
          </div>
          <div className="bg-[#111111] p-10 flex flex-col justify-center text-brand-canvas">
             <div className="flex gap-1 mb-6">
               {[1,2,3,4,5].map(i => <span key={i} className="text-brand-bronze text-xs">★</span>)}
             </div>
             <p className="font-serif italic text-lg leading-relaxed mb-6">"Siluet konstruksinya di luar ekspektasi, merekonstruksi postur menjadi jauh lebih terstruktur dan tajam. Ini standar yang saya cari."</p>
             <span className="text-stone-500 font-mono text-[10px] uppercase tracking-widest">- Arya, Surabaya</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    { q: "Bagaimana cara menentukan kesesuaian fitting secara absolut?", a: "Setiap spesifikasi garmen kami dilengkapi topografi dimensi yang detail. Kami merekomendasikan kalibrasi menyilang dengan mengukur perimeter garmen andalan Anda, demi memastikan tingkat fiksasi yang paripurna." },
    { q: "Apakah logistik pengiriman menjangkau area operasional terluar?", a: "Tentu. Kami mengutilisasi infrastruktur logistik tier-1 nasional dengan sistem pelacakan mutakhir, menjamin akuisisi produk dengan kompromi cacat nol ke semua titik demografis Indonesia." },
    { q: "Bagaimana terminologi garansi dan kebijakan penukaran diatur?", a: "Kesesuaian adalah hak mutlak Anda. Kami memfasilitasi asimilasi penggantian siluet (size-exchange) dengan tenggat 48 jam paska konfirmasi akuisisi, mensyaratkan preservasi kondisi fabrik orisinal (unwashed, original tagging intact)." }
  ];

  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-32 bg-brand-canvas">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-brand-bronze font-mono uppercase tracking-[0.2em] text-[10px] mb-4 block">Inkuiri Esensial</span>
          <h2 className="text-4xl font-serif text-brand-charcoal">Informasi Eksklusif</h2>
        </div>
        
        <div className="space-y-0 border-y border-brand-charcoal/10">
          {faqs.map((faq, idx) => (
             <div key={idx} className="border-b border-brand-charcoal/10 last:border-b-0">
                <button 
                  onClick={() => setOpen(open === idx ? null : idx)}
                  className="w-full flex justify-between items-center py-8 text-left focus:outline-none"
                >
                  <span className="text-lg font-serif text-brand-charcoal tracking-wide">{faq.q}</span>
                  <span className="text-brand-charcoal font-light text-2xl w-8 text-right">{open === idx ? '−' : '+'}</span>
                </button>
                {open === idx && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pb-8 text-stone-500 font-light leading-relaxed max-w-2xl"
                  >
                    {faq.a}
                  </motion.div>
                )}
             </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer({ waAdmin }: { waAdmin: string }) {
  return (
    <footer className="bg-brand-charcoal text-brand-canvas py-20 border-t border-brand-charcoal/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
           <div className="max-w-xs">
             <h2 className="font-serif text-3xl tracking-[0.2em] text-brand-canvas mb-6">NAKADUO<span className="text-brand-bronze font-sans">.</span></h2>
             <p className="text-stone-400 text-sm font-light leading-relaxed">Pilih yang Terbaik, Rasakan Perbedaannya! Butik denim impor & premium streetwear pilihan untuk standar pria modern.</p>
           </div>
           <div className="flex flex-col md:text-right space-y-8">
             <div>
               <h3 className="text-white font-mono text-[10px] tracking-[0.15em] uppercase mb-3">Workshop & Store</h3>
               <p className="text-stone-400 font-light text-sm">Jombang, Blok C2 No. 8</p>
             </div>
             <div>
                <h3 className="text-white font-mono text-[10px] tracking-[0.15em] uppercase mb-3">Client Services</h3>
                <a href={`https://wa.me/${waAdmin}`} target="_blank" rel="noopener noreferrer" className="text-brand-canvas hover:text-brand-bronze transition-colors text-sm font-light border-b border-transparent hover:border-brand-bronze pb-1">
                  WhatsApp: +62 {waAdmin.startsWith('0') ? waAdmin.substring(1) : waAdmin}
                </a>
             </div>
           </div>
        </div>
        <div className="pt-8 border-t border-brand-canvas/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono tracking-widest text-stone-500 uppercase">
          <span>© {new Date().getFullYear()} NAKADUO. All rights reserved.</span>
          <div className="space-x-6">
            <Link to="/blog" className="hover:text-white transition-colors">Journal</Link>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Shipping</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
