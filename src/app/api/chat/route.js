export const runtime = 'edge';

export async function POST(request) {
  try {
    const { systemPrompt, messages } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'API 키가 설정되지 않았어요. .env.local 확인하세요.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 150,
        stream: true,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API 에러:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `OpenAI API 에러: ${response.status}` }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('서버 에러:', error);
    return new Response(
      JSON.stringify({ error: '서버 에러가 발생했어요.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
