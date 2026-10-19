import React, { useEffect } from 'react';
import { X, Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({ isOpen, onClose }) => {
  const { 
    wishlist, 
    toggleWishlist, 
    addToCart, 
    formatPrice, 
    setSelectedBook, 
    books 
  } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleMoveAllToCart = async () => {
    for (const item of wishlist) {
      const fullBook = books.find((b) => b.id === item.bookId);
      if (fullBook) {
        await addToCart(fullBook, 'eBook', 1);
      }
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Wishlist modal"
    >
      <div 
        className="relative w-full max-w-2xl my-auto rounded-lg glass-panel border border-white/20 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Neutral Radius) */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-[#e50914]/20 text-[#e50914]">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Your Wishlist</h3>
              <p className="text-xs text-slate-400">
                {wishlist.length} {wishlist.length === 1 ? 'saved book' : 'saved books'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close wishlist"
            className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="p-5 max-h-[440px] overflow-y-auto space-y-2.5">
          {wishlist.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-md bg-white/5 flex items-center justify-center text-slate-500">
                <Heart className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Your Wishlist is Empty</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Tap the heart button on any book card to save it for later or track discount notifications.
              </p>
            </div>
          ) : (
            wishlist.map((item) => {
              const fullBook = books.find((b) => b.id === item.bookId);
              return (
                <div
                  key={item.bookId}
                  className="p-3 rounded-md glass-card border border-white/10 flex items-center justify-between gap-4"
                >
                  <div 
                    onClick={() => {
                      if (fullBook) {
                        onClose();
                        setSelectedBook(fullBook);
                      }
                    }}
                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer group"
                  >
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="w-11 h-16 object-cover rounded-xs flex-none group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-[#1e90ff] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">{item.author}</p>
                      <div className="text-xs font-extrabold text-white mt-1">
                        {formatPrice(item.priceKes)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (fullBook) {
                          addToCart(fullBook, 'eBook', 1);
                        }
                      }}
                      className="px-3 py-1.5 rounded-md bg-[#00a859] hover:bg-[#00924d] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Add to Cart</span>
                    </button>

                    <button
                      onClick={() => {
                        if (fullBook) {
                          toggleWishlist(fullBook);
                        }
                      }}
                      aria-label="Remove from wishlist"
                      className="p-1.5 rounded-md text-slate-400 hover:text-[#ef4444] hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {wishlist.length > 0 && (
          <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Move all titles to cart for checkout
            </span>
            <button
              onClick={handleMoveAllToCart}
              className="px-4 py-2 rounded-md bg-[#1e90ff] hover:bg-[#1a7cdb] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>Move All to Cart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
