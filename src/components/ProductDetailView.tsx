import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { allPieces } from '../data/brandData';
import { HeartIcon, ShareIcon, MoreDotsIcon, BackChevron, CloseIcon } from './Icons';

interface PieceData {
  id: string;
  brand: string;
  name: string;
  price: string;
  image?: string;
  images?: string[];
}

interface SimilarItem {
  id: string;
  brand: string;
  name: string;
  price: string;
  image?: string;
}

interface ProductDetailProps {
  brand: string;
  name: string;
  price: string;
  id: string;
  image?: string;
  images?: string[];
  pieces?: PieceData[];
  viewType?: 'outfit' | 'product';
  isInShortlist: boolean;
  isLiked: (id: string) => boolean;
  onToggleShortlist: () => void;
  onToggleLike: (id: string) => void;
  onClose: () => void;
}

// Get 4 similar items for a product, deterministic based on product id
function getSimilarItems(currentId: string): SimilarItem[] {
  // Simple hash from id string to get a deterministic offset
  let hash = 0;
  for (let i = 0; i < currentId.length; i++) {
    hash = ((hash << 5) - hash) + currentId.charCodeAt(i);
    hash |= 0;
  }
  const candidates = allPieces.filter(p => p.id !== currentId && p.image);
  if (candidates.length === 0) return [];
  const offset = Math.abs(hash) % candidates.length;
  const result: SimilarItem[] = [];
  for (let i = 0; i < 4 && i < candidates.length; i++) {
    const item = candidates[(offset + i) % candidates.length];
    result.push({ id: item.id, brand: item.brand, name: item.name, price: item.price, image: item.image });
  }
  return result;
}

export function ProductDetailView({
  brand,
  name,
  price,
  id,
  image,
  images,
  pieces,
  viewType = 'outfit',
  isInShortlist,
  isLiked,
  onToggleLike,
  onToggleShortlist,
  onClose,
}: ProductDetailProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<PieceData | null>(null);
  const [focusedImage, setFocusedImage] = useState(false);
  const [pieceImageIndex, setPieceImageIndex] = useState(0);

  const selfSimilarItems = useMemo(() => getSimilarItems(brand + name), [brand, name]);
  const pieceSimilarItems = useMemo(() => selectedPiece ? getSimilarItems(selectedPiece.id) : [], [selectedPiece]);

  // Compute focus mode carousel images (used by the overlay rendered at the bottom)
  const activePieceForFocus = viewType === 'product' && !selectedPiece
    ? { id: 'self', brand, name, price, image, images }
    : selectedPiece;
  const focusCarouselImages = activePieceForFocus?.images && activePieceForFocus.images.length > 0
    ? activePieceForFocus.images
    : activePieceForFocus?.image ? [activePieceForFocus.image] : [];
  const focusImageCount = focusCarouselImages.length;

  // Track drag state for focus mode tap-to-dismiss vs swipe-to-navigate
  const isDraggingRef = useRef(false);

  // Focus mode overlay — rendered inside each view, not as an early return
  const focusOverlay = (
    <AnimatePresence>
      {focusedImage && activePieceForFocus && (
        <motion.div
          key="focus-overlay"
          style={{ position: 'absolute', inset: 0, zIndex: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          onClick={() => { if (!isDraggingRef.current) setFocusedImage(false); }}
        >
          <div style={{ position: 'absolute', inset: 0, background: '#fff' }} />
          <motion.button
            onClick={(e) => { e.stopPropagation(); setFocusedImage(false); }}
            style={{ position: 'absolute', top: 16, left: 16, width: 40, height: 40, borderRadius: 20, background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}
            whileTap={{ scale: 0.9 }}
          >
            <CloseIcon size={16} />
          </motion.button>
          <motion.div
            style={{ width: '85%', aspectRatio: '1', background: '#fff', borderRadius: 12, overflow: 'hidden', position: 'relative', zIndex: 1 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragStart={() => { isDraggingRef.current = true; }}
            onDragEnd={(_e, info) => {
              if (Math.abs(info.offset.x) > 10) {
                if (info.offset.x < -50 && pieceImageIndex < focusImageCount - 1) setPieceImageIndex(prev => prev + 1);
                else if (info.offset.x > 50 && pieceImageIndex > 0) setPieceImageIndex(prev => prev - 1);
              }
              setTimeout(() => { isDraggingRef.current = false; }, 50);
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {focusCarouselImages[pieceImageIndex] ? (
              <img src={focusCarouselImages[pieceImageIndex]} alt={activePieceForFocus.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} loading="lazy" />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 12, color: '#bbb' }}>Product image</span>
              </div>
            )}
          </motion.div>
          {focusImageCount > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '16px 0', position: 'relative', zIndex: 1 }}>
              {focusCarouselImages.map((_, i) => (
                <div key={i} onClick={(e) => { e.stopPropagation(); setPieceImageIndex(i); }} style={{ width: 8, height: 8, borderRadius: '50%', background: i === pieceImageIndex ? '#1a1a1a' : '#ddd', cursor: 'pointer' }} />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  // For product viewType (clicked from explore), render as standalone piece detail
  if (viewType === 'product') {
    const selfPiece = { id: 'self', brand, name, price, image, images };
    const carouselImages = selfPiece.images && selfPiece.images.length > 0
      ? selfPiece.images
      : selfPiece.image ? [selfPiece.image] : [];
    const imageCount = carouselImages.length;

    return (
      <motion.div
        className="absolute inset-0 z-30 flex flex-col"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
        style={{ background: '#fff' }}
      >
        <div style={{ padding: '12px 20px 8px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <motion.button
            onClick={onClose}
              style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer' }}
              whileTap={{ scale: 0.9 }}
            >
              <BackChevron />
            </motion.button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }} className="hide-scrollbar">
            <motion.div
              onClick={() => setFocusedImage(true)}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.3}
              onDragEnd={(_e, info) => {
                if (info.offset.x < -50 && pieceImageIndex < imageCount - 1) setPieceImageIndex(prev => prev + 1);
                else if (info.offset.x > 50 && pieceImageIndex > 0) setPieceImageIndex(prev => prev - 1);
              }}
              style={{ margin: '0 20px', background: '#fff', borderRadius: 12, aspectRatio: '4/5', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
            >
              {carouselImages[pieceImageIndex] ? (
                <img src={carouselImages[pieceImageIndex]} alt={selfPiece.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} loading="lazy" />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 12, color: '#bbb' }}>Product image</span>
                </div>
              )}
            </motion.div>
            {imageCount > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '12px 0' }}>
                {carouselImages.map((_, i) => (
                  <div key={i} onClick={() => setPieceImageIndex(i)} style={{ width: 8, height: 8, borderRadius: '50%', background: i === pieceImageIndex ? '#1a1a1a' : '#ddd', cursor: 'pointer' }} />
                ))}
              </div>
            )}
            <div style={{ padding: '0 24px 8px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 16, fontWeight: 500, color: '#1a1a1a' }}>{selfPiece.brand}</p>
                <p style={{ fontSize: 14, color: '#666', marginTop: 2 }}>{selfPiece.name}</p>
                <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a', marginTop: 4 }}>{selfPiece.price}</p>
              </div>
              <div style={{ display: 'flex', gap: 16, paddingTop: 4 }}>
                <motion.button onClick={() => onToggleLike(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} whileTap={{ scale: 1.3 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
                  <HeartIcon fill={isLiked(id) ? '#e74c3c' : 'none'} stroke={isLiked(id) ? '#e74c3c' : '#1a1a1a'} />
                </motion.button>
                <ShareIcon />
              </div>
            </div>
            <div style={{ padding: '12px 24px 20px' }}>
              <motion.button onClick={onToggleShortlist} style={{ width: '100%', height: 52, borderRadius: 26, background: isInShortlist ? '#fff' : '#1a1a1a', color: isInShortlist ? '#1a1a1a' : '#fff', border: isInShortlist ? '1.5px solid #d4d4d4' : 'none', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} whileTap={{ scale: 0.97 }}>
                {isInShortlist ? 'Added to try-on list ✓' : 'Add to try-on list'}
              </motion.button>
            </div>
            <div style={{ padding: '0 24px 40px' }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a', marginBottom: 12 }}>Similar Items</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {selfSimilarItems.map((item) => (
                  <div key={item.id} style={{ cursor: 'pointer' }}>
                    <div style={{ width: '100%', aspectRatio: '3/4', background: '#fff', borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} loading="lazy" /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 10, color: '#bbb' }}>Image</span></div>}
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 500, color: '#1a1a1a', marginTop: 6 }}>{item.brand}</p>
                    <p style={{ fontSize: 11, color: '#999' }}>{item.name}</p>
                    <p style={{ fontSize: 11, fontWeight: 500, color: '#1a1a1a', marginTop: 2 }}>{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        {focusOverlay}
      </motion.div>
    );
  }

  // Outfit view — always rendered. Piece detail overlays on top via AnimatePresence.
  const pieceCarouselImages = selectedPiece
    ? (selectedPiece.images && selectedPiece.images.length > 0 ? selectedPiece.images : selectedPiece.image ? [selectedPiece.image] : [])
    : [];
  const pieceImageCount = pieceCarouselImages.length;

  return (
    <motion.div
      className="absolute inset-0 z-30"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
      style={{ background: '#fff' }}
    >
      {/* Outfit view — always visible behind piece overlay */}
      <div className="absolute inset-0 flex flex-col">
        {/* Drag handle */}
        <div onClick={onClose} style={{ paddingTop: 12, paddingBottom: 4, display: 'flex', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <div style={{ width: 36, height: 5, background: '#d4d4d4', borderRadius: 3 }} />
        </div>

        {/* Top bar */}
        <div style={{ padding: '4px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <motion.button onClick={onClose} style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer' }} whileTap={{ scale: 0.9 }}>
            <BackChevron />
          </motion.button>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 500, color: '#1a1a1a', marginRight: 8 }}>Doji</span>
        </div>

        {/* Outfit image */}
        <div onClick={() => setShowBreakdown(true)} style={{ flex: 1, margin: 0, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0, position: 'relative', cursor: 'pointer', overflow: 'hidden' }}>
          {image ? (
            <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} loading="lazy" />
          ) : (
            <span style={{ fontSize: 12, color: '#bbb' }}>Full outfit on model</span>
          )}
          <div style={{ position: 'absolute', right: 16, bottom: 60, display: 'flex', flexDirection: 'column', gap: 16 }} onClick={e => e.stopPropagation()}>
            <motion.button onClick={() => onToggleLike(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} whileTap={{ scale: 1.3 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
              <HeartIcon fill={isLiked(id) ? '#e74c3c' : 'none'} stroke={isLiked(id) ? '#e74c3c' : '#1a1a1a'} />
            </motion.button>
            <ShareIcon />
            <MoreDotsIcon />
          </div>
        </div>

        {/* Bottom info */}
        <div style={{ padding: '12px 24px 8px' }}>
          <p style={{ fontSize: 14, color: '#1a1a1a' }}><span style={{ fontWeight: 500 }}>{brand}</span> {name}</p>
          <p style={{ fontSize: 13, color: '#999', marginTop: 2 }}>{price}</p>
        </div>

        {/* Try-on button */}
        <div style={{ padding: '8px 24px 36px' }}>
          <motion.button onClick={onToggleShortlist} style={{ width: '100%', height: 52, borderRadius: 26, background: isInShortlist ? '#fff' : '#1a1a1a', color: isInShortlist ? '#1a1a1a' : '#fff', border: isInShortlist ? '1.5px solid #d4d4d4' : 'none', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} whileTap={{ scale: 0.97 }}>
            {isInShortlist ? 'Added ✓' : 'Add to try-on list'}
          </motion.button>
        </div>

        {/* In the Look breakdown sheet */}
        <AnimatePresence>
          {showBreakdown && (
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={0.15}
              onDragEnd={(_e: MouseEvent | TouchEvent | PointerEvent, info: { offset: { y: number }; velocity: { y: number } }) => {
                if (info.offset.y > 40 || info.velocity.y > 200) setShowBreakdown(false);
              }}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0, borderRadius: '20px 20px 0 0', padding: '12px 0 0', background: '#fff', zIndex: 5, boxShadow: '0 -8px 30px rgba(0,0,0,0.12)' }}
            >
              <div onClick={() => setShowBreakdown(false)} style={{ display: 'flex', justifyContent: 'center', paddingBottom: 10, cursor: 'pointer' }}>
                <div style={{ width: 36, height: 5, background: '#d4d4d4', borderRadius: 3 }} />
              </div>
              <p style={{ fontSize: 16, fontWeight: 500, color: '#1a1a1a', textAlign: 'center', marginBottom: 16, fontFamily: "'Playfair Display', Georgia, serif" }}>In the Look</p>
              <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '0 24px 16px' }} className="hide-scrollbar">
                {(pieces || []).map((piece) => (
                  <motion.button key={piece.id} onClick={() => { setShowBreakdown(false); setPieceImageIndex(0); setSelectedPiece(piece); }} style={{ flexShrink: 0, width: 120, border: 'none', padding: 0, background: 'transparent', cursor: 'pointer', textAlign: 'left' }} whileTap={{ scale: 0.95 }}>
                    <div style={{ width: 120, height: 140, background: '#fff', borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {piece.image ? <img src={piece.image} alt={piece.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} loading="lazy" /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 10, color: '#bbb' }}>Piece</span></div>}
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 500, color: '#1a1a1a', marginTop: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{piece.brand}</p>
                    <p style={{ fontSize: 11, color: '#999', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{piece.name}</p>
                    <p style={{ fontSize: 11, fontWeight: 500, color: '#1a1a1a', marginTop: 2 }}>{piece.price}</p>
                  </motion.button>
                ))}
              </div>
              <div style={{ padding: '8px 24px 36px' }}>
                <motion.button onClick={onToggleShortlist} style={{ width: '100%', height: 52, borderRadius: 26, background: isInShortlist ? '#fff' : '#1a1a1a', color: isInShortlist ? '#1a1a1a' : '#fff', border: isInShortlist ? '1.5px solid #d4d4d4' : 'none', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }} whileTap={{ scale: 0.97 }}>
                  {isInShortlist ? 'Added to try-on list ✓' : 'Add outfit to try-on list'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Piece detail overlay — slides from right ON TOP of outfit view */}
      <AnimatePresence>
        {selectedPiece && (
            <motion.div
              key={selectedPiece.id}
              className="absolute inset-0 z-30 flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
              style={{ background: '#fff' }}
            >
              <div style={{ padding: '12px 20px 8px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <motion.button onClick={() => { setSelectedPiece(null); setPieceImageIndex(0); }} style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer' }} whileTap={{ scale: 0.9 }}>
                  <BackChevron />
                </motion.button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }} className="hide-scrollbar">
                <motion.div onClick={() => setFocusedImage(true)} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.3}
                  onDragEnd={(_e, info) => {
                    if (info.offset.x < -50 && pieceImageIndex < pieceImageCount - 1) setPieceImageIndex(prev => prev + 1);
                    else if (info.offset.x > 50 && pieceImageIndex > 0) setPieceImageIndex(prev => prev - 1);
                  }}
                  style={{ margin: '0 20px', background: '#fff', borderRadius: 12, aspectRatio: '4/5', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                >
                  {pieceCarouselImages[pieceImageIndex] ? (
                    <img src={pieceCarouselImages[pieceImageIndex]} alt={selectedPiece.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} loading="lazy" />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 12, color: '#bbb' }}>Product image</span></div>
                  )}
                </motion.div>
                {pieceImageCount > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '12px 0' }}>
                    {pieceCarouselImages.map((_, i) => (
                      <div key={i} onClick={() => setPieceImageIndex(i)} style={{ width: 8, height: 8, borderRadius: '50%', background: i === pieceImageIndex ? '#1a1a1a' : '#ddd', cursor: 'pointer' }} />
                    ))}
                  </div>
                )}
                <div style={{ padding: '0 24px 8px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 500, color: '#1a1a1a' }}>{selectedPiece.brand}</p>
                    <p style={{ fontSize: 14, color: '#666', marginTop: 2 }}>{selectedPiece.name}</p>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a', marginTop: 4 }}>{selectedPiece.price}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 16, paddingTop: 4 }}>
                    <motion.button onClick={() => onToggleLike(selectedPiece.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} whileTap={{ scale: 1.3 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
                      <HeartIcon fill={isLiked(selectedPiece.id) ? '#e74c3c' : 'none'} stroke={isLiked(selectedPiece.id) ? '#e74c3c' : '#1a1a1a'} />
                    </motion.button>
                    <ShareIcon />
                  </div>
                </div>
                <div style={{ padding: '12px 24px 20px' }}>
                  <motion.button onClick={onToggleShortlist} style={{ width: '100%', height: 52, borderRadius: 26, background: isInShortlist ? '#fff' : '#1a1a1a', color: isInShortlist ? '#1a1a1a' : '#fff', border: isInShortlist ? '1.5px solid #d4d4d4' : 'none', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} whileTap={{ scale: 0.97 }}>
                    {isInShortlist ? 'Added to try-on list ✓' : 'Add to try-on list'}
                  </motion.button>
                </div>

                {/* Other pieces from this outfit */}
                {pieces && pieces.length > 1 && (
                  <div style={{ padding: '0 24px 20px' }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a', marginBottom: 12 }}>Also in This Look</p>
                    <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }} className="hide-scrollbar">
                      {pieces.filter(p => p.id !== selectedPiece.id).map((piece) => (
                        <motion.button
                          key={piece.id}
                          onClick={() => { setPieceImageIndex(0); setSelectedPiece(piece); }}
                          style={{ flexShrink: 0, width: 90, border: 'none', padding: 0, background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div style={{ width: 90, height: 100, background: '#fff', borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {piece.image ? <img src={piece.image} alt={piece.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} loading="lazy" /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 9, color: '#bbb' }}>Piece</span></div>}
                          </div>
                          <p style={{ fontSize: 10, fontWeight: 500, color: '#1a1a1a', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{piece.brand}</p>
                          <p style={{ fontSize: 9, color: '#999', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{piece.name}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ padding: '0 24px 40px' }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a', marginBottom: 12 }}>Similar Items</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {pieceSimilarItems.map((item) => (
                      <div key={item.id} style={{ cursor: 'pointer' }}>
                        <div style={{ width: '100%', aspectRatio: '3/4', background: '#fff', borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} loading="lazy" /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 10, color: '#bbb' }}>Image</span></div>}
                        </div>
                        <p style={{ fontSize: 12, fontWeight: 500, color: '#1a1a1a', marginTop: 6 }}>{item.brand}</p>
                        <p style={{ fontSize: 11, color: '#999' }}>{item.name}</p>
                        <p style={{ fontSize: 11, fontWeight: 500, color: '#1a1a1a', marginTop: 2 }}>{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            {focusOverlay}
            </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
