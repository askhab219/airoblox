const express = require('express');
const axios = require('axios');
const app = express();

// Разрешаем серверу понимать JSON-формат
app.use(express.json());

// Ваш API-ключ от OpenAI (лучше хранить в переменных окружения, но для теста можно вписать сюда)
const OPENAI_API_KEY = 'ВАШ_API_KEY_ОТ_OPENAI';

app.post('/chat', async (req, res) => {
    const userPrompt = req.body.prompt;
    const playerName = req.body.player;

    if (!userPrompt) {
        return res.status(400).json({ reply: 'Пустой запрос' });
    }

    try {
        // Отправляем запрос к OpenAI API
        const aiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo', // Можно заменить на другую модель
            messages: [
                { role: 'system', content: 'Ты дружелюбный NPC в игре Roblox. Отвечай коротко и интересно (до 2-3 предложений).' },
                { role: 'user', content: userPrompt }
            ],
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Получаем ответ от нейросети
        const replyText = aiResponse.data.choices[0].message.content;
        
        // Отправляем ответ обратно в Roblox
        res.json({ reply: replyText });

    } catch (error) {
        console.error('Ошибка при обращении к ИИ:', error.response ? error.response.data : error.message);
        res.status(500).json({ reply: 'Извини, у меня временные неполадки с мозгами...' });
    }
});

// Запуск сервера на порту 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Прокси-сервер запущен на порту ${PORT}`);
});