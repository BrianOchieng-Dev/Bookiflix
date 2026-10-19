import React, { useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Zap, 
  Tag, 
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotalKes,
    cartDiscountKes,
    cartTotalKes,
    formatPrice,
    promoCode,
    setPromoCode,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    promoError,
    setIsCheckoutOpen,
  } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim()) {
      applyPromoCode(promoCode);
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Drawer"
    >
      <div 
        className="absolute inset-y-0 right-0 max-w-full flex pl-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-screen max-w-md glass-panel border-l border-white/15 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
          {/* Header (Neutral Radius) */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-md bg-[#1e90ff]/20 text-[#1e90ff]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Your Reading Cart</h3>
                <p className="text-xs text-slate-400">
                  {cart.length} {cart.length === 1 ? 'title' : 'titles'} in order
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              aria-label="Close cart drawer"
              className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-14 h-14 rounded-md bg-white/5 flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-white">Your Cart is Empty</h4>
                <p className="text-xs text-slate-400 max-w-xs">
                  Discover bestselling titles in African tech, speculative cyberpunk, and high-performance philosophy.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-4 py-2 rounded-md bg-[#1e90ff] hover:bg-[#1a7cdb] text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                  <span>Selected Books</span>
                  <button
                    onClick={clearCart}
                    className="text-[#ef4444] hover:text-[#f87171] font-semibold transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                {cart.map((item) => (
                  <div
                    key={item.bookId}
                    className="p-3 rounded-md glass-card border border-white/10 flex gap-3 items-center"
                  >
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="w-12 h-18 object-cover rounded-xs flex-none"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="px-1.5 py-0.2 rounded-xs text-[10px] font-bold bg-[#1e90ff]/20 text-[#1e90ff]">
                          {item.format}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">{item.author}</p>
                      <div className="text-xs font-extrabold text-white mt-1">
                        {formatPrice(item.priceKes * item.quantity)}
                      </div>
                    </div>

                    {/* Quantity & Delete */}
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeFromCart(item.bookId)}
                        aria-label={`Remove ${item.title} from cart`}
                        className="text-slate-400 hover:text-[#ef4444] transition-colors p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-md p-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.bookId, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="w-5 h-5 flex items-center justify-center text-slate-300 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-white px-1 font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.bookId, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="w-5 h-5 flex items-center justify-center text-slate-300 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-white/10 bg-black/50 space-y-3.5">
              {/* Promo code box */}
              <div>
                {appliedPromo ? (
                  <div className="p-2 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{appliedPromo.code} ({appliedPromo.description})</span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-slate-400 hover:text-white text-xs cursor-pointer ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo code (e.g. MIDUSA20)"
                      aria-label="Promo code input"
                      className="flex-1 px-3 py-1.5 rounded-md bg-white/5 border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#1e90ff] uppercase"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoError && (
                  <p className="text-[11px] text-[#ef4444] mt-1">{promoError}</p>
                )}
              </div>

              {/* Price Summary */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartSubtotalKes)}</span>
                </div>
                {cartDiscountKes > 0 && (
                  <div className="flex justify-between text-[#ef4444] font-bold">
                    <span>Discount Savings</span>
                    <span>-{formatPrice(cartDiscountKes)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-300">
                  <span>Digital Delivery</span>
                  <span className="text-[#00a859] font-bold">Instant Access</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-baseline text-sm font-bold text-white">
                  <span>Total Amount</span>
                  <span className="text-xl text-white font-black">{formatPrice(cartTotalKes)}</span>
                </div>
              </div>

              {/* Primary M-Pesa Checkout Button (Safaricom Green) */}
              <button
                onClick={handleCheckout}
                aria-label={`Proceed to M-Pesa Checkout for ${formatPrice(cartTotalKes)}`}
                className="w-full py-3 rounded-md bg-[#00a859] hover:bg-[#00924d] text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#00a859]/30 transition-transform active:scale-98 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Checkout with M-Pesa</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00a859]" />
                <span>Encrypted Safaricom Daraja 2.0 Integration</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
