import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Mail, FileText, Settings } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { to: '/campaigns', icon: <Mail size={20} />, label: 'Campaigns' },
        { to: '/logs', icon: <FileText size={20} />, label: 'Logs' },
    ];

    return (
        <div className="w-64 h-screen bg-gray-900 text-white flex flex-col fixed left-0 top-0">
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    Email Auto
                </h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`
                        }
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-800">
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <Settings size={16} />
                    <span>v1.0.0</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
