import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType, loginWithGoogle, logout } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { LayoutDashboard, LogOut, Settings, Package, FileText, LayoutTemplate, Save, Plus, Trash2, Image as ImageIcon, Eye } from 'lucide-react';

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');

  // Content State
  const [content, setContent] = useState<any>({
    headline: "Esensi Ketegasan dalam Gaya Autentik.",
    description: "Dikurasi khusus untuk pria yang memahami bahwa kualitas tidak bisa dikompromikan. Koleksi denim impor dan streetwear dengan material premium yang membentuk karakter Anda.",
    tagline: "Gaya Autentik.",
    heroImage1: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1974&auto=format&fit=crop",
    heroImage2: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=2070&auto=format&fit=crop",
    whyHeadline: "Kualitas",
    whySubheadline: "Tanpa Kompromi",
    whyDescription: "Seluruh koleksi kami melalui proses kurasi ketat, memastikan setiap elemen dari material hingga jahitan merepresentasikan standar pergerakan gaya hidup modern.",
    whyPoints: [
      { title: "Material Autentik", desc: "Denim impor kelas berat dan material dengan durabilitas tinggi yang teruji untuk pemakaian ekstrem." },
      { title: "Konstruksi Presisi", desc: "Kekuatan jahitan rantai dan perkuatan struktur untuk keawetan mutlak tanpa kompromi." },
      { title: "Siluet Modern", desc: "Potongan arsitektural yang dirancang khusus untuk menyempurnakan postur dengan gaya kontemporer." },
      { title: "Kenyamanan Maksimal", desc: "Tenunan inovatif yang memberikan fleksibilitas pergerakan tanpa mengorbankan ketebalan fabrik." },
      { title: "Nilai Tanpa Tanding", desc: "Standar craftsmanship luxury internasional, dengan aksesibilitas harga yang sepenuhnya rasional." }
    ],
    careHeadline: "Seni",
    careSubheadline: "Preservasi",
    careDescription: "Karakter sesungguhnya lahir dari perjalanan, bukan etalase. Pahami protokol perawatan esensial untuk merawat mahakarya denim Anda agar fudar menua dengan estetika maksimal.",
    careImage: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1974&auto=format&fit=crop",
    carePoints: [
      { num: "#01", title: "Ritual Air Dingin", desc: "Sebuah purifikasi. Gunakan air bersuhu rendah guna mempertahankan integritas benang ikat indigo, meminimalisasi penyusutan struktural, dan menstabilkan kontras warna." },
      { num: "#02", title: "Pengeringan Natural", desc: "Hindari agresi mesin termal. Proses pengeringan harus dilakukan secara bertahap dalam konfigurasi terbalik (inside-out) pada sirkulasi udara terbuka, melindungi serat kapas murni dari kelelahan material." },
      { num: "#03", title: "Restorasi Tekstur", desc: "Biarkan gravitasi bekerja. Jika intervensi mekanis dibutuhkan, aplikasikan penetrasi uap suhu rendah perlahan dari lapisan interior, memastikan tekstur mentah (raw texture) tidak tergantikan oleh kilap sintetis." }
    ],
    galleryHeadline: "Arsip",
    gallerySubheadline: "Representasi",
    galleryDescription: "Rekam jejak mereka yang memahami nilai dari material superior. Lebih dari sekadar pakaian, ini tentang pernyataan karakter absolut.",
    galleryImage1: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=2070&auto=format&fit=crop",
    galleryImage2: "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?q=80&w=1974&auto=format&fit=crop",
    galleryImage3: "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?q=80&w=1974&auto=format&fit=crop",
    galleryTesti1Text: "\"Arsitektur potongan sangat presisi. Ketebalan material memberi bobot premium namun tetap memfasilitasi artikulasi gerak dinamis. Absolute masterpiece.\"",
    galleryTesti1Author: "- Bima, Jakarta",
    galleryTesti2Text: "\"Siluet konstruksinya di luar ekspektasi, merekonstruksi postur menjadi jauh lebih terstruktur dan tajam. Ini standar yang saya cari.\"",
    galleryTesti2Author: "- Arya, Surabaya",
    faqHeadline: "Informasi",
    faqSubheadline: "Eksklusif",
    faqs: [
      { q: "Bagaimana cara menentukan kesesuaian fitting secara absolut?", a: "Setiap spesifikasi garmen kami dilengkapi topografi dimensi yang detail. Kami merekomendasikan kalibrasi menyilang dengan mengukur perimeter garmen andalan Anda, demi memastikan tingkat fiksasi yang paripurna." },
      { q: "Apakah logistik pengiriman menjangkau area operasional terluar?", a: "Tentu. Kami mengutilisasi infrastruktur logistik tier-1 nasional dengan sistem pelacakan mutakhir, menjamin akuisisi produk dengan kompromi cacat nol ke semua titik demografis Indonesia." },
      { q: "Bagaimana terminologi garansi dan kebijakan penukaran diatur?", a: "Kesesuaian adalah hak mutlak Anda. Kami memfasilitasi asimilasi penggantian siluet (size-exchange) dengan tenggat 48 jam paska konfirmasi akuisisi, mensyaratkan preservasi kondisi fabrik orisinal (unwashed, original tagging intact)." }
    ],
    testimonialHeadline: "Pengalaman",
    testimonialSubheadline: "Kustomer",
    testimonials: [
      { name: "Rizky Firmansyah", role: "Denim Enthusiast", text: "Kualitas raw denim impor dari NAKADUO benar-benar luar biasa. Fading yang dihasilkan setelah 6 bulan pemakaian sangat berkarakter. Sangat sebanding dengan harganya.", rating: 5 },
      { name: "Daniel Adrian", role: "Arsitek", text: "Selvedge denim yang saya beli memiliki konstruksi yang sangat presisi. Sangat pas untuk aktivitas harian saya. Desain streetwear mereka juga punya estetika yang memukau tanpa terkesan berlebihan.", rating: 5 },
      { name: "Ahmad Fauzi", role: "Creative Director", text: "Sangat puas dengan potongan slim fit dari koleksi terbarunya. Detail jahitannya rapi dan materialnya terasa sangat premium. Celana paling nyaman yang pernah saya pakai.", rating: 5 }
    ],
    footerHeadline: "Pilih yang Terbaik, Rasakan Perbedaannya!",
    footerDesc: "Butik denim impor & premium streetwear pilihan untuk standar pria modern.",
    footerAddress: "Jombang, Blok C2 No. 8",
    metaKeywords: "denim impor, raw denim, selvedge denim, streetwear pria, celana jeans premium, jaket denim, fashion pria modern, NAKADUO",
    metaAuthor: "NAKADUO"
  });
  
  // Settings State
  const [settings, setSettings] = useState({
    faviconUrl: "",
    logoUrl: "",
    waAdmin: "0895630454035"
  });

  // Products State
  const [products, setProducts] = useState<any[]>([]);
  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    price: 0,
    imageUrl: "",
    countryOfOrigin: "",
    fit: "",
    stock: 0,
    whatsAppLink: "",
    marketplaceLink: ""
  });

  // Articles State
  const [articles, setArticles] = useState<any[]>([]);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [newArticle, setNewArticle] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    imageUrl: ""
  });

  // Process status flags
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) loadData();
    });
    return unsub;
  }, []);

  const loadData = async () => {
    try {
      const snap = await getDocs(collection(db, 'products'));
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      
      const articlesSnap = await getDocs(collection(db, 'articles'));
      setArticles(articlesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const { getDoc } = await import('firebase/firestore');
      const contentSnap = await getDoc(doc(db, 'siteContent', 'landingPage'));
      if (contentSnap.exists()) {
        setContent((prev: any) => ({ ...prev, ...contentSnap.data() }));
      }
      
      const settingsSnap = await getDoc(doc(db, 'settings', 'general'));
      if (settingsSnap.exists()) {
        setSettings((prev: any) => ({ ...prev, ...settingsSnap.data() }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleImageProcess = (e: React.ChangeEvent<HTMLInputElement>, callback: (dataUrl: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) { height = Math.round((height *= MAX_WIDTH / width)); width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width = Math.round((width *= MAX_HEIGHT / height)); height = MAX_HEIGHT; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          callback(canvas.toDataURL('image/jpeg', 0.8));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const notifySuccess = (msg: string) => {
    alert(msg); // Replace with nice toast in future if needed
  };

  const handleSaveContent = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'siteContent', 'landingPage'), {
        ...content,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      notifySuccess('Konten Landing Page berhasil disimpan!');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'siteContent/landingPage');
    }
    setIsSaving(false);
  };

  const handleSaveSettings = async () => {
    try {
      await setDoc(doc(db, 'settings', 'general'), {
        ...settings,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      notifySuccess('Pengaturan Web berhasil disimpan!');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/general');
    }
  };

  const handleAddOrEditProduct = async () => {
    try {
      const pId = newProduct.id || crypto.randomUUID();
      await setDoc(doc(db, 'products', pId), {
        name: newProduct.name,
        price: Number(newProduct.price),
        imageUrl: newProduct.imageUrl,
        countryOfOrigin: newProduct.countryOfOrigin,
        fit: newProduct.fit,
        stock: Number(newProduct.stock),
        whatsAppLink: newProduct.whatsAppLink,
        marketplaceLink: newProduct.marketplaceLink,
        createdAt: newProduct.id ? undefined : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });
      notifySuccess(newProduct.id ? 'Produk diperbarui!' : 'Produk ditambahkan!');
      setNewProduct({ id: "", name: "", price: 0, imageUrl: "", countryOfOrigin: "", fit: "", stock: 0, whatsAppLink: "", marketplaceLink: "" });
      loadData();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'products');
    }
  };

  const handleEditProduct = (p: any) => {
    setNewProduct({
      id: p.id,
      name: p.name,
      price: p.price,
      imageUrl: p.imageUrl,
      countryOfOrigin: p.countryOfOrigin || "",
      fit: p.fit || "",
      stock: p.stock || 0,
      whatsAppLink: p.whatsAppLink || "",
      marketplaceLink: p.marketplaceLink || ""
    });
    setActiveTab('products');
  };

  const handleDeleteProduct = async (id: string) => {
    if(confirm("Yakin hapus produk ini?")) {
      try {
        await deleteDoc(doc(db, 'products', id));
        loadData();
      } catch(err) {
        handleFirestoreError(err, OperationType.DELETE, 'products');
      }
    }
  };

  const handleSaveArticle = async () => {
    try {
      const aId = editingArticleId || crypto.randomUUID();
      const existingArticle = articles.find(a => a.id === aId);
      await setDoc(doc(db, 'articles', aId), {
        ...newArticle,
        createdAt: existingArticle?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });
      notifySuccess('Artikel berhasil disimpan!');
      setNewArticle({title:"", slug:"", content:"", excerpt:"", imageUrl:""});
      setEditingArticleId(null);
      loadData();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'articles');
    }
  };

  const handleEditArticle = (a: any) => {
    setEditingArticleId(a.id);
    setNewArticle({
      title: a.title,
      slug: a.slug,
      content: a.content,
      excerpt: a.excerpt,
      imageUrl: a.imageUrl
    });
    setActiveTab('articles');
  };

  const handleDeleteArticle = async (id: string) => {
    try {
        if(confirm("Yakin hapus artikel ini?")) {
            await deleteDoc(doc(db, 'articles', id));
            loadData();
        }
    } catch(err) {
         handleFirestoreError(err, OperationType.DELETE, 'articles');
    }
  };

  const seedArticles = async () => {
    const sampleArticles = [
      {
        title: "Panduan Memilih Fit Denim yang Tepat untuk Pria Indonesia",
        slug: "panduan-memilih-fit-denim",
        excerpt: "Bingung memilih antara Slim Fit, Regular, atau Skinny? Simak panduan lengkap kami untuk menemukan fit yang paling sesuai dengan postur tubuh Anda.",
        content: `Mencari celana denim yang pas seringkali terasa seperti mencari jarum di tumpukan jerami. Terutama bagi pria Indonesia dengan karakteristik postur tubuh yang beragam. Di NAKADUO, kami selalu merekomendasikan untuk memahami bentuk tubuh Anda sebelum memilih fit. \n\n**1. Slim Fit: Pilihan Paling Aman**\nSlim fit menawarkan keseimbangan antara kenyamanan dan tampilan modern. Tidak terlalu ketat seperti skinny, tapi cukup pas untuk memberikan siluet yang rapi.\n\n**2. Regular Fit: Klasik & Nyaman**\nBagi Anda yang mengutamakan ruang gerak, regular fit adalah jawabannya. Sangat cocok dipadukan dengan sepatu boots atau sneakers chunky.`,
        imageUrl: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=2070&auto=format&fit=crop"
      },
      {
        title: "Mengenal Raw Denim dan Cara Merawatnya",
        slug: "mengenal-raw-denim",
        excerpt: "Raw denim bukan hanya sekadar celana, ini adalah investasi gaya yang personal. Ketahui cara merawatnya agar fading yang dihasilkan maksimal.",
        content: `Raw denim atau dry denim adalah material denim yang belum melewati proses pencucian pabrik. Inilah yang membuatnya kaku di awal, namun akan melunak dan membentuk pola 'fading' yang unik sesuai dengan gaya hidup pemakainya.\n\n**Cara Merawat Raw Denim:**\n- Hindari mencuci terlalu sering di awal pemakaian (sebaiknya tunggu 4-6 bulan).\n- Saat mencuci, gunakan air dingin dan balik celana (inside-out).\n- Jemur di tempat teduh dan biarkan kering secara alami.`,
        imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1974&auto=format&fit=crop"
      }
    ];

    try {
      await Promise.all(sampleArticles.map(async (article) => {
        const aId = crypto.randomUUID();
        await setDoc(doc(db, 'articles', aId), {
          ...article,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }));
      notifySuccess('Sample articles injected!');
      loadData();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'articles');
    }
  };

  // Helper arrays update functions
  const updateArrayField = (field: string, index: number, subfield: string, value: any) => {
    const newArr = [...content[field]];
    newArr[index][subfield] = value;
    setContent({ ...content, [field]: newArr });
  };
  const addToArrayField = (field: string, defaultObj: any) => {
    setContent({ ...content, [field]: [...(content[field] || []), defaultObj] });
  };
  const removeFromArrayField = (field: string, index: number) => {
    const newArr = [...content[field]];
    newArr.splice(index, 1);
    setContent({ ...content, [field]: newArr });
  };

  if (loading) return <div className="p-10 text-center font-mono">Inisialisasi sistem...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <div className="bg-white p-10 shadow-lg text-center max-w-sm w-full rounded-xl border border-stone-200 aspect-[4/5] flex flex-col justify-center">
           <h1 className="text-3xl font-serif text-brand-charcoal mb-2 tracking-wide">NAKADUO</h1>
           <p className="text-stone-400 font-mono text-xs uppercase tracking-widest mb-8">Admin Control Panel</p>
           <button onClick={loginWithGoogle} className="bg-brand-charcoal text-white px-6 py-4 rounded font-medium hover:bg-black w-full flex justify-center items-center gap-3 transition-colors shadow-md">
             <UserIcon /> Akses Dashboard
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-stone-200 flex flex-col fixed h-full z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-6 border-b border-stone-100">
          <h1 className="text-xl font-serif text-brand-charcoal tracking-wide flex items-center gap-2"><LayoutDashboard className="w-5 h-5"/> NAKADUO</h1>
          <p className="text-xs text-stone-400 font-mono mt-1">{user.email}</p>
        </div>
        <div className="flex-1 py-6 flex flex-col gap-2 px-4">
          <NavItem active={activeTab === 'content'} onClick={() => setActiveTab('content')} icon={<LayoutTemplate className="w-4 h-4"/>} text="Landing Page" />
          <NavItem active={activeTab === 'products'} onClick={() => setActiveTab('products')} icon={<Package className="w-4 h-4"/>} text="Katalog Produk" />
          <NavItem active={activeTab === 'articles'} onClick={() => setActiveTab('articles')} icon={<FileText className="w-4 h-4"/>} text="Jurnal & Artikel" />
          <NavItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings className="w-4 h-4"/>} text="Pengaturan" />
        </div>
        <div className="p-4 border-t border-stone-100">
          <button onClick={logout} className="flex items-center gap-2 text-stone-500 hover:text-red-600 transition-colors w-full p-2 text-sm">
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-8 lg:p-12">
        <div className="max-w-5xl mx-auto">
          
          {/* TAB: CONTENT / LANDING PAGE */}
          {activeTab === 'content' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-between items-end mb-6">
                 <div>
                   <h2 className="text-3xl font-serif text-brand-charcoal">Halaman Utama</h2>
                   <p className="text-stone-500 mt-1">Kelola teks dan gambar untuk seluruh halaman landing.</p>
                 </div>
                 <button onClick={handleSaveContent} disabled={isSaving} className="bg-brand-charcoal text-white px-6 py-3 rounded-md font-medium hover:bg-black transition-all flex items-center gap-2 shadow-md hover:shadow-xl disabled:opacity-50">
                   <Save className="w-4 h-4"/> {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                 </button>
              </div>

              {/* Box: Hero */}
              <SectionBox title="1. Hero Banner">
                <InputRow label="Headline Hero" value={content.headline} onChange={v => setContent({...content, headline: v})} />
                <InputRow label="Tagline (Sub Headline)" value={content.tagline} onChange={v => setContent({...content, tagline: v})} />
                <TextAreaRow label="Deskripsi Pengantar" value={content.description} onChange={v => setContent({...content, description: v})} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <ImageInput label="Foto Horizontal (URL / Upload)" value={content.heroImage1} onChange={v => setContent({...content, heroImage1: v})} uploadHandler={handleImageProcess} />
                  <ImageInput label="Foto Vertikal Offset (URL / Upload)" value={content.heroImage2} onChange={v => setContent({...content, heroImage2: v})} uploadHandler={handleImageProcess} />
                </div>
              </SectionBox>

              {/* Box: Why Us */}
              <SectionBox title="2. Mengapa Memilih Kami (Why Choose Us)">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <InputRow label="Headline" value={content.whyHeadline} onChange={v => setContent({...content, whyHeadline: v})} />
                  <InputRow label="Sub Headline" value={content.whySubheadline} onChange={v => setContent({...content, whySubheadline: v})} />
                </div>
                <TextAreaRow label="Deskripsi Pendek" value={content.whyDescription} onChange={v => setContent({...content, whyDescription: v})} />
                <div className="mt-6">
                   <label className="block text-sm font-semibold text-stone-800 mb-3 border-b pb-2">Daftar Poin Keunggulan</label>
                   {(content.whyPoints || []).map((pt: any, idx: number) => (
                     <div key={idx} className="flex gap-4 items-start mb-3 bg-stone-50 p-3 rounded border border-stone-200">
                       <div className="flex-1 space-y-2">
                         <input value={pt.title} onChange={e => updateArrayField('whyPoints', idx, 'title', e.target.value)} placeholder="Judul Poin" className="w-full border-stone-300 rounded p-2 text-sm" />
                         <textarea value={pt.desc} onChange={e => updateArrayField('whyPoints', idx, 'desc', e.target.value)} placeholder="Deskripsi pendek" className="w-full border-stone-300 rounded p-2 text-sm h-16" />
                       </div>
                       <button onClick={() => removeFromArrayField('whyPoints', idx)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded"><Trash2 className="w-4 h-4"/></button>
                     </div>
                   ))}
                   <button onClick={() => addToArrayField('whyPoints', {title:'', desc:''})} className="text-sm text-brand-charcoal bg-stone-200 px-3 py-1.5 rounded flex items-center gap-1 hover:bg-stone-300 mt-2"><Plus className="w-3 h-3"/> Tambah Poin</button>
                </div>
              </SectionBox>

              {/* Box: Care Guide */}
              <SectionBox title="3. Panduan Perawatan (Care Guide)">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <InputRow label="Headline" value={content.careHeadline} onChange={v => setContent({...content, careHeadline: v})} />
                  <InputRow label="Sub Headline" value={content.careSubheadline} onChange={v => setContent({...content, careSubheadline: v})} />
                </div>
                <TextAreaRow label="Instruksi Umum" value={content.careDescription} onChange={v => setContent({...content, careDescription: v})} />
                <div className="mt-4">
                  <ImageInput label="Ilustrasi Care Guide (URL / Upload)" value={content.careImage} onChange={v => setContent({...content, careImage: v})} uploadHandler={handleImageProcess} />
                </div>
                
                <div className="mt-6">
                   <label className="block text-sm font-semibold text-stone-800 mb-3 border-b pb-2">Langkah-Langkah Perawatan</label>
                   {(content.carePoints || []).map((pt: any, idx: number) => (
                     <div key={idx} className="flex gap-4 items-start mb-3 bg-stone-50 p-3 rounded border border-stone-200">
                       <div className="w-20"><input value={pt.num} onChange={e => updateArrayField('carePoints', idx, 'num', e.target.value)} placeholder="#01" className="w-full border-stone-300 rounded p-2 text-sm text-center" /></div>
                       <div className="flex-1 space-y-2">
                         <input value={pt.title} onChange={e => updateArrayField('carePoints', idx, 'title', e.target.value)} placeholder="Judul Poin" className="w-full border-stone-300 rounded p-2 text-sm" />
                         <textarea value={pt.desc} onChange={e => updateArrayField('carePoints', idx, 'desc', e.target.value)} placeholder="Deskripsi pendek" className="w-full border-stone-300 rounded p-2 text-sm h-16" />
                       </div>
                       <button onClick={() => removeFromArrayField('carePoints', idx)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded"><Trash2 className="w-4 h-4"/></button>
                     </div>
                   ))}
                   <button onClick={() => addToArrayField('carePoints', {num:'', title:'', desc:''})} className="text-sm text-brand-charcoal bg-stone-200 px-3 py-1.5 rounded flex items-center gap-1 hover:bg-stone-300 mt-2"><Plus className="w-3 h-3"/> Tambah Langkah</button>
                </div>
              </SectionBox>

              {/* Box: Testimonial */}
              <SectionBox title="4. Testimonial Pelanggan">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <InputRow label="Headline" value={content.testimonialHeadline} onChange={v => setContent({...content, testimonialHeadline: v})} />
                  <InputRow label="Sub Headline" value={content.testimonialSubheadline} onChange={v => setContent({...content, testimonialSubheadline: v})} />
                </div>
                <div className="mt-4">
                   {(content.testimonials || []).map((pt: any, idx: number) => (
                     <div key={idx} className="flex gap-4 items-start mb-3 bg-stone-50 p-3 rounded border border-stone-200">
                       <div className="flex-1 grid grid-cols-2 gap-3">
                         <input value={pt.name} onChange={e => updateArrayField('testimonials', idx, 'name', e.target.value)} placeholder="Nama Lengkap" className="border-stone-300 rounded p-2 text-sm" />
                         <input value={pt.role} onChange={e => updateArrayField('testimonials', idx, 'role', e.target.value)} placeholder="Peran / Pekerjaan" className="border-stone-300 rounded p-2 text-sm" />
                         <textarea value={pt.text} onChange={e => updateArrayField('testimonials', idx, 'text', e.target.value)} placeholder="Ulasan" className="col-span-2 border-stone-300 rounded p-2 text-sm h-16" />
                         <input type="number" min="1" max="5" value={pt.rating} onChange={e => updateArrayField('testimonials', idx, 'rating', Number(e.target.value))} placeholder="Rating (1-5)" className="border-stone-300 rounded p-2 text-sm w-32" />
                       </div>
                       <button onClick={() => removeFromArrayField('testimonials', idx)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded"><Trash2 className="w-4 h-4"/></button>
                     </div>
                   ))}
                   <button onClick={() => addToArrayField('testimonials', {name:'', role:'', text:'', rating:5})} className="text-sm text-brand-charcoal bg-stone-200 px-3 py-1.5 rounded flex items-center gap-1 hover:bg-stone-300 mt-2"><Plus className="w-3 h-3"/> Tambah Ulasan</button>
                </div>
              </SectionBox>

              {/* Box: Gallery */}
              <SectionBox title="5. Galeri Estetik (Mosaik)">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <InputRow label="Headline" value={content.galleryHeadline} onChange={v => setContent({...content, galleryHeadline: v})} />
                  <InputRow label="Sub Headline" value={content.gallerySubheadline} onChange={v => setContent({...content, gallerySubheadline: v})} />
                </div>
                <TextAreaRow label="Deskripsi Pengantar Galeri" value={content.galleryDescription} onChange={v => setContent({...content, galleryDescription: v})} />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 border-t border-b py-6 border-stone-200 my-6">
                  <ImageInput label="Gambar Galeri 1 (Besar)" value={content.galleryImage1} onChange={v => setContent({...content, galleryImage1: v})} uploadHandler={handleImageProcess} />
                  <ImageInput label="Gambar Galeri 2 (Sedang)" value={content.galleryImage2} onChange={v => setContent({...content, galleryImage2: v})} uploadHandler={handleImageProcess} />
                  <ImageInput label="Gambar Galeri 3 (Sedang)" value={content.galleryImage3} onChange={v => setContent({...content, galleryImage3: v})} uploadHandler={handleImageProcess} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-stone-50 p-4 border border-stone-200 rounded">
                     <label className="block text-sm font-semibold mb-2">Quote Galeri 1 (Di antara gambar)</label>
                     <textarea value={content.galleryTesti1Text} onChange={e => setContent({...content, galleryTesti1Text: e.target.value})} className="w-full border-stone-300 rounded p-2 text-sm h-20 mb-2" />
                     <input value={content.galleryTesti1Author} onChange={e => setContent({...content, galleryTesti1Author: e.target.value})} placeholder="Penulis (- Bima, JKT)" className="w-full border-stone-300 rounded p-2 text-sm" />
                   </div>
                   <div className="bg-stone-50 p-4 border border-stone-200 rounded">
                     <label className="block text-sm font-semibold mb-2">Quote Galeri 2 (Di antara gambar)</label>
                     <textarea value={content.galleryTesti2Text} onChange={e => setContent({...content, galleryTesti2Text: e.target.value})} className="w-full border-stone-300 rounded p-2 text-sm h-20 mb-2" />
                     <input value={content.galleryTesti2Author} onChange={e => setContent({...content, galleryTesti2Author: e.target.value})} placeholder="Penulis (- Arya, SBY)" className="w-full border-stone-300 rounded p-2 text-sm" />
                   </div>
                </div>
              </SectionBox>

              {/* Box: FAQ */}
              <SectionBox title="6. Pertanyaan Umum (FAQ)">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 border-b pb-4">
                  <InputRow label="Headline" value={content.faqHeadline} onChange={v => setContent({...content, faqHeadline: v})} />
                  <InputRow label="Sub Headline" value={content.faqSubheadline} onChange={v => setContent({...content, faqSubheadline: v})} />
                </div>
                <div>
                   {(content.faqs || []).map((pt: any, idx: number) => (
                     <div key={idx} className="flex gap-4 items-start mb-3 bg-stone-50 p-3 rounded border border-stone-200">
                       <div className="flex-1 space-y-2">
                         <input value={pt.q} onChange={e => updateArrayField('faqs', idx, 'q', e.target.value)} placeholder="Pertanyaan?" className="w-full border-stone-300 rounded p-2 text-sm font-medium" />
                         <textarea value={pt.a} onChange={e => updateArrayField('faqs', idx, 'a', e.target.value)} placeholder="Jawaban detail." className="w-full border-stone-300 rounded p-2 text-sm h-16" />
                       </div>
                       <button onClick={() => removeFromArrayField('faqs', idx)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded"><Trash2 className="w-4 h-4"/></button>
                     </div>
                   ))}
                   <button onClick={() => addToArrayField('faqs', {q:'', a:''})} className="text-sm text-brand-charcoal bg-stone-200 px-3 py-1.5 rounded flex items-center gap-1 hover:bg-stone-300 mt-2"><Plus className="w-3 h-3"/> Tambah Pertanyaan</button>
                </div>
              </SectionBox>

              {/* Box: Footer & Meta */}
               <SectionBox title="7. Footer & Metadata (SEO)">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <InputRow label="Kalimat Slogan Footer" value={content.footerHeadline} onChange={v => setContent({...content, footerHeadline: v})} />
                  <InputRow label="Kata Kunci Meta (Pisahkan koma)" value={content.metaKeywords} onChange={v => setContent({...content, metaKeywords: v})} />
                  <div className="md:col-span-2">
                    <TextAreaRow label="Deskripsi Profil (Footer)" value={content.footerDesc} onChange={v => setContent({...content, footerDesc: v})} />
                  </div>
                  <InputRow label="Alamat / Lokasi Operasional" value={content.footerAddress} onChange={v => setContent({...content, footerAddress: v})} />
                  <InputRow label="Meta Author" value={content.metaAuthor} onChange={v => setContent({...content, metaAuthor: v})} />
                </div>
              </SectionBox>

              <div className="flex justify-end pt-4 pb-20">
                <button onClick={handleSaveContent} disabled={isSaving} className="bg-brand-charcoal text-white px-8 py-4 text-lg rounded-md font-medium hover:bg-black transition-all flex items-center gap-2 shadow-xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100">
                  <Save className="w-5 h-5"/> {isSaving ? 'Menyimpan...' : 'Simpan Semua Konten Landing Page'}
                </button>
              </div>
            </div>
          )}

          {/* TAB: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div>
                 <h2 className="text-3xl font-serif text-brand-charcoal">Katalog Produk</h2>
                 <p className="text-stone-500 mt-1">Kelola invetori produk yang ditampilkan di beranda.</p>
               </div>

               <SectionBox title={newProduct.id ? "Edit Produk" : "Tambah Produk Baru"}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <InputRow label="Nama Produk" value={newProduct.name} onChange={v => setNewProduct({...newProduct, name: v})} />
                   <InputRow label="Harga Satuan (Angka)" type="number" value={newProduct.price} onChange={v => setNewProduct({...newProduct, price: v})} />
                   
                   <div className="md:col-span-2">
                     <ImageInput label="Foto Produk Resolusi Tinggi (Potrait/4:5 direkomendasikan). Menggunakan Auto Crop & Resize." value={newProduct.imageUrl} onChange={v => setNewProduct({...newProduct, imageUrl: v})} uploadHandler={handleImageProcess} />
                   </div>
                   
                   <InputRow label="Varian Fit (misal: Slim Fit, Relaxed)" value={newProduct.fit} onChange={v => setNewProduct({...newProduct, fit: v})} />
                   <InputRow label="Asal Negara (Opsional)" value={newProduct.countryOfOrigin} onChange={v => setNewProduct({...newProduct, countryOfOrigin: v})} />
                   <InputRow label="Stok Tersedia" type="number" value={newProduct.stock} onChange={v => setNewProduct({...newProduct, stock: v})} />
                   <InputRow label="Link Tautan Marketplace (Opsional)" value={newProduct.marketplaceLink} onChange={v => setNewProduct({...newProduct, marketplaceLink: v})} />
                 </div>
                 <div className="mt-6 flex gap-3">
                   <button onClick={handleAddOrEditProduct} className="bg-brand-charcoal text-white px-6 py-2 rounded shadow flex items-center gap-2 hover:bg-black">
                     <Save className="w-4 h-4"/> {newProduct.id ? 'Simpan Perubahan' : 'Upload Produk'}
                   </button>
                   {newProduct.id && (
                     <button onClick={() => setNewProduct({ id: "", name: "", price: 0, imageUrl: "", countryOfOrigin: "", fit: "", stock: 0, whatsAppLink: "", marketplaceLink: "" })} className="text-stone-500 hover:text-black">
                       Batal Edit
                     </button>
                   )}
                 </div>
               </SectionBox>

               <SectionBox title={`Daftar Inventori (${products.length} produk)`}>
                  {products.length === 0 ? <p className="text-stone-400 italic">Belum ada produk terdaftar.</p> : (
                    <div className="divide-y divide-stone-100 mt-4">
                      {products.map(p => (
                         <div key={p.id} className="py-4 flex gap-4 items-center group">
                            {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-16 h-20 object-cover rounded border border-stone-200" /> : <div className="w-16 h-20 bg-stone-100 rounded border border-stone-200 flex items-center justify-center text-xs text-stone-400">No Img</div>}
                            <div className="flex-1">
                              <h3 className="font-semibold text-brand-charcoal text-lg">{p.name} <span className="text-xs bg-stone-100 text-stone-500 font-normal px-2 py-0.5 rounded ml-2">{p.fit}</span></h3>
                              <p className="text-stone-500 text-sm">Rp {p.price.toLocaleString('id-ID')} — Stok: {p.stock}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEditProduct(p)} className="bg-brand-canvas text-brand-charcoal border border-brand-charcoal px-3 py-1 rounded text-sm hover:bg-brand-charcoal hover:text-white transition-colors">Edit</button>
                              <button onClick={() => handleDeleteProduct(p.id)} className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded text-sm hover:bg-red-600 hover:text-white transition-colors">Hapus</button>
                            </div>
                         </div>
                      ))}
                    </div>
                  )}
               </SectionBox>
            </div>
          )}

          {/* TAB: ARTICLES */}
          {activeTab === 'articles' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="flex justify-between items-end">
                 <div>
                   <h2 className="text-3xl font-serif text-brand-charcoal">Jurnal & Artikel</h2>
                   <p className="text-stone-500 mt-1">Publikasi narasi edukasi dan editorial untuk audiens Anda.</p>
                 </div>
                 <button onClick={seedArticles} className="bg-brand-bronze text-white px-4 py-2 rounded shadow flex items-center gap-2 hover:bg-yellow-700 text-sm font-medium">
                   Inject Data Sampel Publikasi
                 </button>
               </div>

               <SectionBox title={editingArticleId ? "Editor Artikel" : "Tulis Publikasi Baru"}>
                 <div className="grid grid-cols-1 gap-4">
                   <InputRow label="Judul Utama" value={newArticle.title} onChange={v => setNewArticle({...newArticle, title: v})} />
                   <InputRow label="URL Slug (Tanpa spasi, gunakan strip. Contoh: gaya-raw-denim)" value={newArticle.slug} onChange={v => setNewArticle({...newArticle, slug: v})} />
                   <TextAreaRow label="Ringkasan Singkat (Excerpt)" value={newArticle.excerpt} onChange={v => setNewArticle({...newArticle, excerpt: v})} />
                   <div>
                     <label className="block text-sm font-semibold text-stone-700 mb-1">Konten Utama (Mendukung Markdown **tebal** *miring*)</label>
                     <textarea value={newArticle.content} onChange={e => setNewArticle({...newArticle, content: e.target.value})} className="w-full border border-stone-300 rounded-md p-3 h-64 focus:ring-1 focus:ring-brand-charcoal focus:outline-none bg-stone-50 font-mono text-sm" />
                   </div>
                   <ImageInput label="Ilustrasi Tajuk Utama (URL / Upload)" value={newArticle.imageUrl} onChange={v => setNewArticle({...newArticle, imageUrl: v})} uploadHandler={handleImageProcess} />
                 </div>
                 <div className="mt-6 flex gap-3">
                   <button onClick={handleSaveArticle} className="bg-brand-charcoal text-white px-6 py-2 rounded shadow flex items-center gap-2 hover:bg-black">
                     <Save className="w-4 h-4"/> {editingArticleId ? 'Update Publikasi' : 'Distribusikan Publikasi'}
                   </button>
                   {editingArticleId && (
                     <button onClick={() => { setEditingArticleId(null); setNewArticle({title:"", slug:"", content:"", excerpt:"", imageUrl:""}); }} className="text-stone-500 hover:text-black">
                       Batalkan Mode Edit
                     </button>
                   )}
                 </div>
               </SectionBox>

               <SectionBox title={`Riwayat Publikasi (${articles.length} post)`}>
                 {articles.length === 0 ? <p className="text-stone-400 italic">Belum ada jurnal dipublikasikan.</p> : (
                    <div className="divide-y divide-stone-100 mt-4">
                      {articles.map(a => (
                         <div key={a.id} className="py-4 flex gap-5 items-start group">
                            {a.imageUrl ? <img src={a.imageUrl} alt={a.title} className="w-24 h-24 object-cover rounded shadow-sm border border-stone-200" /> : <div className="w-24 h-24 bg-stone-100 rounded border border-stone-200 flex items-center justify-center text-[10px] text-stone-400">No Image</div>}
                            <div className="flex-1">
                              <h3 className="font-serif text-lg text-brand-charcoal leading-tight mb-1">{a.title}</h3>
                              <p className="text-stone-400 text-xs font-mono mb-2">/{a.slug}</p>
                              <p className="text-stone-500 text-sm line-clamp-2 leading-relaxed">{a.excerpt}</p>
                            </div>
                            <div className="flex flex-col gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEditArticle(a)} className="bg-brand-canvas text-brand-charcoal border border-brand-charcoal px-3 py-1 rounded text-sm hover:bg-brand-charcoal hover:text-white transition-colors">Edit</button>
                              <button onClick={() => handleDeleteArticle(a.id)} className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded text-sm hover:bg-red-600 hover:text-white transition-colors">Hapus</button>
                            </div>
                         </div>
                      ))}
                    </div>
                  )}
               </SectionBox>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
             <div className="space-y-8 animate-in fade-in duration-500">
               <div>
                 <h2 className="text-3xl font-serif text-brand-charcoal">Infrastruktur Profiling</h2>
                 <p className="text-stone-500 mt-1">Pengaturan inti integrasi kanal penjualan.</p>
               </div>
               
               <SectionBox title="Konfigurasi WhatsApp">
                  <div className="max-w-xl">
                    <p className="text-sm text-stone-500 mb-4 bg-blue-50 border border-blue-100 p-3 rounded text-blue-800">
                      Seluruh transaksi tombol "Beli via WhatsApp" akan dialihkan ke nomor WhatsApp di bawah ini secara otomatis dengan membawa pesan identifikasi produk.
                    </p>
                    <InputRow label="Nomor WhatsApp PIC/Admin (Mulai dengan O8... atau 628...)" value={settings.waAdmin} onChange={v => setSettings({...settings, waAdmin: v})} />
                    
                    <button onClick={handleSaveSettings} className="bg-brand-charcoal text-white px-6 py-2 mt-6 rounded shadow flex items-center gap-2 hover:bg-black">
                       <Save className="w-4 h-4"/> Terapkan Pengaturan
                    </button>
                  </div>
               </SectionBox>

               <SectionBox title="Brand Assets (Future Proofing)">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputRow label="URL Favicon (.ico / .png)" value={settings.faviconUrl} onChange={v => setSettings({...settings, faviconUrl: v})} />
                  <InputRow label="URL Logo Kustom Utama (Transparan .png / .svg)" value={settings.logoUrl} onChange={v => setSettings({...settings, logoUrl: v})} />
                 </div>
                 <div className="mt-4 border-t pt-4 text-xs text-stone-400 flex gap-2 items-center">
                    <Settings className="w-4 h-4 animate-spin-slow"/> Hanya berlaku ketika custom asset feature diaktifkan pada layer display. Saat ini aplikasi menggunakan typografi brand (Teks: NAKADUO).
                 </div>
               </SectionBox>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ------ UI Helper Components ------

function NavItem({ active, onClick, icon, text }: { active: boolean, onClick: () => void, icon: React.ReactNode, text: string }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm transition-all text-left ${active ? 'bg-brand-charcoal text-white font-medium shadow-md' : 'text-stone-600 hover:bg-stone-100 hover:text-black font-medium'}`}>
      {icon} <span>{text}</span>
    </button>
  );
}

function SectionBox({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white p-6 shadow-sm rounded-xl border border-stone-200 relative overflow-hidden group">
       <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-bronze opacity-0 group-hover:opacity-100 transition-opacity"></div>
       <h3 className="text-xl font-medium text-brand-charcoal mb-6 flex items-center gap-2 border-b border-stone-100 pb-4">{title}</h3>
       {children}
    </div>
  );
}

function InputRow({ label, value, onChange, type = "text" }: { label: string, value: any, onChange: (v: string) => void, type?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-stone-700 mb-1.5">{label}</label>
      <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} className="w-full border border-stone-300 rounded-md p-2.5 focus:ring-1 focus:ring-brand-charcoal focus:outline-none bg-stone-50" />
    </div>
  );
}

function TextAreaRow({ label, value, onChange }: { label: string, value: any, onChange: (v: string) => void }) {
  return (
    <div className="mt-2">
      <label className="block text-sm font-semibold text-stone-700 mb-1.5">{label}</label>
      <textarea value={value || ''} onChange={e => onChange(e.target.value)} className="w-full border border-stone-300 rounded-md p-2.5 h-24 focus:ring-1 focus:ring-brand-charcoal focus:outline-none bg-stone-50" />
    </div>
  );
}

function ImageInput({ label, value, onChange, uploadHandler }: { label: string, value: string, onChange: (v: string) => void, uploadHandler: (e: any, cb: any) => void }) {
  return (
    <div className="bg-stone-50 border border-stone-200 rounded-md p-4 flex flex-col gap-3 h-full">
      <label className="block text-sm font-semibold text-stone-700 flex items-center gap-2"><ImageIcon className="w-4 h-4 text-stone-400"/> {label}</label>
      
      {value ? (
        <div className="w-full h-32 bg-stone-200 rounded overflow-hidden relative group border border-stone-200">
          <img src={value} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity flex-col gap-2">
            <span className="text-white text-xs bg-black/50 px-2 py-1 rounded">Preview Image</span>
            <button onClick={() => onChange("")} className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Hapus Gambar</button>
          </div>
        </div>
      ) : (
         <div className="w-full h-32 bg-stone-100 rounded border-2 border-dashed border-stone-300 flex items-center justify-center text-stone-400 text-xs flex-col gap-2 relative">
             <ImageIcon className="w-6 h-6 opacity-50" />
             Belum ada gambar
             <input type="file" accept="image/*" onChange={e => uploadHandler(e, onChange)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
         </div>
      )}
      
      <div className="flex flex-col gap-2 relative mt-auto">
        <input value={value || ''} onChange={e => onChange(e.target.value)} placeholder="Atau paste URL dari web browser..." className="w-full border border-stone-300 rounded p-2 focus:ring-1 focus:ring-brand-charcoal bg-white text-xs" />
        <div className="relative w-full">
           <input type="file" accept="image/*" onChange={e => uploadHandler(e, onChange)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
           <div className="border border-stone-300 rounded p-2 text-center text-brand-charcoal bg-white text-xs hover:bg-stone-100 transition-colors pointer-events-none w-full font-medium">
             <Plus className="w-3 h-3 inline-block mr-1"/> Upload File dari Komputer
           </div>
        </div>
      </div>
    </div>
  );
}

function UserIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>;
}
