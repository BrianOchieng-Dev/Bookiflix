import React, { useEffect } from 'react';
import { X, Clock, BookOpen, Download, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({ isOpen, onClose }) => {
  const { orders, formatPrice, setReadingBook } = useStore();

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

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="My orders and library modal"
    >
      <div 
        className="relative w-full max-w-2xl my-auto rounded-lg glass-panel border border-white/20 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Neutral Radius) */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-[#1e90ff]/20 text-[#1e90ff]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">My Orders & Library</h3>
              <p className="text-xs text-slate-400">
                Purchased titles, M-Pesa transaction records, and digital licenses
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close orders modal"
            className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Orders list */}
        <div className="p-5 max-h-[440px] overflow-y-auto space-y-3">
          {orders.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-md bg-white/5 flex items-center justify-center text-slate-500">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">No Orders Yet</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Once you complete an M-Pesa checkout, your digital books and official Safaricom transaction receipts will appear here.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.orderId}
                className="p-3.5 rounded-md glass-card border border-white/10 space-y-2.5"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-2 text-xs">
                  <div>
                    <span className="font-mono text-slate-400">{order.orderId}</span>
                    <span className="mx-2 text-slate-600">•</span>
                    <span className="text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>

                  <span className="px-2 py-0.5 rounded-xs text-[10px] font-bold bg-[#00a859]/20 text-emerald-400 flex items-center gap-1 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3 text-[#00a859]" />
                    M-Pesa ({order.mpesaReceiptNumber})
                  </span>
                </div>

                <div className="text-xs text-slate-200">
                  <strong className="text-white">Titles:</strong> {order.itemsSummary}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-sm font-bold text-white">
                    {formatPrice(order.totalKes)}
                  </div>

                  <button
                    onClick={() => {
                      const blob = new Blob(
                        [`Midusa eLibrary Official Receipt\nOrder: ${order.orderId}\nM-Pesa Ref: ${order.mpesaReceiptNumber}\nAmount: ${order.totalKes} KES\nStatus: Paid & Verified\nThank you for reading!`],
                        { type: 'text/plain' }
                      );
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `receipt-${order.mpesaReceiptNumber}.txt`;
                      a.click();
                    }}
                    className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Receipt</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
