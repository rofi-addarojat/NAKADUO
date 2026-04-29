import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType, loginWithGoogle, logout } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Content State
  const [content, setContent] = useState({
    headline: "Investasi Gaya dalam Setiap Langkahmu.",
    description: "Koleksi celana denim dan streetwear impor pilihan dengan kualitas material premium untuk tampilan keren dan percaya diri setiap hari.",
    tagline: "Setiap Langkahmu.",
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
      </div>
    </div>
  );
}
