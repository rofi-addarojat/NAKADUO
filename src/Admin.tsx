import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType, loginWithGoogle, logout } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    careHeadline: "Seni",
    careSubheadline: "Preservasi",
    careDescription: "Karakter sesungguhnya lahir dari perjalanan, bukan etalase. Pahami protokol perawatan esensial untuk merawat mahakarya denim Anda agar fudar menua dengan estetika maksimal.",
    galleryHeadline: "Arsip",
    gallerySubheadline: "Representasi",
    galleryDescription: "Rekam jejak mereka yang memahami nilai dari material superior. Lebih dari sekadar pakaian, ini tentang pernyataan karakter absolut.",
    faqHeadline: "Informasi",
    faqSubheadline: "Eksklusif",
    testimonialHeadline: "Pengalaman",
    testimonialSubheadline: "Kustomer",
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

  const handleSaveContent = async () => {
    try {
      await setDoc(doc(db, 'siteContent', 'landingPage'), {
        ...content,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      alert('Content saved!');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'siteContent/landingPage');
    }
  };

  const handleSaveSettings = async () => {
    try {
      await setDoc(doc(db, 'settings', 'general'), {
        ...settings,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      alert('Settings saved!');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/general');
    }
  };

  const handleAddProduct = async () => {
    try {
      const pId = crypto.randomUUID();
      await setDoc(doc(db, 'products', pId), {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      alert('Product saved!');
      loadData();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'products');
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
      alert('Article saved!');
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
  };

  const handleDeleteArticle = async (id: string) => {
    try {
        if(confirm("Yakin hapus?")) {
            const { deleteDoc } = await import('firebase/firestore');
            await deleteDoc(doc(db, 'articles', id));
            loadData();
        }
    } catch(err) {
         handleFirestoreError(err, OperationType.DELETE, 'articles');
    }
  }

  const seedArticles = async () => {
    const sampleArticles = [
      {
        title: "Panduan Memilih Fit Denim yang Tepat untuk Pria Indonesia",
        slug: "panduan-memilih-fit-denim",
        excerpt: "Bingung memilih antara Slim Fit, Regular, atau Skinny? Simak panduan lengkap kami untuk menemukan fit yang paling sesuai dengan postur tubuh Anda.",
        content: `Mencari celana denim yang pas seringkali terasa seperti mencari jarum di tumpukan jerami. Terutama bagi pria Indonesia dengan karakteristik postur tubuh yang beragam. Di NAKADUO, kami selalu merekomendasikan untuk memahami bentuk tubuh Anda sebelum memilih fit. \n\n**1. Slim Fit: Pilihan Paling Aman**\nSlim fit menawarkan keseimbangan antara kenyamanan dan tampilan modern. Tidak terlalu ketat seperti skinny, tapi cukup pas untuk memberikan siluet yang rapi.\n\n**2. Regular Fit: Klasik & Nyaman**\nBagi Anda yang mengutamakan ruang gerak, regular fit adalah jawabannya. Sangat cocok dipadukan dengan sepatu boots atau sneakers chunky.\n\nPelajari lebih lanjut tentang strategi digital marketing untuk bisnis fashion Anda di <a href='https://lspdigital.id' target='_blank' rel='noopener noreferrer'>lspdigital.id</a>.`,
        imageUrl: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=2070&auto=format&fit=crop"
      },
      {
        title: "Mengenal Raw Denim dan Cara Merawatnya",
        slug: "mengenal-raw-denim",
        excerpt: "Raw denim bukan hanya sekadar celana, ini adalah investasi gaya yang personal. Ketahui cara merawatnya agar fading yang dihasilkan maksimal.",
        content: `Raw denim atau dry denim adalah material denim yang belum melewati proses pencucian pabrik. Inilah yang membuatnya kaku di awal, namun akan melunak dan membentuk pola 'fading' yang unik sesuai dengan gaya hidup pemakainya.\n\n**Cara Merawat Raw Denim:**\n- Hindari mencuci terlalu sering di awal pemakaian (sebaiknya tunggu 4-6 bulan).\n- Saat mencuci, gunakan air dingin dan balik celana (inside-out).\n- Jemur di tempat teduh dan biarkan kering secara alami.\n\nJika Anda membangun brand seputar raw denim, pastikan strategi pemasarannya tepat dengan bantuan <a href='https://lspdigital.id' target='_blank' rel='noopener noreferrer'>lspdigital.id</a>.`,
        imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1974&auto=format&fit=crop"
      },
      {
        title: "5 Tren Streetwear Impor yang Wajib Anda Punya Tahun Ini",
        slug: "tren-streetwear-impor-tahun-ini",
        excerpt: "Dari oversized tee hingga utility pants, inilah 5 item streetwear impor yang akan mendominasi jalanan tahun ini.",
        content: `Streetwear terus berevolusi. Tahun ini, kita melihat pergeseran ke arah kenyamanan tanpa mengorbankan estetika. NAKADUO telah mengkurasi beberapa gaya yang patut Anda perhatikan:\n\n1. **Utility & Cargo Pants**: Banyak kantong, fungsional, dan sangat bergaya.\n2. **Oversized Graphic Tees**: Atasan longgar dengan grafis bold masih menjadi rajanya streetwear.\n3. **Heavyweight Hoodies**: Hoodie dengan gramasi tinggi memberikan struktur dan siluet yang lebih premium.\n\nIngin mengetahui tren digital yang mendukung brand fashion? Kunjungi <a href='https://lspdigital.id' target='_blank' rel='noopener noreferrer'>lspdigital.id</a>.`,
        imageUrl: "https://images.unsplash.com/photo-1523398002811-999aa8e9f5b9?q=80&w=2070&auto=format&fit=crop"
      },
      {
        title: "Perbedaan Selvedge Denim dan Denim Reguler",
        slug: "perbedaan-selvedge-dan-denim-reguler",
        excerpt: "Sering mendengar istilah 'Selvedge' namun tidak tahu artinya? Artikel ini akan membahas kenapa selvedge sering dihargai lebih premium.",
        content: `Istilah selvedge berasal dari 'self-edge', merujuk pada tepi kain denim yang dianyam rapat sehingga tidak mudah terurai. Selvedge denim diproduksi menggunakan mesin tenun tradisional lambat (shuttle loom), yang menghasilkan kain yang lebih sempit tetapi lebih padat dan berkarakter.\n\nCiri khas utama selvedge adalah garis warna (biasanya merah dan putih) di bagian dalam jahitan samping celana. Mengenakan selvedge denim bukan hanya soal pakaian, ini adalah apresiasi terhadap craftmanship tradisional.\n\nKembangkan craftmanship digital Anda melalui sertifikasi dan pelatihan di <a href='https://lspdigital.id' target='_blank' rel='noopener noreferrer'>lspdigital.id</a>.`,
        imageUrl: "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?q=80&w=1974&auto=format&fit=crop"
      },
      {
        title: "Cara Mix & Match Denim Jacket untuk Tampilan Kasual",
        slug: "mix-match-denim-jacket",
        excerpt: "Jaket denim adalah pakaian esensial. Temukan berbagai cara cerdas memadukannya untuk gaya hangout sehari-hari.",
        content: `Jaket denim adalah salah satu outerwear paling serbaguna yang pernah ada. Anda bisa memadukannya dengan hampir semua hal.\n\n**Gaya 'Double Denim' (Canadian Tuxedo)**\nJika ingin mengenakan jaket denim dengan celana denim, pastikan keduanya memiliki kontras warna. Misalnya, jaket biru terang dengan celana hitam pekat, atau sebaliknya.\n\n**Opsi Layering**\nKenakan jaket denim di atas hoodie abu-abu untuk tampilan santai yang tetap stylish di musim hujan. Pastikan Anda merencanakan konten fashion Anda dengan strategi digital bersama <a href='https://lspdigital.id' target='_blank' rel='noopener noreferrer'>lspdigital.id</a>.`,
        imageUrl: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ea?q=80&w=2070&auto=format&fit=crop"
      },
      {
        title: "Mengapa Denim Jepang Dianggap yang Terbaik di Dunia?",
        slug: "mengapa-denim-jepang-terbaik",
        excerpt: "Dari teknik pewarnaan tradisional hingga mesin tenun antik, Jepang telah menyempurnakan seni pembuatan denim.",
        content: `Setelah Perang Dunia II, Jepang sangat terobsesi dengan budaya Amerika, termasuk jeans. Mereka mulai membeli mesin tenun shuttle loom kuno dari Amerika yang sudah tidak dipakai karena dianggap tidak efisien.\n\nDengan mesin ini dan komitmen pada kualitas yang luar biasa tinggi (monozukuri), pengrajin Jepang memproduksi denim yang lebih kaya tekstur dan warna (indigo dye) dibandingkan denim massal zaman modern.\n\nDenim Jepang adalah simbol presisi dan kualitas. Dapatkan presisi dalam kampanye digital Anda dengan sertifikasi dari <a href='https://lspdigital.id' target='_blank' rel='noopener noreferrer'>lspdigital.id</a>.`,
        imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1926&auto=format&fit=crop"
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
      alert('6 sample articles seeded!');
      loadData();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'articles');
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <div className="bg-white p-8 rounded shadow text-center max-w-sm w-full">
           <h1 className="text-2xl font-serif text-brand-charcoal mb-4">NAKADUO Admin</h1>
           <button onClick={loginWithGoogle} className="bg-brand-charcoal text-white px-6 py-2 rounded font-medium hover:bg-black w-full">
             Login dengan Google
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-serif text-brand-charcoal">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-stone-600">{user.email}</span>
            <button onClick={logout} className="text-sm text-red-600 hover:underline">Logout</button>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-xl font-medium mb-4">Ubah Konten Landing Page</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-stone-600 mb-1">Headline Hero</label>
              <input value={content.headline} onChange={e => setContent({...content, headline: e.target.value})} className="w-full border p-2" />
            </div>
            <div>
              <label className="block text-sm text-stone-600 mb-1">Tagline (Kata Akhir)</label>
              <input value={content.tagline} onChange={e => setContent({...content, tagline: e.target.value})} className="w-full border p-2" />
            </div>
            <div>
              <label className="block text-sm text-stone-600 mb-1">Deskripsi Hero & Meta Description</label>
              <textarea value={content.description} onChange={e => setContent({...content, description: e.target.value})} className="w-full border p-2 h-24" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-stone-600 mb-1">Hero Image 1 (URL)</label>
                <input value={content.heroImage1 || ''} onChange={e => setContent({...content, heroImage1: e.target.value})} className="w-full border p-2" />
                <label className="block text-xs mt-1">Atau Upload:</label>
                <input type="file" accept="image/*" onChange={e => handleImageProcess(e, url => setContent({...content, heroImage1: url}))} className="w-full text-sm" />
              </div>
              <div>
                <label className="block text-sm text-stone-600 mb-1">Hero Image 2 (URL)</label>
                <input value={content.heroImage2 || ''} onChange={e => setContent({...content, heroImage2: e.target.value})} className="w-full border p-2" />
                <label className="block text-xs mt-1">Atau Upload:</label>
                <input type="file" accept="image/*" onChange={e => handleImageProcess(e, url => setContent({...content, heroImage2: url}))} className="w-full text-sm" />
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Section: Why Choose Us</h3>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <input placeholder="Headline" value={content.whyHeadline || ''} onChange={e => setContent({...content, whyHeadline: e.target.value})} className="w-full border p-2" />
                <input placeholder="Subheadline" value={content.whySubheadline || ''} onChange={e => setContent({...content, whySubheadline: e.target.value})} className="w-full border p-2" />
              </div>
              <textarea placeholder="Deskripsi Why Choose Us" value={content.whyDescription || ''} onChange={e => setContent({...content, whyDescription: e.target.value})} className="w-full border p-2 h-20" />
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Section: Care Guide</h3>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <input placeholder="Headline" value={content.careHeadline || ''} onChange={e => setContent({...content, careHeadline: e.target.value})} className="w-full border p-2" />
                <input placeholder="Subheadline" value={content.careSubheadline || ''} onChange={e => setContent({...content, careSubheadline: e.target.value})} className="w-full border p-2" />
              </div>
              <textarea placeholder="Deskripsi Care Guide" value={content.careDescription || ''} onChange={e => setContent({...content, careDescription: e.target.value})} className="w-full border p-2 h-20" />
              <div>
                <label className="block text-sm text-stone-600 mb-1">Care Image (URL)</label>
                <input value={content.careImage || ''} onChange={e => setContent({...content, careImage: e.target.value})} className="w-full border p-2" />
                <label className="block text-xs mt-1">Atau Upload:</label>
                <input type="file" accept="image/*" onChange={e => handleImageProcess(e, url => setContent({...content, careImage: url}))} className="w-full text-sm" />
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Section: Testimonial</h3>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <input placeholder="Headline" value={content.testimonialHeadline || ''} onChange={e => setContent({...content, testimonialHeadline: e.target.value})} className="w-full border p-2" />
                <input placeholder="Subheadline" value={content.testimonialSubheadline || ''} onChange={e => setContent({...content, testimonialSubheadline: e.target.value})} className="w-full border p-2" />
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Section: Gallery</h3>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <input placeholder="Headline" value={content.galleryHeadline || ''} onChange={e => setContent({...content, galleryHeadline: e.target.value})} className="w-full border p-2" />
                <input placeholder="Subheadline" value={content.gallerySubheadline || ''} onChange={e => setContent({...content, gallerySubheadline: e.target.value})} className="w-full border p-2" />
              </div>
              <textarea placeholder="Deskripsi Gallery" value={content.galleryDescription || ''} onChange={e => setContent({...content, galleryDescription: e.target.value})} className="w-full border p-2 h-20" />
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Section: FAQ</h3>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <input placeholder="Headline" value={content.faqHeadline || ''} onChange={e => setContent({...content, faqHeadline: e.target.value})} className="w-full border p-2" />
                <input placeholder="Subheadline (Kata Akhir)" value={content.faqSubheadline || ''} onChange={e => setContent({...content, faqSubheadline: e.target.value})} className="w-full border p-2" />
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Section: Footer</h3>
              <input placeholder="Footer Headline" value={content.footerHeadline || ''} onChange={e => setContent({...content, footerHeadline: e.target.value})} className="w-full border p-2 mb-2" />
              <textarea placeholder="Footer Description" value={content.footerDesc || ''} onChange={e => setContent({...content, footerDesc: e.target.value})} className="w-full border p-2 h-20 mb-2" />
              <input placeholder="Footer Address" value={content.footerAddress || ''} onChange={e => setContent({...content, footerAddress: e.target.value})} className="w-full border p-2" />
            </div>

            <div className="pt-4 border-t">
              <label className="block text-sm text-stone-600 mb-1">Meta Keywords (pisahkan dengan koma)</label>
              <input value={content.metaKeywords} onChange={e => setContent({...content, metaKeywords: e.target.value})} className="w-full border p-2" />
            </div>
            <div>
              <label className="block text-sm text-stone-600 mb-1">Meta Author</label>
              <input value={content.metaAuthor} onChange={e => setContent({...content, metaAuthor: e.target.value})} className="w-full border p-2" />
            </div>
            <button onClick={handleSaveContent} className="bg-brand-charcoal text-white px-4 py-2 mt-2">Simpan Konten</button>
          </div>
        </div>

        {/* Settings Section */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-xl font-medium mb-4">Pengaturan Web</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-stone-600 mb-1">Nomor WhatsApp Admin (08xxx)</label>
              <input value={settings.waAdmin} onChange={e => setSettings({...settings, waAdmin: e.target.value})} className="w-full border p-2" />
            </div>
            <div>
              <label className="block text-sm text-stone-600 mb-1">Logo URL (Optional)</label>
              <input value={settings.logoUrl} onChange={e => setSettings({...settings, logoUrl: e.target.value})} className="w-full border p-2" />
            </div>
            <div>
              <label className="block text-sm text-stone-600 mb-1">Favicon URL (Optional)</label>
              <input value={settings.faviconUrl} onChange={e => setSettings({...settings, faviconUrl: e.target.value})} className="w-full border p-2" />
            </div>
            <button onClick={handleSaveSettings} className="bg-brand-charcoal text-white px-4 py-2 mt-2">Simpan Pengaturan</button>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-xl font-medium mb-4">Tambah Produk Baru</h2>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Nama Produk" className="border p-2" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
            <input placeholder="Harga (Angka)" type="number" className="border p-2" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
            <div className="col-span-2 border p-2">
              <label className="block text-sm text-stone-600 mb-1">Image (URL atau Upload)</label>
              <input placeholder="Image URL" className="w-full border p-2 mb-2" value={newProduct.imageUrl} onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})} />
              <input type="file" accept="image/*" onChange={e => handleImageProcess(e, url => setNewProduct({...newProduct, imageUrl: url}))} className="w-full text-sm" />
            </div>
            <input placeholder="Fit (Slim, Reguler)" className="border p-2" value={newProduct.fit} onChange={e => setNewProduct({...newProduct, fit: e.target.value})} />
            <input placeholder="Negara Asal" className="border p-2" value={newProduct.countryOfOrigin} onChange={e => setNewProduct({...newProduct, countryOfOrigin: e.target.value})} />
            <input placeholder="Stok" type="number" className="border p-2" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})} />
            <input placeholder="Marketplace Link (Opsional)" className="border p-2" value={newProduct.marketplaceLink} onChange={e => setNewProduct({...newProduct, marketplaceLink: e.target.value})} />
          </div>
          <button onClick={handleAddProduct} className="bg-brand-bronze text-white px-4 py-2 mt-4 hover:bg-yellow-700">Tambah Produk</button>
          
          <div className="mt-8">
            <h3 className="font-medium mb-4">Daftar Produk:</h3>
            {products.map(p => (
               <div key={p.id} className="border-t py-2 flex justify-between items-center">
                 <div>{p.name} - Rp{p.price}</div>
                 <div className="text-sm bg-gray-200 px-2 py-1">{p.fit}</div>
               </div>
            ))}
          </div>
        </div>

        {/* Articles Section */}
        <div className="bg-white p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-medium">Manajemen Artikel</h2>
             <button onClick={seedArticles} className="text-xs bg-brand-charcoal text-white px-4 py-2 font-bold ring-2 ring-offset-1 ring-brand-bronze animate-pulse uppercase tracking-widest cursor-pointer">Inject 6 Sample Articles</button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <input placeholder="Judul Artikel" className="border p-2" value={newArticle.title} onChange={e => setNewArticle({...newArticle, title: e.target.value})} />
            <input placeholder="Slug (contoh: panduan-memilih-denim)" className="border p-2" value={newArticle.slug} onChange={e => setNewArticle({...newArticle, slug: e.target.value})} />
            <textarea placeholder="Excerpt (Ringkasan Singkat)" className="border p-2 h-16" value={newArticle.excerpt} onChange={e => setNewArticle({...newArticle, excerpt: e.target.value})} />
            <textarea placeholder="Konten Artikel (Mendukung Markdown/HTML)" className="border p-2 h-32" value={newArticle.content} onChange={e => setNewArticle({...newArticle, content: e.target.value})} />
            <div className="border p-2">
              <label className="block text-sm text-stone-600 mb-1">Image (URL atau Upload)</label>
              <input placeholder="Image URL" className="w-full border p-2 mb-2" value={newArticle.imageUrl} onChange={e => setNewArticle({...newArticle, imageUrl: e.target.value})} />
              <input type="file" accept="image/*" onChange={e => handleImageProcess(e, url => setNewArticle({...newArticle, imageUrl: url}))} className="w-full text-sm" />
            </div>
          </div>
          <button onClick={handleSaveArticle} className="bg-brand-bronze text-white px-4 py-2 mt-4 hover:bg-yellow-700">
            {editingArticleId ? 'Update Artikel' : 'Tambah Artikel'}
          </button>
          {editingArticleId && (
            <button onClick={() => { setEditingArticleId(null); setNewArticle({title:"", slug:"", content:"", excerpt:"", imageUrl:""}); }} className="ml-2 text-stone-500 hover:text-black">Batal Edit</button>
          )}
          
          <div className="mt-8">
            <h3 className="font-medium mb-4">Daftar Artikel:</h3>
            {articles.map(a => (
               <div key={a.id} className="border-t py-3 flex justify-between items-center group">
                 <div className="flex-1">
                   <div className="font-medium">{a.title}</div>
                   <div className="text-xs text-stone-500" style={{fontFamily:"monospace"}}>{a.slug}</div>
                 </div>
                 <div className="flex gap-3 ml-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                   <button onClick={() => handleEditArticle(a)} className="text-sm text-blue-600 hover:underline">Edit</button>
                   <button onClick={() => handleDeleteArticle(a.id)} className="text-sm text-red-600 hover:underline">Hapus</button>
                 </div>
               </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
