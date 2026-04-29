import React from 'react';
import { ArrowRight, Menu, X, ShieldCheck, Scissors, TrendingUp, Activity, Tag, Check, Ruler, RefreshCw, Truck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

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
          setContent(contentSnap.data() as any);
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
            <a href="#home" className="hover:text-brand-bronze transition-colors text-[11px] uppercase tracking-[0.15em] font-medium">Home</a>
            <a href="#collection" className="hover:text-brand-bronze transition-colors text-[11px] uppercase tracking-[0.15em] font-medium">Collection</a>
            <a href="#care" className="hover:text-brand-bronze transition-colors text-[11px] uppercase tracking-[0.15em] font-medium">Care Guide</a>
            <a href="#gallery" className="hover:text-brand-bronze transition-colors text-[11px] uppercase tracking-[0.15em] font-medium">Gallery</a>
            <a href="#collection" className="border border-brand-charcoal text-brand-charcoal px-8 py-3 text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-brand-charcoal hover:text-white transition-colors">
              Cek Koleksi
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
             <a href="#home" onClick={() => setIsOpen(false)} className="block text-sm uppercase tracking-widest font-medium hover:text-brand-bronze">Home</a>
             <a href="#collection" onClick={() => setIsOpen(false)} className="block text-sm uppercase tracking-widest font-medium hover:text-brand-bronze">Collection</a>
             <a href="#care" onClick={() => setIsOpen(false)} className="block text-sm uppercase tracking-widest font-medium hover:text-brand-bronze">Care Guide</a>
             <a href="#gallery" onClick={() => setIsOpen(false)} className="block text-sm uppercase tracking-widest font-medium hover:text-brand-bronze">Gallery</a>
             <a href="#collection" onClick={() => setIsOpen(false)} className="block w-full text-center bg-brand-charcoal text-white px-3 py-4 mt-6 text-sm uppercase tracking-widest font-medium">
              Cek Koleksi
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
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  
  return (
    <section id="home" className="relative min-h-screen flex flex-col lg:flex-row items-center bg-brand-canvas pt-24 lg:pt-0">
      
      {/* Left Side: Text Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-16 xl:px-24 py-12 lg:py-32 relative z-10 lg:mt-0">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full max-w-2xl space-y-10"
        >
          <div className="space-y-6">
            <span className="text-brand-bronze font-mono uppercase tracking-[0.2em] text-[10px] sm:text-xs">Authentic & Premium Imports</span>
            <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] xl:text-[6rem] font-serif text-brand-charcoal leading-[0.9] tracking-tight">
              {headlineParts[0]}
              <br />
              <span className="italic font-light lg:ml-12 text-stone-400">{headlineParts.length > 1 ? ` dalam ${headlineParts[1]}` : content.tagline}</span>
            </h1>
          </div>
          <p className="text-base sm:text-lg text-stone-500 max-w-md leading-relaxed font-light lg:ml-12">
            {content.description}
          </p>
          <div className="pt-6 lg:ml-12">
            <a href="#collection" className="inline-flex items-center justify-center gap-4 bg-brand-charcoal text-white px-10 py-5 text-[11px] tracking-[0.2em] uppercase hover:bg-black transition-all group">
              <span>Explore Catalog</span> 
              <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Full Height Image Section */}
      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 1.5, delay: 0.2 }}
        className="w-full lg:w-1/2 relative h-[50vh] lg:h-screen lg:min-h-screen origin-center overflow-hidden"
      >
        <motion.div style={{ y }} className="absolute -top-[300px] -bottom-[300px] left-0 right-0 bg-brand-charcoal">
          <motion.img 
            src="https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=2070&auto=format&fit=crop" 
            alt="Premium denim"
            initial={{ scale: 1 }}
            animate={{ scale: 1.1 }}
            transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            className="w-full h-full object-cover filter brightness-95 opacity-90 object-top lg:object-center"
          />
        </motion.div>
      </motion.div>
      
    </section>
  );
}

function WhySection() {
  const points = [
    { icon: ShieldCheck, title: "Bahan Premium", desc: "Denim berkualitas tinggi yang teruji secara ketat." },
    { icon: Scissors, title: "Jahitan Rapi", desc: "Detail presisi kuat untuk keawetan pemakaian panjang." },
    { icon: TrendingUp, title: "Desain Kekinian", desc: "Potongan Slim, Regular, dan Skinny Fit maskulin modern." },
  ];
  const points2 = [
    { icon: Activity, title: "Nyaman Dipakai", desc: "Material lentur yang sama sekali tidak membatasi gerak." },
    { icon: Tag, title: "Harga Bersahabat", desc: "Kualitas mewah internasional, dengan harga rasional." },
  ]

  return (
    <section className="py-32 bg-brand-charcoal text-brand-canvas relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="text-brand-bronze font-mono uppercase tracking-[0.2em] text-xs mb-4 block">Craftsmanship</span>
            <h2 className="text-5xl lg:text-7xl font-serif text-brand-canvas leading-none">Why <br/><span className="italic text-stone-400">NAKADUO?</span></h2>
          </div>
          <p className="text-stone-400 font-light max-w-sm text-sm leading-relaxed md:text-right">
            Kami mengedepankan kualitas dan ketangguhan. Denim impor asli dengan kurasi ketat untuk menjamin daya tahan puluhan tahun.
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

function CollectionSection({ products, waAdmin }: { products: any[], waAdmin: string }) {
  const formatIDR = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <section id="collection" className="py-32 bg-stone-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-20 pb-8 border-b border-stone-200">
          <div>
            <span className="text-brand-bronze font-mono uppercase tracking-[0.2em] text-[10px] mb-4 block">The Collection</span>
            <h2 className="text-5xl lg:text-7xl font-serif text-brand-charcoal mb-4">Katalog <span className="italic font-light">Impor</span></h2>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 border border-stone-200 bg-white">
             <p className="text-stone-500 font-mono text-xs uppercase tracking-widest">Belum ada produk. Tambahkan produk melalui dashboard Admin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
            {products.map((p, idx) => (
              <motion.div 
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8, ease: "easeOut" }}
                className="group flex flex-col bg-white border border-transparent hover:border-stone-200 transition-all duration-500 shadow-sm hover:shadow-[0_30px_60px_rgba(26,26,26,0.12)] hover:-translate-y-2 hover:scale-[1.02] relative"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                  {p.imageUrl ? (
                    <img 
                      src={p.imageUrl} 
                      alt={p.name} 
                      className="w-full h-full object-cover object-center scale-100 group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300 font-mono text-xs uppercase">No Image</div>
                  )}
                  {p.countryOfOrigin && (
                    <div className="absolute top-0 right-0 bg-brand-charcoal text-white text-[9px] font-mono px-3 py-1.5 tracking-[0.15em] uppercase">
                      {p.countryOfOrigin}
                    </div>
                  )}
                  
                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-brand-charcoal/0 group-hover:bg-brand-charcoal/10 transition-colors duration-500"></div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
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
                <span className="text-brand-bronze font-mono uppercase tracking-[0.2em] text-[10px] mb-4 block">Longevity</span>
                <h2 className="text-5xl lg:text-7xl font-serif text-brand-charcoal mb-6 leading-none">Denim <br/><span className="italic font-light text-stone-400">Care Guide</span></h2>
                <p className="text-stone-500 text-lg font-light leading-relaxed max-w-md">Rawat denim Anda dengan benar untuk mempertahankan warna asli dan tekstur kuatnya selama bertahun-tahun.</p>
             </div>
             
             <div className="aspect-square bg-stone-200 overflow-hidden shrink-0 hidden lg:block">
               <img src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1974&auto=format&fit=crop" className="w-full h-full object-cover filter grayscale opacity-80 mix-blend-multiply" alt="Care Guide" />
             </div>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-12">
            <div className="group border-l-2 border-transparent hover:border-brand-bronze pl-6 transition-colors duration-300">
               <div className="text-brand-bronze text-sm font-mono tracking-widest mb-3">#01</div>
               <h3 className="text-2xl font-serif mb-3 text-brand-charcoal group-hover:text-black transition-colors">Pencucian Air Dingin</h3>
               <p className="text-stone-500 text-sm font-light leading-relaxed max-w-md">Gunakan air dingin dengan siklus putaran lembut untuk mencegah penyusutan dan pemudaran warna berlebih. Secara teratur, balik bagian dalam ke luar sebelum dicuci.</p>
            </div>
            <div className="group border-l-2 border-transparent hover:border-brand-bronze pl-6 transition-colors duration-300">
               <div className="text-brand-bronze text-sm font-mono tracking-widest mb-3">#02</div>
               <h3 className="text-2xl font-serif mb-3 text-brand-charcoal group-hover:text-black transition-colors">Jemur Alami Terbalik</h3>
               <p className="text-stone-500 text-sm font-light leading-relaxed max-w-md">Hindari mesin pengering bersuhu panas. Jemur celana dalam keadaan terbalik (inside-out) di tempat teduh agar serat tetap kuat dan bebas jamur.</p>
            </div>
            <div className="group border-l-2 border-transparent hover:border-brand-bronze pl-6 transition-colors duration-300">
               <div className="text-brand-bronze text-sm font-mono tracking-widest mb-3">#03</div>
               <h3 className="text-2xl font-serif mb-3 text-brand-charcoal group-hover:text-black transition-colors">Setrika Suhu Rendah</h3>
               <p className="text-stone-500 text-sm font-light leading-relaxed max-w-md">Jika sangat perlu disetrika, gunakan suhu paling rendah, atau setrika saat celana masih setengah lembab untuk menghindari kilap pada permukaan denim.</p>
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
          <span className="text-brand-bronze font-mono uppercase tracking-[0.2em] text-[10px] mb-4 block">Visual Evidence</span>
          <h2 className="text-5xl lg:text-6xl font-serif text-brand-canvas mb-4 tracking-tight">Testimoni & <span className="italic font-light">Gallery</span></h2>
          <p className="text-stone-400 font-light max-w-lg mx-auto">Jejak kepuasan pelanggan dan keaslian produk NAKADUO. Bukti dari kualitas yang berbicara sendiri.</p>
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
             <p className="font-serif italic text-lg leading-relaxed mb-6">"Bahannya tebal tapi tidak kaku. Jahitannya sangat persis seperti barang branded mall. Kualitas elit."</p>
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
             <p className="font-serif italic text-lg leading-relaxed mb-6">"Fitting slim-nya pas banget di kaki. Pengiriman juga super ngebut. Ini pembelian kedua saya."</p>
             <span className="text-stone-500 font-mono text-[10px] uppercase tracking-widest">- Arya, Surabaya</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    { q: "Bagaimana cara menentukan ukuran yang tepat?", a: "Kami menyediakan Size Chart akurat di setiap deskripsi produk Marketplace kami. Disarankan mengukur lingkar pinggang celana lama Anda sebagai perbandingan." },
    { q: "Apakah melayani pengiriman ke seluruh Indonesia?", a: "Tentu. Kami bekerjasama dengan kurir terpercaya untuk memastikan paket denim Anda sampai dengan aman dan cepat, dari Sabang sampai Merauke." },
    { q: "Apakah ada garansi penukaran barang?", a: "Ya, kami menerima retur size (Tukar Ukuran) maksimal H+2 setelah barang diterima, dengan syarat tag belum dilepas dan celana belum dicuci." }
  ];

  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-32 bg-brand-canvas">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-brand-bronze font-mono uppercase tracking-[0.2em] text-[10px] mb-4 block">Information</span>
          <h2 className="text-4xl font-serif text-brand-charcoal">Frequently Asked Questions</h2>
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
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Shipping</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
