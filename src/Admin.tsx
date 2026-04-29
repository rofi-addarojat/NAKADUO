import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType, loginWithGoogle, logout } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Content State
  const [content, setContent] = useState({
    headline: "Esensi Ketegasan dalam Gaya Autentik.",
    description: "Dikurasi khusus untuk pria yang memahami bahwa kualitas tidak bisa dikompromikan. Koleksi denim impor dan streetwear dengan material premium yang membentuk karakter Anda.",
    tagline: "Gaya Autentik.",
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
    } catch (e) {
      console.error(e);
    }
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
              <label className="block text-sm text-stone-600 mb-1">Headline</label>
              <input value={content.headline} onChange={e => setContent({...content, headline: e.target.value})} className="w-full border p-2" />
            </div>
            <div>
              <label className="block text-sm text-stone-600 mb-1">Tagline (Kata Akhir)</label>
              <input value={content.tagline} onChange={e => setContent({...content, tagline: e.target.value})} className="w-full border p-2" />
            </div>
            <div>
              <label className="block text-sm text-stone-600 mb-1">Deskripsi Utama</label>
              <textarea value={content.description} onChange={e => setContent({...content, description: e.target.value})} className="w-full border p-2 h-24" />
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
            <input placeholder="Image URL" className="border p-2 col-span-2" value={newProduct.imageUrl} onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})} />
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
             <button onClick={seedArticles} className="text-xs bg-stone-200 text-stone-700 px-3 py-1 rounded">Seed 6 Sample Articles</button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <input placeholder="Judul Artikel" className="border p-2" value={newArticle.title} onChange={e => setNewArticle({...newArticle, title: e.target.value})} />
            <input placeholder="Slug (contoh: panduan-memilih-denim)" className="border p-2" value={newArticle.slug} onChange={e => setNewArticle({...newArticle, slug: e.target.value})} />
            <textarea placeholder="Excerpt (Ringkasan Singkat)" className="border p-2 h-16" value={newArticle.excerpt} onChange={e => setNewArticle({...newArticle, excerpt: e.target.value})} />
            <textarea placeholder="Konten Artikel (Mendukung HTML)" className="border p-2 h-32" value={newArticle.content} onChange={e => setNewArticle({...newArticle, content: e.target.value})} />
            <input placeholder="Image URL" className="border p-2" value={newArticle.imageUrl} onChange={e => setNewArticle({...newArticle, imageUrl: e.target.value})} />
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
