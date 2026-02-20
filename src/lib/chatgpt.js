// src/lib/chatgpt.js

export async function askChatGPT(message, apiFunction) {
    try {
        const data = await apiFunction('/ai/chat', {
            method: 'POST',
            body: JSON.stringify({ message }),
        });

        // data.reply já é string, não precisa de .content
        return data.reply || 'Sem resposta da IA.';
    } catch (err) {
        console.error('askChatGPT error:', err);
        return 'Erro ao conectar com a IA.';
    }
}
