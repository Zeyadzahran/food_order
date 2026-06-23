import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-surface-900 text-surface-50 py-12 mt-10 border-t-[8px] border-primary-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="font-display font-black text-2xl uppercase tracking-tighter text-primary-400 mb-4">CRAVE</h2>
          <p className="font-body text-surface-400 text-sm">
            Bold flavours. Fast delivery. The ultimate editorial street food experience right to your door.
          </p>
        </div>
        <div>
          <h3 className="font-display font-bold uppercase tracking-wider mb-4">Links</h3>
          <div className="flex flex-col gap-2">
            <Link to="/menu" className="text-surface-300 hover:text-white transition-colors">Menu</Link>
            <Link to="/orders" className="text-surface-300 hover:text-white transition-colors">Orders</Link>
          </div>
        </div>
        <div>
          <h3 className="font-display font-bold uppercase tracking-wider mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-surface-800 flex items-center justify-center hover:bg-primary-500 transition-colors cursor-pointer">
              IG
            </div>
            <div className="w-10 h-10 bg-surface-800 flex items-center justify-center hover:bg-primary-500 transition-colors cursor-pointer">
              X
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
