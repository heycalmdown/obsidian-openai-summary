const apiUrl = 'https://api.openai.com/v1/chat/completions';

interface OpenAIResponse {
  choices: Array<{
    delta: {
      content?: string;
    };
    finish_reason: string;
  }>;
}

// 마크다운 파일 해석 및 instruction에 따른 결과 생성 함수
export async function summary(apiKey: string, instructions: string, fileName: string, content: string): Promise<string> {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "gpt-4o",
      temperature: 0.1,
      messages: [
        { role: "system", content: instructions },
        { role: "user", content: `파일 이름: ${fileName}\n${content}` }
      ],
      stream: true
    })
  });


  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Failed to get reader from response body.');
  }


  const decoder = new TextDecoder();
  let done = false;
  let result = '';
  let buffer = '';

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;

    if (value) {
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');

      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i];
        if (line.trim() === '' || line.startsWith('data: [DONE]')) {
          continue;
        }

        const jsonResponse = line.replace(/^data: /, '');
        try {
          const parsed: OpenAIResponse = JSON.parse(jsonResponse);
          if (parsed.choices[0].delta.content) {
            result += parsed.choices[0].delta.content;
            process.stdout.write(parsed.choices[0].delta.content);
          }
        } catch (e) {
          console.error('Failed to parse JSON response:', e);
        }

      }

      buffer = lines[lines.length - 1]; // 마지막 라인을 버퍼에 남겨두어 다음 청크에서 처리
    }
  }
  return result
}
