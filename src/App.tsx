import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut, 
  Bell, 
  Sun, 
  Moon, 
  Search, 
  Download, 
  Plus, 
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldCheck,
  FileSearch,
  Monitor,
  Network,
  Printer,
  Paperclip
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
// @ts-ignore
import html2pdf from 'html2pdf.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// --- Types ---
type Role = 'admin' | 'user';

interface User {
  u: string;
  p: string;
  r: Role;
}

interface Ticket {
  id: number;
  user: string;
  msg: string;
  cat: string;
  priority: 'عادي' | 'عاجل';
  status: 'قيد المعالجة' | 'تم الحل ✅';
  reply: string;
  replyFiles: string[];
  files: string[];
  createdAt: string;
}

// --- Initial Data ---
const DEFAULT_ADMIN: User = { u: 'admin', p: '123', r: 'admin' };

const getInitialUsers = (): User[] => {
  if (typeof window === 'undefined') return [DEFAULT_ADMIN];
  const stored = localStorage.getItem('it_db_users_v7');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.error("Failed to parse users", e);
    }
  }
  return [DEFAULT_ADMIN];
};

const getInitialTickets = (): Ticket[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('it_db_tickets_v7');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return [];
    }
  }
  return [];
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [users, setUsers] = useState<User[]>(getInitialUsers);
  const [tickets, setTickets] = useState<Ticket[]>(getInitialTickets);
  const [loginError, setLoginError] = useState('');
  
  // Form states
  const [ticketMsg, setTicketMsg] = useState('');
  const [ticketCat, setTicketCat] = useState('منصة إدماج');
  const [ticketPriority, setTicketPriority] = useState<'عادي' | 'عاجل'>('عادي');
  const [searchTerm, setSearchTerm] = useState('');

  // Sync data to localStorage
  useEffect(() => {
    localStorage.setItem('it_db_users_v7', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('it_db_tickets_v7', JSON.stringify(tickets));
  }, [tickets]);

  // Dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = (e.target as any).username.value.trim();
    const p = (e.target as any).password.value.trim();
    
    // Case-insensitive username check
    const found = users.find(x => x.u.toLowerCase() === u.toLowerCase() && x.p === p);
    
    if (found) {
      setUser(found);
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('بيانات الدخول غير صحيحة! تأكد من كتابة admin و 123');
    }
  };

  const resetAllData = () => {
    if (confirm('هل أنت متأكد من رغبتك في مسح كافة البيانات وإعادة ضبط المصنع؟')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setActiveTab('home');
  };

  const addTicket = () => {
    if (!ticketMsg.trim()) return;
    const newTicket: Ticket = {
      id: Date.now(),
      user: user?.u || 'unknown',
      msg: ticketMsg,
      cat: ticketCat,
      priority: ticketPriority,
      status: 'قيد المعالجة',
      reply: '',
      replyFiles: [],
      files: [],
      createdAt: new Date().toLocaleString('ar-EG')
    };
    setTickets([newTicket, ...tickets]);
    setTicketMsg('');
  };

  const resolveTicket = (id: number) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: 'تم الحل ✅' } : t));
  };

  const addReply = (id: number) => {
    const reply = prompt('أدخل الرد التقني:');
    if (reply) {
      setTickets(tickets.map(t => t.id === id ? { ...t, reply } : t));
    }
  };

  const exportPDF = (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const opt = {
        margin: 1,
        filename: `${filename}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().from(element).set(opt).save();
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#fef9e6] dark:bg-[#1a2a1a] flex items-center justify-center p-4 font-['Almarai']" dir="rtl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#1e3a2e] p-10 rounded-3xl shadow-2xl w-full max-w-md border-t-8 border-[#c1272d] relative overflow-hidden"
        >
          <div className="text-center mb-8">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Coat_of_arms_of_Morocco.svg/120px-Coat_of_arms_of_Morocco.svg.png" alt="شعار المملكة" className="w-20 h-20 mx-auto mb-4 drop-shadow-md" />
            <h2 className="text-xl font-black text-[#c1272d] dark:text-[#c5a059] uppercase">منصة الدعم التقني الداخلي</h2>
            <p className="text-[10px] text-slate-500 mt-2 font-bold">مديرية النهوض بحقوق الأشخاص في وضعية إعاقة</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input name="username" type="text" placeholder="اسم المستخدم (admin)" required
                   className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-red-200 outline-none focus:ring-2 focus:ring-[#c5a059] text-right" />
            <input name="password" type="password" placeholder="كلمة المرور (123)" required
                   className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-red-200 outline-none focus:ring-2 focus:ring-[#c5a059] text-right" />
            <button type="submit" className="w-full bg-[#c1272d] text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-[#c5a059] transition-all">دخول آمن للمنصة</button>
          </form>
          
          {loginError && <p className="text-rose-500 text-xs text-center mt-4 font-bold">{loginError}</p>}
          
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 mb-2">في حال واجهت مشكلة في الدخول:</p>
            <button 
              onClick={resetAllData}
              className="text-[10px] text-rose-400 hover:underline font-bold"
            >
              إعادة ضبط كافة البيانات (Reset)
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn("flex h-screen bg-[#fef9e6] dark:bg-[#1a2a1a] font-['Almarai'] text-right overflow-hidden", darkMode && "dark")} dir="rtl">
      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-[#1e3a2e] border-l border-red-200 dark:border-red-800 flex flex-col shadow-2xl z-30">
        <div className="p-6 text-center border-b border-red-200 dark:border-red-800">
          <div className="bg-[#c1272d] w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-2 shadow-lg border-2 border-[#c5a059]">
            <Monitor />
          </div>
          <h1 className="font-black text-lg text-[#c1272d] dark:text-[#c5a059]">الدعم التقني الداخلي</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home size={20} />} label="الرئيسية" />
          <NavButton active={activeTab === 'report'} onClick={() => setActiveTab('report')} icon={<FileText size={20} />} label="التقرير الاستراتيجي" />
          <NavButton active={activeTab === 'tickets'} onClick={() => setActiveTab('tickets')} icon={<MessageSquare size={20} />} label="الطلبات" badge={tickets.filter(t => t.status === 'قيد المعالجة').length} />
          <NavButton active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} icon={<BarChart3 size={20} />} label="الإحصائيات" />
          {user?.r === 'admin' && (
            <>
              <NavButton active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} icon={<Users size={20} />} label="إدارة الموظفين" />
              <NavButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={20} />} label="الإعدادات" />
            </>
          )}
          <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 text-rose-500 font-bold mt-10 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all">
            <LogOut size={20} /> خروج
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* Header Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-full bg-white dark:bg-[#1e3a2e] shadow-md text-[#c1272d] dark:text-[#c5a059]">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="bg-white dark:bg-[#1e3a2e] px-6 py-2 rounded-2xl shadow-sm border-r-4 border-[#c1272d] flex items-center gap-3">
              <Bell className="text-[#c5a059]" size={18} />
              <span className="font-bold text-sm">مرحباً، {user?.u}</span>
            </div>
          </div>
          
          <div className="text-left">
            <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400">المملكة المغربية</h2>
            <h1 className="text-sm font-black text-[#c1272d]">وزارة التضامن والإدماج الاجتماعي والأسرة</h1>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CategoryCard icon={<Monitor />} title="منصة إدماج" color="border-[#c1272d]" onClick={() => setTicketCat('منصة إدماج')} />
                <CategoryCard icon={<Network />} title="الشبكة والـ VPN" color="border-[#c5a059]" onClick={() => setTicketCat('الشبكة')} />
                <CategoryCard icon={<Printer />} title="الأجهزة والعتاد" color="border-green-700" onClick={() => setTicketCat('الأجهزة')} />
              </div>

              <div className="bg-white dark:bg-[#1e3a2e] p-8 rounded-3xl shadow-lg border-2 border-[#c5a059]/20">
                <h3 className="font-bold mb-6 text-[#c1272d] dark:text-[#c5a059] flex items-center gap-2 text-lg">
                  <Plus size={24} /> تقديم طلب دعم تقني جديد
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <textarea 
                    value={ticketMsg}
                    onChange={(e) => setTicketMsg(e.target.value)}
                    rows={4} 
                    placeholder="صِف المشكلة التقنية بالتفصيل..." 
                    className="md:col-span-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-red-100 outline-none focus:ring-2 focus:ring-[#c5a059] text-right"
                  />
                  <div className="space-y-2">
                    <label className="block text-sm font-bold pr-2">الفئة التقنية</label>
                    <select 
                      value={ticketCat}
                      onChange={(e) => setTicketCat(e.target.value)}
                      className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-red-100 outline-none font-bold"
                    >
                      <option value="منصة إدماج">منصة إدماج</option>
                      <option value="الشبكة">الشبكة والـ VPN</option>
                      <option value="الأجهزة">الطابعات والعتاد</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold pr-2">الأولوية</label>
                    <select 
                      value={ticketPriority}
                      onChange={(e) => setTicketPriority(e.target.value as any)}
                      className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-red-100 outline-none font-bold"
                    >
                      <option value="عادي">عادي</option>
                      <option value="عاجل">عاجل</option>
                    </select>
                  </div>
                  <button 
                    onClick={addTicket}
                    className="bg-[#c1272d] text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-[#c5a059] transition-all md:col-span-2 text-lg"
                  >
                    إرسال الطلب للفريق التقني
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'report' && (
            <motion.div key="report" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-[#c1272d] dark:text-[#c5a059]">التقرير الاستراتيجي للمنصة</h2>
                <button 
                  onClick={() => exportPDF('strategic-report-content', 'Strategic_Report_Directorate')}
                  className="bg-green-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:bg-green-800 transition-all"
                >
                  <Download size={20} /> تحميل التقرير PDF
                </button>
              </div>

              <div id="strategic-report-content" className="bg-white dark:bg-[#1e3a2e] p-12 rounded-[40px] shadow-2xl border-r-[12px] border-[#c1272d] leading-relaxed text-slate-800 dark:text-slate-100">
                <div className="text-center mb-12 border-b-2 border-slate-100 pb-8">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Coat_of_arms_of_Morocco.svg/120px-Coat_of_arms_of_Morocco.svg.png" alt="Logo" className="w-24 h-24 mx-auto mb-4" />
                  <h1 className="text-3xl font-black text-[#c1272d] mb-2">تقرير استراتيجي حول منصة الدعم التقني الداخلي</h1>
                  <h2 className="text-xl font-bold text-[#c5a059]">مديرية النهوض بحقوق الأشخاص في وضعية إعاقة</h2>
                  <p className="text-sm text-slate-500 mt-4">تاريخ الإصدار: {new Date().toLocaleDateString('ar-EG')}</p>
                </div>

                <section className="space-y-8">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl">
                    <h3 className="text-xl font-black text-[#c1272d] mb-4 flex items-center gap-3">
                      <ShieldCheck className="text-[#c5a059]" /> 1. دور المنصة وأهميتها الاستراتيجية
                    </h3>
                    <p className="text-lg">
                      تعتبر المنصة أداة تقنية استراتيجية تهدف إلى مركزة وتدبير طلبات الدعم التقني الصادرة عن مختلف أقسام ومصالح المديرية. تلعب دوراً محورياً في ضمان استمرارية العمل الإداري والتقني، من خلال توفير قناة تواصل مباشرة بين الموظفين وفريق الدعم التقني، مما يقلل من زمن الاستجابة للأعطال ويزيد من كفاءة الأداء المهني داخل المديرية.
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl">
                    <h3 className="text-xl font-black text-[#c1272d] mb-4 flex items-center gap-3">
                      <BarChart3 className="text-[#c5a059]" /> 2. أهداف المنصة الرئيسية
                    </h3>
                    <ul className="list-disc list-inside space-y-3 text-lg pr-4">
                      <li>رقمنة المسار الكامل لطلبات الدعم التقني من التقديم إلى الحل النهائي.</li>
                      <li>توفير قاعدة معرفية تقنية تساعد الموظفين على حل المشاكل البسيطة بشكل ذاتي.</li>
                      <li>تتبع مؤشرات الأداء التقني وتحديد الاحتياجات المستقبلية من العتاد والبرمجيات.</li>
                      <li>ضمان أمن وسلامة المعطيات التقنية المتداولة داخل أنظمة المديرية.</li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl">
                    <h3 className="text-xl font-black text-[#c1272d] mb-4 flex items-center gap-3">
                      <CheckCircle2 className="text-[#c5a059]" /> 3. دور المنصة في تحقيق أهداف المديرية
                    </h3>
                    <p className="text-lg mb-4">تساهم المنصة بشكل مباشر في تحقيق الأهداف الاستراتيجية للمديرية من خلال:</p>
                    <ul className="list-disc list-inside space-y-3 text-lg pr-4">
                      <li><strong>دعم منصة "إدماج":</strong> ضمان اشتغال المنصة الوطنية "إدماج" بشكل مستمر، وهي الركيزة الأساسية لتدبير برامج دعم الأشخاص في وضعية إعاقة.</li>
                      <li><strong>تجويد الخدمات الإدارية:</strong> حل المشاكل التقنية للموظفين يضمن عدم تعثر الخدمات المقدمة للمرتفقين.</li>
                      <li><strong>التحول الرقمي:</strong> تجسيد رؤية المديرية في الانتقال نحو "الإدارة الرقمية" الفعالة والشفافة.</li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl">
                    <h3 className="text-xl font-black text-[#c1272d] mb-4 flex items-center gap-3">
                      <FileSearch className="text-[#c5a059]" /> 4. دور المنصة في تنزيل القوانين والحقوق
                    </h3>
                    <p className="text-lg mb-4">تأتي هذه المنصة كاستجابة عملية لالتزامات الدولة المغربية في مجال حقوق الأشخاص في وضعية إعاقة:</p>
                    <ul className="list-disc list-inside space-y-3 text-lg pr-4">
                      <li><strong>القانون الإطار رقم 97.13:</strong> تفعيل مقتضيات حماية حقوق الأشخاص في وضعية إعاقة عبر ضمان ولوجيات رقمية صلبة.</li>
                      <li><strong>الاتفاقية الدولية:</strong> الالتزام بالمادة 9 (إمكانية الوصول) والمادة 21 (الحصول على المعلومات) عبر جاهزية الأدوات الرقمية.</li>
                      <li><strong>السياسة العمومية المندمجة:</strong> دعم ركيزة "الحكامة والتحول الرقمي" في السياسة الوطنية للنهوض بحقوق الأشخاص في وضعية إعاقة.</li>
                    </ul>
                  </div>
                </section>

                <div className="mt-16 pt-8 border-t-2 border-slate-100 flex justify-between items-center text-sm font-bold text-slate-400">
                  <span>توقيع الإدارة التقنية</span>
                  <span>ختم المديرية</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'tickets' && (
            <motion.div key="tickets" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-[#c1272d] dark:text-[#c5a059]">سجل طلبات الدعم</h2>
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="بحث في الطلبات..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-12 pl-4 py-3 rounded-2xl bg-white dark:bg-[#1e3a2e] shadow-sm border border-red-50 outline-none focus:ring-2 focus:ring-[#c5a059] w-64"
                    />
                  </div>
                  <button onClick={() => exportPDF('tickets-list-content', 'Tickets_Report')} className="bg-[#c5a059] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-md">
                    <Download size={20} /> تصدير PDF
                  </button>
                </div>
              </div>

              <div id="tickets-list-content" className="space-y-4">
                {tickets
                  .filter(t => user?.r === 'admin' || t.user === user?.u)
                  .filter(t => t.msg.includes(searchTerm) || t.user.includes(searchTerm))
                  .map(t => (
                    <div key={t.id} className="bg-white dark:bg-[#1e3a2e] p-6 rounded-3xl shadow-sm border-r-8 border-slate-100 hover:border-[#c1272d] transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-3 items-center">
                          <span className="font-black text-[#c1272d]">@{t.user}</span>
                          <span className={cn("text-[10px] px-3 py-1 rounded-full font-bold", t.priority === 'عاجل' ? "bg-rose-100 text-rose-600" : "bg-blue-100 text-blue-600")}>
                            {t.priority === 'عاجل' ? '🚨 عاجل' : '📌 عادي'}
                          </span>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full font-bold">{t.cat}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold">{t.createdAt}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-200 mb-4 font-medium">{t.msg}</p>
                      
                      {t.reply && (
                        <div className="bg-[#c5a059]/5 p-4 rounded-2xl border-r-4 border-[#c5a059] mb-4">
                          <p className="text-sm font-bold text-[#c5a059] mb-1">رد الفريق التقني:</p>
                          <p className="text-sm">{t.reply}</p>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-4 border-t border-slate-50 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          {t.status === 'قيد المعالجة' ? <Clock size={16} className="text-amber-500" /> : <CheckCircle2 size={16} className="text-green-500" />}
                          <span className={cn("text-xs font-bold", t.status === 'قيد المعالجة' ? "text-amber-600" : "text-green-600")}>{t.status}</span>
                        </div>
                        {user?.r === 'admin' && t.status === 'قيد المعالجة' && (
                          <div className="flex gap-2">
                            <button onClick={() => addReply(t.id)} className="bg-[#c5a059] text-white px-4 py-2 rounded-xl text-xs font-bold">إضافة رد</button>
                            <button onClick={() => resolveTicket(t.id)} className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold">تم الحل</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              <h2 className="text-2xl font-black text-[#c1272d] dark:text-[#c5a059]">مؤشرات الأداء التقني</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="إجمالي الطلبات" value={tickets.length} icon={<MessageSquare />} color="text-[#c1272d]" />
                <StatCard title="قيد المعالجة" value={tickets.filter(t => t.status === 'قيد المعالجة').length} icon={<Clock />} color="text-amber-500" />
                <StatCard title="طلبات تم حلها" value={tickets.filter(t => t.status === 'تم الحل ✅').length} icon={<CheckCircle2 />} color="text-green-600" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-[#1e3a2e] p-8 rounded-[40px] shadow-lg">
                  <h3 className="font-bold mb-6 text-center">توزيع الطلبات حسب الفئة</h3>
                  <div className="h-64 flex justify-center">
                    <Pie 
                      data={{
                        labels: ['منصة إدماج', 'الشبكة', 'الأجهزة'],
                        datasets: [{
                          data: [
                            tickets.filter(t => t.cat === 'منصة إدماج').length,
                            tickets.filter(t => t.cat === 'الشبكة').length,
                            tickets.filter(t => t.cat === 'الأجهزة').length
                          ],
                          backgroundColor: ['#c1272d', '#c5a059', '#006233'],
                          borderWidth: 0
                        }]
                      }}
                      options={{ maintainAspectRatio: false }}
                    />
                  </div>
                </div>

                <div className="bg-white dark:bg-[#1e3a2e] p-8 rounded-[40px] shadow-lg">
                  <h3 className="font-bold mb-6 text-center">حالة الطلبات</h3>
                  <div className="h-64 flex justify-center">
                    <Bar 
                      data={{
                        labels: ['قيد المعالجة', 'تم الحل'],
                        datasets: [{
                          label: 'عدد الطلبات',
                          data: [
                            tickets.filter(t => t.status === 'قيد المعالجة').length,
                            tickets.filter(t => t.status === 'تم الحل ✅').length
                          ],
                          backgroundColor: ['#f59e0b', '#10b981'],
                          borderRadius: 12
                        }]
                      }}
                      options={{ maintainAspectRatio: false }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'admin' && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <h2 className="text-2xl font-black text-[#c1272d] dark:text-[#c5a059]">إدارة حسابات الموظفين</h2>
              <div className="bg-white dark:bg-[#1e3a2e] p-8 rounded-[40px] shadow-lg border-2 border-red-50">
                <h3 className="font-bold mb-6 flex items-center gap-2"><Plus size={20} /> إضافة حساب جديد</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const u = (e.target as any).u.value;
                  const p = (e.target as any).p.value;
                  const r = (e.target as any).r.value;
                  if (u && p) {
                    setUsers([...users, { u, p, r }]);
                    (e.target as any).reset();
                  }
                }} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input name="u" type="text" placeholder="اسم المستخدم" className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-red-50 outline-none" />
                  <input name="p" type="password" placeholder="كلمة المرور" className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-red-50 outline-none" />
                  <select name="r" className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-red-50 outline-none font-bold">
                    <option value="user">موظف (مستخدم)</option>
                    <option value="admin">مسؤول تقني</option>
                  </select>
                  <button type="submit" className="bg-[#c5a059] text-white font-bold rounded-2xl hover:brightness-110 py-4 shadow-md">تفعيل الحساب</button>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {users.map((u, i) => (
                  <div key={i} className="bg-white dark:bg-[#1e3a2e] p-6 rounded-3xl font-bold border border-red-50 shadow-sm flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[#c1272d]">@{u.u}</span>
                      <span className="text-[10px] text-slate-400">{u.r === 'admin' ? 'مسؤول تقني' : 'موظف'}</span>
                    </div>
                    <Users className="text-[#c5a059]" size={20} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- Sub-components ---

function NavButton({ active, onClick, icon, label, badge }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, badge?: number }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all relative group",
        active ? "bg-[#c1272d]/10 text-[#c1272d] border-l-4 border-[#c1272d]" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
      )}
    >
      <span className={cn("transition-transform group-hover:scale-110", active && "text-[#c1272d]")}>{icon}</span>
      <span className="flex-1 text-right">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="bg-[#c1272d] text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">{badge}</span>
      )}
    </button>
  );
}

function CategoryCard({ icon, title, color, onClick }: { icon: React.ReactNode, title: string, color: string, onClick: () => void }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      onClick={onClick}
      className={cn("bg-white dark:bg-[#1e3a2e] p-8 rounded-[40px] shadow-sm border-b-8 hover:shadow-xl transition-all cursor-pointer text-center group", color)}
    >
      <div className="text-5xl text-[#c1272d] mb-4 flex justify-center group-hover:scale-110 transition-transform">{icon}</div>
      <h4 className="font-black text-lg">{title}</h4>
    </motion.div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-white dark:bg-[#1e3a2e] p-8 rounded-[40px] shadow-lg text-center border-b-4 border-slate-100 hover:border-[#c1272d] transition-all">
      <div className={cn("text-4xl mb-3 flex justify-center", color)}>{icon}</div>
      <p className="text-4xl font-black mb-1">{value}</p>
      <p className="text-sm font-bold text-slate-400">{title}</p>
    </div>
  );
}
