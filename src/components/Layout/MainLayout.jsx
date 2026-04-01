import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = () => {
    return (
        <div className="flex min-h-screen bg-slate-900 overflow-hidden font-sans text-slate-50">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <Navbar />
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
