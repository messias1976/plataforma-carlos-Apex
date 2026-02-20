// src/lib/chatgpt.js

export async function askChatGPT(message, apiFunction) {
    try {
        const normalizedMessage = Array.isArray(message)
            ? message
                .map((item) => {
                    if (typeof item === 'string') return item;
                    if (item?.content) return `${item.role || 'user'}: ${item.content}`;
                    return JSON.stringify(item);
                })
                .join('\n')
            : (typeof message === 'string' ? message : JSON.stringify(message));

        const data = await apiFunction('/ai/chat', {
            method: 'POST',
            body: JSON.stringify({ message: normalizedMessage }),
        });

        const reply =
            data?.reply ||
            data?.data?.reply ||
            data?.data?.message ||
            data?.message ||
            null;

        return reply || 'Sem resposta da IA.';
    } catch (err) {
        console.error('askChatGPT error:', err);
        return 'Erro ao conectar com a IA.';
    }
}
