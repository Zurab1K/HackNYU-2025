import { OpenRouter } from '@openrouter/sdk';
import dotenv from 'dotenv';
dotenv.config();

const openRouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

const askRouter = async (message: string) => {
    const completion = await openRouter.chat.send({
        model: 'openai/gpt-4o',
        messages: [
            {
                role: 'user',
                content: message,
            },
        ],
        stream: false,
    });
    
    return completion.choices[0].message.content;
};

export default askRouter;
