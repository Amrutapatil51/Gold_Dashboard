import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = () => {
    return (
        <div className="flex min-h-screen bg-slate-950 overflow-hidden font-sans text-slate-50 selection:bg-gold-500 selection:text-slate-900">
            {/* Background decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-gold-600/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-indigo-600/10 blur-[100px] rounded-full" />
                <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-slate-800/20 blur-[150px] rounded-full" />
            </div>

            <Sidebar />
            
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
                <Navbar />
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 lg:p-10 custom-scrollbar">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
