import React, { useEffect, useState } from 'react';
import { fetchStatus } from '../services/api';
import { BarChart3, Send, AlertCircle, CheckCircle } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="text-white" size={24} />
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
    </div>
);

const Dashboard = () => {
    const [status, setStatus] = useState({ pending: 0, completed: 0, isProcessing: false });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStatus = async () => {
            try {
                const { data } = await fetchStatus();
                setStatus(data);
            } catch (error) {
                console.error('Failed to load status', error);
            } finally {
                setLoading(false);
            }
        };

        loadStatus();
        const interval = setInterval(loadStatus, 5000);
        return () => clearInterval(interval);
    }, []);

    const DAILY_LIMIT = 500;
    const remaining = DAILY_LIMIT - status.completed; // Simplistic approximation

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Overview of your email automation campaigns</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Emails Sent Today"
                    value={status.completed}
                    icon={Send}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Remaining Limit"
                    value={remaining}
                    icon={AlertCircle}
                    color="bg-orange-500"
                />
                <StatCard
                    title="In Queue"
                    value={status.pending}
                    icon={BarChart3}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Status"
                    value={status.isProcessing ? 'Sending...' : 'Idle'}
                    icon={CheckCircle}
                    color={status.isProcessing ? 'bg-green-500' : 'bg-gray-400'}
                />
            </div>

            {/* Recent activity or charts could go here */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="flex space-x-4">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                        onClick={() => window.location.href = '/campaigns'}
                    >
                        Create New Campaign
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
