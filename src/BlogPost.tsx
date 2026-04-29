import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchArticle() {
      try {
        const q = query(collection(db, 'articles'), where('slug', '==', slug));
        const snap = await getDocs(q);
        
        if (!snap.empty) {
          setArticle({ id: snap.docs[0].id, ...snap.docs[0].data() });
        } else {
          navigate('/blog');
        }
      } catch (err) {
        console.error("Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchArticle();
  }, [slug, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-brand-canvas text-stone-400 font-mono text-sm uppercase tracking-widest animate-pulse">Loading...</div>;
  }

  if (!article) return null;

  return (
    <article className="min-h-screen bg-brand-canvas text-brand-charcoal pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <Link to="/blog" className="inline-flex items-center text-sm font-mono tracking-widest uppercase hover:text-brand-bronze transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Journal
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-stone-400 mb-6">
            {new Date(article.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-brand-charcoal max-w-3xl mx-auto leading-tight mb-8">
            {article.title}
          </h1>
        </motion.div>
      </div>

      {article.imageUrl && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20"
        >
          <div className="aspect-[21/9] md:aspect-[2/1] relative overflow-hidden bg-stone-200">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-full object-cover filter brightness-95"
            />
          </div>
        </motion.div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="prose prose-stone prose-lg prose-headings:font-serif prose-headings:font-normal prose-a:text-brand-bronze hover:prose-a:text-black prose-img:rounded-none max-w-none prose-p:font-light prose-p:text-stone-600 prose-p:leading-relaxed"
        >
          <div className="markdown-body">
            <Markdown rehypePlugins={[rehypeRaw]}>{article.content}</Markdown>
          </div>
        </motion.div>
        
        <div className="mt-20 pt-10 border-t border-brand-charcoal/10 flex justify-between items-center">
           <Link to="/blog" className="inline-flex items-center text-xs font-mono tracking-widest uppercase hover:text-brand-bronze transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            More Articles
          </Link>
        </div>
      </div>
    </article>
  );
}
