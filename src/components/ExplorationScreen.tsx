import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductDetailView } from './ProductDetailView';
import { brandSections, personaSection } from '../data/brandData';
import { SearchIcon } from './Icons';
import type { ProductItem } from '../types';

interface ExplorationScreenProps {
  shortlistCount: number;
  quizCompleted: boolean;
  isInShortlist: (id: string) => boolean;
  isLiked: (id: string) => boolean;
  onToggleItem: (id: string) => void;
  onToggleLike: (id: string) => void;
  onExit: () => void;
}

export function ExplorationScreen({
  shortlistCount,
  quizCompleted,
  isInShortlist,
  isLiked,
  onToggleItem,
  onToggleLike,
  onExit,
}: ExplorationScreenProps) {
  const [selectedItem, setSelectedItem] = useState<ProductItem | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchText, setSearchText] = useState('');

  return (
    <motion.div
      className="absolute inset-0 bg-white z-20 flex flex-col"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ touchAction: 'none' }}
      drag="y"
      dragConstraints={{ top: 0 }}
      dragElastic={{ top: 0, bottom: 0.6 }}
      onDragEnd={(_e, info) => {
        if (info.offset.y > 80 || info.velocity.y > 300) {
          onExit();
        }
      }}
    >
      {/* Drag handle */}
      <div
        onClick={onExit}
        style={{ paddingTop: 12, paddingBottom: 4, display: 'flex', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
      >
        <div style={{ width: 36, height: 5, background: '#d4d4d4', borderRadius: 3 }} />
      </div>

      {/* Top nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 24px 12px', flexShrink: 0 }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 400, color: '#1a1a1a' }}>
          Explore Looks
        </h1>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1a1a1a', color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {shortlistCount}
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 40 }} className="hide-scrollbar">
        {/* Search bar */}
        <div style={{ padding: '0 20px', marginBottom: 20 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#fff', borderRadius: 20, padding: '12px 16px',
            border: searchFocused ? '1.5px solid #d0d5ff' : '1.5px solid transparent',
            transition: 'border-color 0.2s',
          }}>
            <SearchIcon style={{ flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search brands or items..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: '#1a1a1a', fontFamily: 'inherit' }}
            />
          </div>
        </div>

        {/* For You — Persona section after quiz completion */}
        {quizCompleted && (
          <div style={{ marginBottom: 28, background: '#1a1a1a', padding: '20px 0 20px', margin: '0 0 28px' }}>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 18, fontWeight: 400, color: '#fff',
              padding: '0 20px', marginBottom: 4,
            }}>
              For You
            </h2>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', padding: '0 20px', marginBottom: 16, letterSpacing: '0.03em' }}>
              Deconstructionist · Based on your style
            </p>

            <div
              style={{ display: 'flex', gap: 16, overflowX: 'auto', padding: '0 20px' }}
              className="hide-scrollbar"
            >
              {personaSection.clusters.map((cluster) => (
                <motion.button
                  key={cluster.outfit.id}
                  onClick={() => setSelectedItem(cluster.outfit)}
                  style={{
                    flexShrink: 0, border: 'none', padding: 0,
                    background: 'transparent', cursor: 'pointer', textAlign: 'left',
                    display: 'flex', flexDirection: 'column', gap: 6,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div style={{
                    width: 160, height: 240, background: '#2a2a2a', borderRadius: 12,
                    overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                  }}>
                    {cluster.outfit.image && (
                      <img src={cluster.outfit.image} alt={cluster.outfit.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                    )}
                  </div>
                  <p style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.7)', paddingLeft: 2 }}>
                    {cluster.outfit.brand}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Brand sections — horizontal scroll */}
        {brandSections.map((section, sectionIndex) => (
          <div key={section.brand} style={{ marginBottom: 28 }}>
            {/* Section title */}
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 18, fontWeight: 400, color: '#1a1a1a',
              padding: '0 20px', marginBottom: 14,
            }}>
              {section.brand}
            </h2>

            {/* Horizontal scroll container */}
            <div
              style={{ display: 'flex', gap: 16, overflowX: 'auto', padding: '0 20px' }}
              className="hide-scrollbar"
            >
              {section.clusters.map((cluster, clusterIndex) => {
                const flipLayout = (sectionIndex + clusterIndex) % 2 === 1;

                return (
                  <div
                    key={cluster.outfit.id}
                    style={{
                      display: 'flex',
                      gap: 10,
                      flexShrink: 0,
                      width: 'calc(100vw - 56px)',
                      height: 320,
                      flexDirection: flipLayout ? 'row-reverse' : 'row',
                    }}
                  >
                    {/* Large outfit card */}
                    <motion.button
                      onClick={() => setSelectedItem(cluster.outfit)}
                      style={{
                        width: '55%', flexShrink: 0, border: 'none', padding: 0,
                        background: 'transparent', cursor: 'pointer', textAlign: 'left',
                        display: 'flex', flexDirection: 'column',
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div style={{
                        width: '100%', flex: 1, background: '#fff', borderRadius: 12,
                        overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                      }}>
                        {cluster.outfit.image ? (
                          <img src={cluster.outfit.image} alt={cluster.outfit.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                        ) : (
                          <span style={{ fontSize: 11, color: '#bbb' }}>Outfit</span>
                        )}
                      </div>
                    </motion.button>

                    {/* Small product cards stacked — match large card height */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {cluster.products.map((product) => (
                        <div
                          key={product.id}
                          style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
                        >
                          <motion.button
                            onClick={() => setSelectedItem(product)}
                            style={{
                              flex: 1, border: 'none', padding: 0,
                              background: '#fff', cursor: 'pointer',
                              borderRadius: 10, overflow: 'hidden',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              minHeight: 0,
                            }}
                            whileTap={{ scale: 0.97 }}
                          >
                            {product.image ? (
                              <img src={product.image} alt={product.name} loading="lazy" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                            ) : (
                              <span style={{ fontSize: 10, color: '#bbb' }}>Product</span>
                            )}
                          </motion.button>
                          <p style={{
                            fontSize: 10, color: '#999', marginTop: 3,
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            lineHeight: 1.2, height: 13, flexShrink: 0,
                          }}>
                            {product.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Product detail overlay */}
      <AnimatePresence>
        {selectedItem && (
          <ProductDetailView
            key={selectedItem.id}
            id={selectedItem.id}
            brand={selectedItem.brand}
            name={selectedItem.name}
            price={selectedItem.price}
            image={selectedItem.image}
            images={selectedItem.images}
            pieces={selectedItem.pieces?.map(p => ({ id: p.id, brand: p.brand, name: p.name, price: p.price, image: p.image, images: p.images }))}
            viewType={selectedItem.type}
            isInShortlist={isInShortlist(selectedItem.id)}
            isLiked={isLiked}
            onToggleShortlist={() => onToggleItem(selectedItem.id)}
            onToggleLike={onToggleLike}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
