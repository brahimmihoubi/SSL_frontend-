import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Search, 
  Menu, 
  X, 
  User, 
  Award, 
  TrendingUp, 
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Mail,
  Loader2
} from 'lucide-react';
import { 
  Page, 
  Workshop, 
  Speaker, 
  Partner, 
  MOCK_WORKSHOPS, 
  MOCK_SPEAKERS, 
  MOCK_PARTNERS 
} from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [user, setUser] = useState<{name: string, email: string} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'online' | 'on-site'>('all');
  const [toasts, setToasts] = useState<{id: number, msg: string, type: 'success' | 'error'}[]>([]);

  // Navigation helper
  const navigate = (page: Page, data?: number) => {
    if (data && page === 'workshop-detail') {
      setSelectedWorkshopId(data);
    }
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const addToast = (msg: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setUser({ name: 'Ahmed Benali', email: 'ahmed@example.com' });
    addToast('Signed in successfully! 🎉');
    navigate('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    addToast('Signed out.');
    navigate('home');
  };

  const workshops = MOCK_WORKSHOPS.filter(w => {
    const matchFilter = activeFilter === 'all' || (w.attendance_type || '').includes(activeFilter);
    const matchSearch = w.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       w.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  const selectedWorkshop = MOCK_WORKSHOPS.find(w => w.id === selectedWorkshopId) || MOCK_WORKSHOPS[0];

  return (
    <div className="min-h-screen font-sans selection:bg-accent selection:text-white">
      {/* ─── Navbar ─────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-ink/80 backdrop-blur-xl border-border border-b flex items-center justify-between px-4 sm:px-6 md:px-10 py-3 md:py-4">
        <div 
          className="display-font text-base sm:text-lg md:text-xl cursor-pointer bg-gradient-to-br from-electric to-lavender bg-clip-text text-transparent hover:opacity-80 transition-opacity shrink-0"
          onClick={() => navigate('home')}
        >
          SDG SKILLS LAB
        </div>

        <ul className="hidden md:flex gap-6 lg:gap-8 list-none">
          {['home', 'workshops', 'speakers', 'partners'].map((p) => (
            <li key={p}>
              <button 
                onClick={() => navigate(p as Page)}
                className={`text-sm font-medium transition-colors relative group ${
                  currentPage === p ? 'text-white' : 'text-muted hover:text-white'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-electric transition-all duration-300 ${
                  currentPage === p ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <button className="btn btn-ghost hidden md:flex" onClick={() => navigate('dashboard')}>Dashboard</button>
              <button className="btn btn-primary hidden md:flex text-sm" onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost hidden md:flex" onClick={() => navigate('login')}>Sign In</button>
              <button className="btn btn-primary hidden md:flex" onClick={() => navigate('register-page')}>Join Now →</button>
            </>
          )}
          <button 
            className="md:hidden p-2 text-white rounded-lg hover:bg-glass transition-colors" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute top-full left-0 right-0 bg-ink2/98 backdrop-blur-2xl border-b border-border px-4 pt-3 pb-5 flex flex-col gap-1 md:hidden shadow-2xl"
            >
              {['home', 'workshops', 'speakers', 'partners'].map((p) => (
                <button 
                  key={p}
                  onClick={() => navigate(p as Page)}
                  className={`text-sm font-semibold text-left py-3 px-4 rounded-xl transition-all ${
                    currentPage === p
                      ? 'text-white bg-glass border border-border'
                      : 'text-muted hover:text-white hover:bg-glass'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
              <div className="mt-3 pt-3 border-t border-border flex flex-col gap-2">
                {user ? (
                  <>
                    <button onClick={() => navigate('dashboard')} className="btn btn-ghost w-full justify-center py-3 text-sm">Dashboard</button>
                    <button onClick={handleLogout} className="btn btn-primary w-full justify-center py-3 text-sm">Sign Out</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => navigate('login')} className="btn btn-ghost w-full justify-center py-3 text-sm">Sign In</button>
                    <button onClick={() => navigate('register-page')} className="btn btn-primary w-full justify-center py-3 text-sm">Join Now →</button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── Page Content ─────────────────────────────── */}
      <main className="pt-[72px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {currentPage === 'home' && (
              <HomePage 
                navigate={navigate} 
                openRegModal={(id) => {
                  setSelectedWorkshopId(id);
                  setIsRegModalOpen(true);
                }} 
              />
            )}
            {currentPage === 'workshops' && (
              <WorkshopsPage 
                workshops={workshops} 
                navigate={navigate} 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                openRegModal={(id) => {
                  setSelectedWorkshopId(id);
                  setIsRegModalOpen(true);
                }}
              />
            )}
            {currentPage === 'speakers' && <SpeakersPage />}
            {currentPage === 'partners' && <PartnersPage />}
            {currentPage === 'login' && <LoginPage handleLogin={handleLogin} navigate={navigate} />}
            {currentPage === 'register-page' && <RegisterAccountPage navigate={navigate} addToast={addToast} />}
            {currentPage === 'dashboard' && <DashboardPage navigate={navigate} user={user} addToast={addToast} />}
            {currentPage === 'workshop-detail' && (
              <WorkshopDetailPage 
                workshop={selectedWorkshop!} 
                navigate={navigate} 
                openRegModal={(id) => {
                  setSelectedWorkshopId(id);
                  setIsRegModalOpen(true);
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ─── Modals ──────────────────────────────────── */}
      <AnimatePresence>
        {isRegModalOpen && (
          <RegistrationModal 
            workshop={selectedWorkshop!} 
            onClose={() => setIsRegModalOpen(false)}
            onSuccess={() => {
              setIsRegModalOpen(false);
              setIsConfirmModalOpen(true);
              addToast('Registration submitted! Check your email 📧');
            }}
          />
        )}
        {isConfirmModalOpen && (
          <ConfirmEmailModal 
            onClose={() => setIsConfirmModalOpen(false)}
            onSuccess={() => {
              setIsConfirmModalOpen(false);
              addToast('Registration confirmed! (Demo mode) ✅');
            }}
          />
        )}
      </AnimatePresence>

      {/* ─── Toasts ──────────────────────────────────── */}
      <div className="fixed bottom-8 right-8 z-[300] flex flex-col gap-3">
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`p-4 min-w-[280px] bg-ink2 border border-border rounded-xl shadow-2xl flex items-start gap-3 text-sm ${
              t.type === 'success' ? 'border-l-[3px] border-l-mint' : 'border-l-[3px] border-l-accent'
            }`}
          >
            <span>{t.type === 'success' ? '✅' : '⚠️'}</span>
            <span>{t.msg}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Sub-Components ───────────────────────────────────

function HomePage({ navigate, openRegModal }: any) {
  return (
    <div id="page-home">
      <div className="relative min-h-[calc(100vh-72px)] flex items-center overflow-hidden px-6 md:px-10">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_40%,rgba(30,111,217,0.18)_0%,transparent_60%),radial-gradient(ellipse_60%_50%_at_10%_80%,rgba(79,158,255,0.10)_0%,transparent_55%)]" />
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(79,158,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(79,158,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]" />
        
        <div className="relative z-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-electric/25 text-electric px-4 py-1.5 rounded-full text-xs font-semibold w-fit">
              <span className="w-1.5 h-1.5 bg-electric rounded-full animate-pulse-custom" />
              Now Accepting Registrations
            </div>
            <h1 className="display-font text-5xl md:text-7xl leading-[1.1] tracking-tight">
              Connect.<br/>
              <span className="bg-gradient-to-r from-accent via-electric to-lavender bg-clip-text text-transparent">Learn. Grow.</span><br/>
              Together.
            </h1>
            <p className="text-muted text-lg max-w-md leading-relaxed">
              The premier platform for workshops, hackathons, and tech events in Algeria. 
              Build skills, meet experts, and shape the future of tech.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('workshops')}>Browse Workshops →</button>
              <button className="btn btn-outline btn-lg" onClick={() => navigate('login')}>Sign In</button>
            </div>
            <div className="grid grid-cols-3 gap-8 mt-8 pt-8 border-t border-border">
              <div>
                <div className="display-font text-3xl">1000+</div>
                <div className="text-muted text-[10px] uppercase tracking-wider font-bold">Applications</div>
              </div>
              <div>
                <div className="display-font text-3xl">50+</div>
                <div className="text-muted text-[10px] uppercase tracking-wider font-bold">Experts</div>
              </div>
              <div>
                <div className="display-font text-3xl">100%</div>
                <div className="text-muted text-[10px] uppercase tracking-wider font-bold">Certified</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            className="relative flex justify-center items-center"
          >
            <div className="w-full max-w-[400px] p-8 bg-glass2 border border-border rounded-[32px] backdrop-blur-2xl relative overflow-hidden group">
              <div className="absolute -top-1/2 -right-[30%] w-52 h-52 bg-electric/10 rounded-full blur-3xl" />
              <div className="w-full h-40 rounded-2xl bg-gradient-to-br from-ink2 to-ink3 flex items-center justify-center text-5xl mb-6 group-hover:scale-105 transition-transform">🚀</div>
              <div className="inline-block px-3 py-1 bg-electric/10 text-electric text-[10px] font-bold tracking-widest uppercase rounded-full mb-3">Workshop</div>
              <h3 className="display-font text-xl mb-2">AI & Machine Learning Bootcamp</h3>
              <div className="flex gap-4 text-muted text-xs mb-6">
                <span className="flex items-center gap-1.5"><Calendar size={12} /> June 15, 2025</span>
                <span className="flex items-center gap-1.5"><Clock size={12} /> 3h Session</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="avatar-stack">
                  <div className="avatar">AS</div>
                  <div className="avatar">MB</div>
                  <div className="avatar text-[10px]">+8</div>
                </div>
                <button className="btn btn-primary !py-2 !px-4 !text-xs" onClick={() => openRegModal(1)}>Register</button>
              </div>
            </div>
            
            <div className="absolute -top-4 -right-4 bg-ink2 border border-border px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 shadow-2xl animate-float">🎯 12 spots left</div>
            <div className="absolute bottom-12 -left-8 bg-ink2 border border-border px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 shadow-2xl animate-float [animation-delay:2s]">✅ Free Certificate</div>
            <div className="absolute top-1/2 -right-12 bg-ink2 border border-border px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 shadow-2xl animate-float [animation-delay:4s]">🌐 Hybrid Mode</div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-12">
          <div>
            <div className="text-accent text-xs font-bold tracking-[0.2em] uppercase mb-3">↑ Featured Workshops</div>
            <h2 className="display-font text-4xl md:text-5xl">Upcoming Events</h2>
            <p className="text-muted mt-3 max-w-lg">Hands-on learning experiences crafted by industry experts.</p>
          </div>
          <button className="btn btn-ghost" onClick={() => navigate('workshops')}>View All →</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_WORKSHOPS.slice(0, 3).map((w, i) => (
            <WorkshopCard key={w.id} workshop={w} index={i} onClick={() => navigate('workshop-detail', w.id)} openRegModal={openRegModal} />
          ))}
        </div>
      </div>

      <div className="border-y border-border py-12 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center gap-12 text-muted uppercase text-[10px] font-bold tracking-[0.2em]">
          <span className="shrink-0">Trusted By</span>
          <div className="flex flex-wrap gap-8 items-center justify-center">
            {MOCK_PARTNERS.map(p => (
              <div key={p.name} className="flex items-center gap-2 bg-glass border border-border px-4 py-2 rounded-xl text-xs whitespace-nowrap">🤝 {p.name}</div>
            ))}
          </div>
        </div>
      </div>
      
      <footer className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-border mt-12">
        <div className="display-font text-xl bg-gradient-to-r from-electric to-lavender bg-clip-text text-transparent">SDG SKILLS LAB</div>
        <div className="flex gap-8 text-xs font-medium text-muted">
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">API Docs</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
        <div className="text-[10px] text-muted font-semibold uppercase tracking-widest">© 2025 Setif Developers Group</div>
      </footer>
    </div>
  );
}

function WorkshopCard({ workshop, index, onClick, openRegModal }: any) {
  const icons = ['🚀','💡','🔬','🎨','🧠','⚡','🛠️','🌐','📱','🎯'];
  const icon = icons[index % icons.length];
  const hasOnline = (workshop.attendance_type || '').includes('online');
  const hasOnsite = (workshop.attendance_type || '').includes('on-site');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="workshop-card"
      onClick={onClick}
    >
      <div className="card-img" style={{ background: `linear-gradient(135deg, ${getGrad(index)})` }}>
        <span className="transition-transform group-hover:scale-110">{icon}</span>
        <div className="card-img-overlay" />
      </div>
      <div className="p-6">
        <div className="flex gap-2 flex-wrap mb-3">
          {hasOnline && <span className="px-2 py-0.5 bg-mint/10 text-mint text-[10px] font-bold rounded-full uppercase tracking-wider">Online</span>}
          {hasOnsite && <span className="px-2 py-0.5 bg-accent/10 text-accent2 text-[10px] font-bold rounded-full uppercase tracking-wider">On-Site</span>}
          <span className="px-2 py-0.5 bg-electric/10 text-electric text-[10px] font-bold rounded-full uppercase tracking-wider">{workshop.duration || 'Workshop'}</span>
        </div>
        <h3 className="display-font text-xl mb-2 line-height-tight">{workshop.title}</h3>
        <p className="text-muted text-sm line-clamp-2 mb-6">{workshop.description}</p>
        <div className="flex gap-4 text-muted text-xs border-t border-border pt-4">
          <span className="flex items-center gap-1.5"><Calendar size={12} /> {workshop.date}</span>
          <span className="flex items-center gap-1.5"><Award size={12} /> Certified</span>
        </div>
      </div>
      <div className="px-6 pb-6 pt-0 flex items-center justify-between">
        <div className="avatar-stack">
          <div className="avatar">{workshop.speaker_initials || 'SP'}</div>
          <div className="avatar text-[10px]">+12</div>
        </div>
        <button 
          className="btn btn-primary !py-2 !px-4 !text-xs" 
          onClick={(e) => {
            e.stopPropagation();
            openRegModal(workshop.id);
          }}
        >
          Register
        </button>
      </div>
    </motion.div>
  );
}

function getGrad(i: number) {
  const grads = [
    '#020c1e, #0a1f4a',   /* deep navy blue         */
    '#020e24, #0d2660',   /* indigo navy             */
    '#010b1a, #083480',   /* dark royal blue         */
    '#020d26, #0b3070',   /* midnight blue           */
    '#030f28, #0f2d6b',   /* prussian blue           */
    '#010a1c, #071e4f',   /* near-black navy         */
  ];
  return grads[i % grads.length];
}

function WorkshopsPage({ 
  workshops, 
  navigate, 
  searchQuery, 
  setSearchQuery, 
  activeFilter, 
  setActiveFilter,
  openRegModal 
}: any) {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <div className="text-accent text-xs font-bold tracking-[0.2em] uppercase mb-3">↑ All Events</div>
      <h2 className="display-font text-4xl md:text-5xl mb-12">Search Workshops</h2>
      
      <div className="flex flex-col md:flex-row gap-6 mb-12 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search workshops by topic or speaker..." 
            className="w-full bg-glass border border-border rounded-full py-3.5 pl-12 pr-6 text-white outline-none focus:border-accent transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 bg-glass p-1 rounded-full border border-border">
          {['all', 'online', 'on-site'].map(f => (
            <button 
              key={f}
              onClick={() => setActiveFilter(f as any)}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
                activeFilter === f ? 'bg-accent text-white shadow-lg' : 'text-muted hover:text-white'
              }`}
            >
              {f.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('-')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workshops.map((w: any, i: number) => (
          <WorkshopCard 
            key={w.id} 
            workshop={w} 
            index={i} 
            onClick={() => navigate('workshop-detail', w.id)} 
            openRegModal={openRegModal}
          />
        ))}
      </div>
      
      {workshops.length === 0 && (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="display-font text-2xl">No workshops found</h3>
          <p className="text-muted mt-2">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
}

function SpeakersPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <div className="text-accent text-xs font-bold tracking-[0.2em] uppercase mb-3">↑ Our Experts</div>
      <h2 className="display-font text-4xl md:text-5xl mb-12">Meet the Faculty</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MOCK_SPEAKERS.map((s, i) => (
          <motion.div 
            key={s.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-glass border border-border rounded-[24px] p-8 text-center hover:border-accent/40 transition-all hover:-translate-y-2 group"
          >
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold bg-gradient-to-br from-accent to-lavender text-white border-4 border-border ring-4 ring-accent/10">
              {s.name.charAt(0)}
            </div>
            <h3 className="display-font text-lg mb-1">{s.name}</h3>
            <div className="text-accent text-[10px] font-bold uppercase tracking-widest mb-4">{s.role}</div>
            <p className="text-muted text-xs leading-relaxed line-clamp-3">{s.bio}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PartnersPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <div className="text-accent text-xs font-bold tracking-[0.2em] uppercase mb-3">↑ Our Ecosystem</div>
      <h2 className="display-font text-4xl md:text-5xl mb-12">Event Partners</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_PARTNERS.map((p, i) => (
          <motion.div 
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-glass border border-border rounded-[32px] p-10 group hover:border-accent/30 transition-all"
          >
            <div className="text-3xl mb-6 scale-100 group-hover:scale-110 transition-transform origin-left">🤝</div>
            <h3 className="display-font text-2xl mb-3">{p.name}</h3>
            <p className="text-muted leading-relaxed text-sm mb-8">{p.description}</p>
            <button className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest hover:underline translate-x-0 hover:translate-x-2 transition-transform">
              Explore Partner <ExternalLink size={14} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function LoginPage({ handleLogin, navigate }: any) {
  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-ink2 border border-border rounded-[32px] p-10 flex flex-col gap-6"
      >
        <div className="display-font text-xl text-electric">SDG SKILLS LAB</div>
        <div>
          <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
          <p className="text-muted text-sm">Sign in to access your platform dashboard.</p>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Email</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              className="bg-glass border border-border rounded-xl px-4 py-3 text-white outline-none focus:border-accent transition-all"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="bg-glass border border-border rounded-xl px-4 py-3 text-white outline-none focus:border-accent transition-all"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg mt-2">Sign In →</button>
        </form>
        <div className="text-center text-xs text-muted">
          Don't have an account? <button onClick={() => navigate('register-page')} className="text-accent font-bold hover:underline">Create one</button>
        </div>
      </motion.div>
    </div>
  );
}

function RegisterAccountPage({ navigate, addToast }: any) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addToast('Request submitted. We\'ll contact you soon!');
    navigate('home');
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-ink2 border border-border rounded-[32px] p-10 flex flex-col gap-6"
      >
        <div className="display-font text-xl text-electric">SDG SKILLS LAB</div>
        <div>
          <h2 className="text-3xl font-bold mb-2">Join the Community</h2>
          <p className="text-muted text-sm">Access exclusive high-end workshops and networking.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Full Name</label>
            <input type="text" placeholder="Ahmed Benali" className="bg-glass border border-border rounded-xl px-4 py-3 outline-none focus:border-accent transition-all" required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Email</label>
            <input type="email" placeholder="you@example.com" className="bg-glass border border-border rounded-xl px-4 py-3 outline-none focus:border-accent transition-all" required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Password</label>
            <input type="password" placeholder="••••••••" className="bg-glass border border-border rounded-xl px-4 py-3 outline-none focus:border-accent transition-all" required />
          </div>
          <button type="submit" className="btn btn-primary btn-lg mt-2">Request Access →</button>
        </form>
        <div className="text-center text-xs text-muted">
          Already have an account? <button onClick={() => navigate('login')} className="text-accent font-bold hover:underline">Sign in</button>
        </div>
      </motion.div>
    </div>
  );
}

function DashboardPage({ user, navigate, addToast }: any) {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
        <div>
          <h2 className="display-font text-4xl mb-2">Welcome back 👋</h2>
          <p className="text-muted">You have 2 upcoming workshops this month.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('workshops')}>Browse New Events</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { icon: '🎫', val: '2', label: 'Registrations', trend: 'Active' },
          { icon: '🏆', val: '1', label: 'Certificates', trend: 'Verified' },
          { icon: '📅', val: '3', label: 'Recommended', trend: 'Personalized' },
          { icon: '✅', val: '4', label: 'Attended', trend: 'Total' },
        ].map((s, i) => (
          <div key={i} className="bg-glass border border-border p-6 rounded-[24px]">
            <div className="text-2xl mb-4">{s.icon}</div>
            <div className="display-font text-3xl mb-1">{s.val}</div>
            <div className="text-muted text-[10px] uppercase font-bold tracking-widest">{s.label}</div>
            <div className="text-mint text-[10px] font-bold mt-3 flex items-center gap-1.5"><CheckCircle size={10} /> {s.trend}</div>
          </div>
        ))}
      </div>

      <div className="mb-12">
        <h3 className="display-font text-2xl mb-6">Active Registrations</h3>
        <div className="bg-glass border border-border rounded-[24px] overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-white/5 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] uppercase font-bold tracking-widest text-muted">Event</th>
                <th className="px-6 py-4 text-left text-[10px] uppercase font-bold tracking-widest text-muted">Date</th>
                <th className="px-6 py-4 text-left text-[10px] uppercase font-bold tracking-widest text-muted">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {MOCK_WORKSHOPS.slice(0, 2).map((w, i) => (
                <tr key={w.id} className="border-b border-border last:border-0 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold">{w.title}</td>
                  <td className="px-6 py-4 text-xs text-muted">{w.date}</td>
                  <td className="px-6 py-4 text-xs"><span className={`status-badge ${i%2===0?'status-confirmed':'status-pending'}`}>{i%2===0?'Confirmed':'Pending'}</span></td>
                  <td className="px-6 py-4 text-right">
                    <button className="btn btn-ghost !py-1 !px-3 !text-xs" onClick={() => navigate('workshop-detail', w.id)}>Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="display-font text-2xl mb-6">Earned Certificates</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-ink2 to-[#0a1f4a] border border-electric/20 rounded-[32px] p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-electric to-lavender" />
            <div className="text-4xl mb-6">🏆</div>
            <div className="text-electric text-[10px] font-bold tracking-[0.2em] uppercase mb-8">Certificate of Completion</div>
            <div className="display-font text-3xl mb-2">{user?.name || 'Participant'}</div>
            <div className="text-muted mb-8 italic">Full Stack Web Development Workshop</div>
            <div className="flex gap-8 justify-center text-[10px] font-bold tracking-widest uppercase text-muted">
              <span>📅 June 2025</span>
              <span>🏛 SGD Certified</span>
            </div>
            <button className="btn btn-outline mt-8" onClick={() => addToast('PDF Generator coming soon!')}>Download PDF</button>
          </div>
          <div 
            onClick={() => navigate('workshops')}
            className="border-2 border-dashed border-border rounded-[32px] flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:border-accent/30 transition-all"
          >
            <div className="text-4xl translate-y-0 group-hover:-translate-y-2 transition-transform duration-500">🎓</div>
            <div className="display-font text-2xl mt-4">Unlock New Skills</div>
            <p className="text-muted text-sm mt-2">Attend more workshops to build your profile.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkshopDetailPage({ workshop, navigate, openRegModal }: any) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <button className="btn btn-ghost mb-8 hover:!border-accent hover:!text-white" onClick={() => navigate('workshops')}>
        ← Back to Workshops
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 items-start">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex gap-3 mb-6">
            <span className="px-3 py-1 bg-accent/10 text-accent font-bold text-[10px] uppercase rounded-full">Premier Event</span>
            <span className="px-3 py-1 bg-electric/10 text-electric font-bold text-[10px] uppercase rounded-full">Featured</span>
          </div>
          <h1 className="display-font text-4xl md:text-6xl leading-[1.1] mb-8">{workshop.title}</h1>
          <p className="text-muted text-lg leading-relaxed mb-12">{workshop.description}</p>
          
          <h3 className="display-font text-2xl mb-8 border-b border-border pb-4">Speaker Panel</h3>
          <div className="flex flex-wrap gap-6 mb-12">
            {(workshop.speakers || ['Expert Speaker']).map((s: any, i: number) => (
              <div key={i} className="flex items-center gap-4 bg-glass border border-border p-4 rounded-2xl">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-lavender flex items-center justify-center font-bold text-xl ring-2 ring-border">
                  {(s.name || s).charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-sm tracking-tight">{s.name || s}</div>
                  <div className="text-muted text-[10px] uppercase font-bold tracking-widest mt-0.5">{s.role || 'Industry Expert'}</div>
                </div>
              </div>
            ))}
          </div>

          <h3 className="display-font text-2xl mb-8 border-b border-border pb-4">Prerequisites</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted text-sm">
            <li className="flex items-start gap-3 bg-glass p-4 rounded-2xl border border-border">
              <CheckCircle size={16} className="text-accent shrink-0" /> Basic understanding of logic and computation.
            </li>
            <li className="flex items-start gap-3 bg-glass p-4 rounded-2xl border border-border">
              <CheckCircle size={16} className="text-accent shrink-0" /> Familiarity with basic scripting or programming concepts.
            </li>
            <li className="flex items-start gap-3 bg-glass p-4 rounded-2xl border border-border">
              <CheckCircle size={16} className="text-accent shrink-0" /> Stable internet connection for online attendees.
            </li>
            <li className="flex items-start gap-3 bg-glass p-4 rounded-2xl border border-border">
              <CheckCircle size={16} className="text-accent shrink-0" /> Personal laptop is required for hand-on practice.
            </li>
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:sticky lg:top-24">
          <div className="bg-glass2 border border-border p-10 rounded-[32px] backdrop-blur-3xl overflow-hidden relative group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-electric" />
            <div className="text-4xl text-center mb-8 group-hover:scale-110 transition-transform duration-500">🔥</div>
            
            <div className="flex flex-col gap-6 mb-10">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-muted text-xs uppercase font-bold tracking-widest">Date</span>
                <span className="text-sm font-semibold">{workshop.date}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-muted text-xs uppercase font-bold tracking-widest">Session Time</span>
                <span className="text-sm font-semibold">14:00 - 17:00</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-muted text-xs uppercase font-bold tracking-widest">Pricing</span>
                <span className="text-sm font-bold text-mint">Free Entry</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted text-xs uppercase font-bold tracking-widest">Slots</span>
                <span className="text-sm font-bold text-accent">Limited</span>
              </div>
            </div>

            <button className="btn btn-primary btn-lg" onClick={() => openRegModal(workshop.id)}>Enroll for Free →</button>
            <p className="text-[10px] text-center text-muted font-bold tracking-widest uppercase mt-6">📧 Official Invitation will be sent via Email</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function RegistrationModal({ workshop, onClose, onSuccess }: any) {
  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 40 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 40 }}
        className="relative w-full max-w-lg bg-ink2 border border-border rounded-t-[32px] sm:rounded-[32px] flex flex-col max-h-[90dvh]"
      >
        {/* Sticky header */}
        <div className="flex items-start justify-between px-8 pt-8 pb-4 border-b border-border shrink-0">
          <div>
            <h2 className="display-font text-2xl mb-1">Join Episode</h2>
            <div className="text-electric text-xs font-bold tracking-widest uppercase line-clamp-1">{workshop.title}</div>
          </div>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors mt-1 ml-4 shrink-0"><X size={20}/></button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-8 py-6">
          <form id="reg-form" className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); onSuccess(); }}>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Full Name</label>
              <input type="text" placeholder="Ahmed Benali" className="bg-glass border border-border rounded-xl px-4 py-3 text-white outline-none focus:border-electric transition-all w-full" required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Email</label>
              <input type="email" placeholder="you@example.com" className="bg-glass border border-border rounded-xl px-4 py-3 text-white outline-none focus:border-electric transition-all w-full" required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Phone</label>
              <input type="tel" placeholder="05XX XX XX XX" className="bg-glass border border-border rounded-xl px-4 py-3 text-white outline-none focus:border-electric transition-all w-full" required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Field of Focus</label>
              <input type="text" placeholder="Software Architecture..." className="bg-glass border border-border rounded-xl px-4 py-3 text-white outline-none focus:border-electric transition-all w-full" required />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Attendance Type</label>
              <div className="flex gap-3">
                <label className="flex-1 flex items-center justify-center gap-2 p-3 bg-glass border border-border rounded-2xl cursor-pointer hover:border-electric/40 transition-all has-[:checked]:border-electric has-[:checked]:bg-electric/5">
                  <input type="radio" name="attendance" value="on-site" className="accent-electric" defaultChecked />
                  <span className="text-sm font-bold">🏢 On-Site</span>
                </label>
                <label className="flex-1 flex items-center justify-center gap-2 p-3 bg-glass border border-border rounded-2xl cursor-pointer hover:border-electric/40 transition-all has-[:checked]:border-electric has-[:checked]:bg-electric/5">
                  <input type="radio" name="attendance" value="online" className="accent-electric" />
                  <span className="text-sm font-bold">🌐 Online</span>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Sticky footer with CTA */}
        <div className="px-8 pb-8 pt-4 border-t border-border shrink-0">
          <button type="submit" form="reg-form" className="btn btn-primary btn-lg font-bold">Request Secure Invite →</button>
        </div>
      </motion.div>
    </div>
  );
}

function ConfirmEmailModal({ onClose, onSuccess }: any) {
  const [loading, setLoading] = useState(false);
  
  const handleVerify = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-sm bg-ink2 border border-border rounded-[32px] p-10 text-center"
      >
        <div className="text-5xl mb-6">📬</div>
        <h2 className="display-font text-2xl mb-2">Check Your Email</h2>
        <p className="text-muted text-sm mb-8">We sent a 6-digit confirmation code to your inbox.</p>
        
        <div className="flex gap-2 justify-center mb-8">
          {[1,2,3,4,5,6].map(i => (
            <input 
              key={i} 
              type="text" 
              maxLength={1} 
              className="w-10 h-14 bg-glass border border-border rounded-xl text-center text-xl font-bold focus:border-accent outline-none" 
            />
          ))}
        </div>

        <button className="btn btn-primary btn-lg" onClick={handleVerify} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={18} /> : 'Verify Access →'}
        </button>
        <button onClick={() => onClose()} className="mt-6 text-xs text-muted hover:text-white font-bold uppercase tracking-widest">Resend Code</button>
      </motion.div>
    </div>
  );
}
