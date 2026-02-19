import React, { useState } from 'react';
import { fetchSheets, startCampaign } from '../services/api';
import { Play, FileSpreadsheet, Save, Send, Mail } from 'lucide-react';

const CampaignCreator = () => {
    const [formData, setFormData] = useState({
        name: '',
        spreadsheetId: '',
        sheetName: 'Sheet1',
        subject: '',
        template: 'Hello {{name}},\n\nThis is a test email for {{email}}.',
        delay: 5
    });
    const [contacts, setContacts] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFetchSheet = async () => {
        setLoading(true);
        setMessage('');
        try {
            const { data } = await fetchSheets(formData.spreadsheetId, formData.sheetName);
            setContacts(data.contacts);
            setHeaders(data.headers);
            setMessage(`Successfully loaded ${data.contacts.length} contacts.`);
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.error || 'Error fetching sheet. Check ID and permissions.';
            setMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleStartCampaign = async () => {
        if (contacts.length === 0) {
            setMessage('Please fetch contacts first.');
            return;
        }
        if (contacts.length > 400) {
            setMessage('Warning: Campaign limited to max 400 contacts.');
            return;
        }

        setLoading(true);
        try {
            const { data } = await startCampaign({
                contacts,
                subject: formData.subject,
                template: formData.template
            });
            setMessage(`Campaign started! ${data.count} emails in queue.`);
            setContacts([]); // Clear to prevent double send
        } catch (error) {
            console.error(error);
            setMessage('Error starting campaign.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <header>
                <h1 className="text-3xl font-bold text-gray-900">Create Campaign</h1>
                <p className="text-gray-500">Configure and launch a new email blast</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Source Configuration */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <FileSpreadsheet className="text-green-600" size={20} />
                        Data Source
                    </h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Campaign Name</label>
                        <input
                            type="text" name="name" value={formData.name} onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 p-2"
                            placeholder="e.g. March Newsletter"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Google Sheet ID</label>
                        <input
                            type="text" name="spreadsheetId" value={formData.spreadsheetId} onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 p-2"
                            placeholder="1BxiMvs0XRA5nFMdKbBdB_..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sheet Name</label>
                        <input
                            type="text" name="sheetName" value={formData.sheetName} onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 p-2"
                        />
                    </div>
                    <button
                        onClick={handleFetchSheet} disabled={loading}
                        className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
                    >
                        {loading ? 'Loading...' : 'Fetch Contacts'}
                    </button>

                    {message && <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded-lg">{message}</div>}

                    {contacts.length > 0 && (
                        <div className="text-sm text-gray-600">
                            <p className="font-semibold">Preview Content:</p>
                            <div className="bg-gray-100 p-2 rounded max-h-32 overflow-auto">
                                <pre className="text-xs">{JSON.stringify(contacts[0], null, 2)}</pre>
                            </div>
                            <p className="mt-2 text-xs text-gray-400">Total contacts: {contacts.length}</p>
                        </div>
                    )}
                </div>

                {/* Email Content */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Mail className="text-blue-600" size={20} />
                        Email Content
                    </h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Subject Line</label>
                        <input
                            type="text" name="subject" value={formData.subject} onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 p-2"
                            placeholder="Exclusive Offer for {{name}}"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">
                            HTML Body
                            <span className="text-xs font-normal text-gray-500 ml-2">(Use {'{{variable}}'} for dynamic data)</span>
                        </label>
                        <textarea
                            name="template" value={formData.template} onChange={handleChange}
                            rows={12}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 p-2 font-mono text-sm"
                        ></textarea>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Delay: {formData.delay}s
                        </div>
                        <button
                            onClick={handleStartCampaign} disabled={loading || contacts.length === 0}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={18} />
                            Launch Campaign
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignCreator;
