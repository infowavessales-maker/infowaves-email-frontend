import React from 'react';
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.PROD
        ? "https://infowaves-email-api.onrender.com/api"
        : "http://localhost:5000/api",
});

export const fetchSheets = (spreadsheetId, range) =>
    api.post('/sheets/fetch', { spreadsheetId, range });

export const startCampaign = (data) =>
    api.post('/campaign/start', data);

export const fetchLogs = () =>
    api.get('/logs');

export const fetchStatus = () =>
    api.get('/status');

export default api;
