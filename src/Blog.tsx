import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

export default function Blog() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setArticles(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-brand-canvas text-brand-charcoal pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center text-sm font-mono tracking-widest uppercase hover:text-brand-bronze transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
        
        <div className="mb-20">
          <span className="text-brand-bronze font-mono uppercase tracking-[0.2em] text-[10px] mb-4 block">Journal</span>
          <h1 className="text-5xl lg:text-7xl font-serif text-brand-charcoal mb-4">Nakaduo <span className="italic font-light">Journal</span></h1>
          <p className="text-stone-500 font-light max-w-lg text-lg">Inspirasi, panduan gaya, dan cerita di balik kultus denim dan streetwear impor.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-stone-400 font-mono text-sm uppercase tracking-widest animate-pulse">Loading Journal...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {articles.map((article, idx) => (
              <motion.article 
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                className="group cursor-pointer flex flex-col"
              >
                <Link to={`/blog/${article.slug}`} className="flex-1 flex flex-col">
                  <div className="aspect-[4/3] overflow-hidden mb-6 relative bg-stone-200">
                    <img 
                      src={article.imageUrl || "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=2070&auto=format&fit=crop"} 
                      alt={article.title}
                      className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 group-hover:brightness-100 transition-all duration-[1.5s]"
                    />
                    <div className="absolute inset-0 bg-brand-charcoal/0 group-hover:bg-brand-charcoal/10 transition-colors duration-500"></div>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-stone-400 mb-3">
                      {new Date(article.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <h2 className="text-2xl font-serif text-brand-charcoal mb-4 group-hover:text-brand-bronze transition-colors flex-1">{article.title}</h2>
                    <p className="text-stone-500 font-light leading-relaxed text-sm mb-6 line-clamp-3">{article.excerpt}</p>
                    
                    <div className="mt-auto flex items-center text-[10px] font-mono tracking-[0.2em] uppercase transition-colors">
                      <span className="border-b border-brand-charcoal pb-1 group-hover:border-brand-bronze group-hover:text-brand-bronze">Read Article</span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
