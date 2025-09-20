import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  console.log('[CHAT_API] - Received POST request');
  try {
    const apiKey = process.env.IONET_API_KEY;
    if (!apiKey) {
      console.error('[CHAT_API] - IONET_API_KEY is not set in .env.local');
      return new NextResponse('Server configuration error: Missing API Key', { status: 500 });
    }
    console.log('[CHAT_API] - API Key found.');

        const { messages, lessonContext, model } = await req.json();
        if (!messages || messages.length === 0) {
          console.error('[CHAT_API] - No messages received from client');
          return new NextResponse('Messages are required', { status: 400 });
        }
        console.log(`[CHAT_API] - Received ${messages.length} messages.`);
    
        const systemMessage = {
          role: 'system',
          content: `You are an assistant for a learning platform. Your primary and only language for communication is Russian. All your responses MUST be in Russian. Use the following lesson content to answer the user's question. Be concise and direct.\n\n---LESSON CONTENT---\n${lessonContext || 'No context provided.'}\n---END LESSON CONTENT---`,
        };
    
        const requestBody = {
          model: model || 'mistralai/Mistral-Nemo-Instruct-2407', // Fallback to a default model
          messages: [systemMessage, ...messages],
        };
    console.log('[CHAT_API] - Sending request to io.net...');
    const response = await fetch('https://api.intelligence.io.solutions/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log(`[CHAT_API] - Received status ${response.status} from io.net.`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[CHAT_API] - io.net API error:', errorText);
      return new NextResponse(`Error from external API: ${errorText}`, { status: response.status });
    }

    const data = await response.json();
    let aiMessage = data.choices[0]?.message?.content;

    if (aiMessage) {
      // Удаляем теги <think> и их содержимое
      aiMessage = aiMessage.replace(/<think>[\s\S]*?<\/think>/, '').trim();
    }

    if (!aiMessage) {
      console.error('[CHAT_API] - No content in AI response');
      return new NextResponse('Failed to get a valid response from AI', { status: 500 });
    }

    console.log('[CHAT_API] - Successfully got AI response. Sending back to client.');
    return NextResponse.json({ content: aiMessage });

  } catch (error) {
    console.error('[CHAT_API] - An unexpected error occurred:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}