document.addEventListener('DOMContentLoaded', () => {
    // --- 1. ГЕНЕРАЦИЯ ФОНОВЫХ ТЕЛЕФОНОВ ---
    const bgContainer = document.getElementById('bgContainer');
    const phoneCount = 15; // Количество летающих объектов

    for (let i = 0; i < phoneCount; i++) {
        const phone = document.createElement('div');
        phone.classList.add('phone-icon');

        // Случайные позиции и параметры анимации
        const size = Math.random() * 30 + 20; // Размер от 20 до 50px
        const left = Math.random() * 100; // Позиция по горизонтали
        const duration = Math.random() * 15 + 10; // Длительность от 10 до 25с
        const delay = Math.random() * 10; // Задержка старта

        phone.style.width = `${size}px`;
        phone.style.height = `${size * 1.8}px`; // Пропорции телефона
        phone.style.left = `${left}%`;
        phone.style.animationDuration = `${duration}s`;
        phone.style.animationDelay = `${delay}s`;

        // Случайное вращение в начале для разнообразия
        phone.style.transform = `rotate(${Math.random() * 360}deg)`;

        bgContainer.appendChild(phone);
    }

    // --- 2. ЛОГИКА ЧАТА ---
    const chatHistory = document.getElementById('chatHistory');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');

    // Функция добавления сообщения в чат
    function addMessage(text, isUser = false) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', isUser ? 'user-message' : 'ai-message');

        if (!isUser) {
            const avatar = document.createElement('div');
            avatar.classList.add('avatar');
            avatar.textContent = 'S';
            msgDiv.appendChild(avatar);
        }

        const content = document.createElement('div');
        content.classList.add('msg-content');
        content.textContent = text;
        msgDiv.appendChild(content);

        chatHistory.appendChild(msgDiv);
        // Прокрутка вниз
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // Функция запроса к API (Pollinations.ai)
    async function fetchAIResponse(prompt) {
        // Показываем индикатор загрузки
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('message', 'ai-message');
        loadingDiv.innerHTML = `
            <div class="avatar">S</div>
            <div class="msg-content" style="opacity: 0.7;">Анализирую данные...</div>
        `;
        chatHistory.appendChild(loadingDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        try {
            // Используем бесплатный текстовый API Pollinations 
            // Добавляем системный промпт, чтобы он вел себя как SewroAI
            const systemPrompt = "You are SewroAI, a helpful, intelligent, and concise assistant. Answer in Russian.";
            const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai&system=${encodeURIComponent(systemPrompt)}`;

            const response = await fetch(url);

            if (!response.ok) throw new Error('Ошибка сети');

            const aiText = await response.text();

            // Удаляем индикатор загрузки
            chatHistory.removeChild(loadingDiv);

            // Добавляем ответ
            addMessage(aiText, false);

        } catch (error) {
            chatHistory.removeChild(loadingDiv);
            addMessage("Извините, произошла ошибка при подключении к нейросети. Проверьте интернет или попробуйте позже.", false);
            console.error(error);
        }
    }

    // Обработка отправки
    function handleSend() {
        const text = userInput.value.trim();
        if (!text) return;

        // Добавляем сообщение пользователя
        addMessage(text, true);
        userInput.value = '';

        // Запрос к AI
        fetchAIResponse(text);
    }

    // Слушатели событий
    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
});