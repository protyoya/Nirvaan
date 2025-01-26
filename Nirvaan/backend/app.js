const express = require('express');
const axios = require('axios');
const path = require('path');

require('dotenv').config({ 
    path: path.join(__dirname, '..', '.env'),
    silent: true 
});

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

const RETELL_API_KEY = process.env.RETELL_API_KEY || '';
const AGENT_ID = process.env.AGENT_ID || '';
const FROM_PHONE_NUMBER = process.env.FROM_PHONE_NUMBER || '';
const PORT = process.env.PORT || 8050;

if (!RETELL_API_KEY || !AGENT_ID || !FROM_PHONE_NUMBER) {
    console.error('Missing required environment variables:');
    if (!RETELL_API_KEY) console.error('- RETELL_API_KEY');
    if (!AGENT_ID) console.error('- AGENT_ID');
    if (!FROM_PHONE_NUMBER) console.error('- FROM_PHONE_NUMBER');
    process.exit(1);
}

const retellAxios = axios.create({
    baseURL: 'https://api.retellai.com/v2',
    headers: {
        'Authorization': `Bearer ${RETELL_API_KEY}`,
        'Content-Type': 'application/json'
    }
});

app.post('/submit', async (req, res) => {
    try {
        const { phone_number } = req.body;
        
        const response = await retellAxios.post('/create-phone-call', {
            from_number: FROM_PHONE_NUMBER,
            to_number: phone_number,
            override_agent_id: AGENT_ID,
            retell_llm_dynamic_variables: {}
        });

        res.json(response.data.call_id);
    } catch (error) {
        console.error('Error creating call:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to create call' });
    }
});

app.get('/call-details/:call_id', async (req, res) => {
    try {
        const { call_id } = req.params;
        const response = await retellAxios.get(`/get-call/${call_id}`);
        
        const results = {
            summary: response.data.call_analysis?.call_summary,
            user_sentiment: response.data.call_analysis?.user_sentiment,
            transcript: response.data.transcript,
            call_status: response.data.call_status
        };

        res.json(results);
    } catch (error) {
        console.error('Error fetching call details:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch call details' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
