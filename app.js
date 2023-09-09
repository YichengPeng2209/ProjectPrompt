const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Configuration, OpenAIApi } = require("openai");
const app = express();
const port = 3000;

/*
-----------------------------------------------------------------------------------
Configuration
-----------------------------------------------------------------------------------
*/
require('dotenv').config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);





/*
-----------------------------------------------------------------------------------
Below is the method used to generated the narrative unstructured persona
-----------------------------------------------------------------------------------
*/

app.post('/generatePersona', async (req, res) => {
    try {
        const response = await openai.createChatCompletion({
            model:"ft:gpt-3.5-turbo-0613:monash-university::7vlMuc50",
            messages: [
                {
                    "role": "system",
                    "content": "You are an assistant that specializes in creating detailed personas following a narrative approach."
                },
                {
                    "role": "user",
                    "content": "The persona should be related to technology for older adults.The persona should contain the following internal human factors: Name, Age,  Activity, Health challenge, and Technology literacy. And the following external human factors: Location, Occupation, Social interaction, Behaviour, Social media usage, Adaptation to technology, Goal. The length of the persona should be 100-200 words."
                }
        ]
        });

        const generatedPersona = response.data.choices[0]?.message?.content.trim();

        
        if (generatedPersona) {
            res.json({ persona: generatedPersona });
            console.log(res);
        } else {
            res.status(400).json({ error: 'No persona generated' });
        }

    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to generate persona', details: error.response?.data || error.message });
    }
});




/*
-----------------------------------------------------------------------------------
Below is the method used to generated the bullet point structured persona
-----------------------------------------------------------------------------------
*/

app.post('/generateStructuredPersona', async (req, res) => {
    try {
        const response = await openai.createChatCompletion({
            model: "ft:gpt-3.5-turbo-0613:monash-university::7vlVToRA",
            messages: [
        {
            "role": "system",
            "content": "You are an assistant that specializes in creating detailed personas following a bullet-point approach."
        },
        {
            "role": "user",
            "content": "The persona should be related to technology for older adults.The persona should contain the following internal human factors: Name, Age,  Activity, Health challenge, and Technology literacy. And the following external human factors: Location, Occupation, Social interaction, Behaviour, Social media usage, Adaptation to technology, Goal. The length of the persona should be 100-200 words."
        }
    ]
        });

        const generatedPersona = response.data.choices[0]?.message?.content.trim();
        
        if (generatedPersona) {
            res.json({ persona: generatedPersona });
        } else {
            res.status(400).json({ error: 'No persona generated' });
        }

    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to generate persona', details: error.response?.data || error.message });
    }
});





/*
-----------------------------------------------------------------------------------
No need to make changes
-----------------------------------------------------------------------------------
*/
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});

