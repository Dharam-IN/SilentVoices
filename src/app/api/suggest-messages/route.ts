import OpenAI from 'openai';
import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIStream, StreamingTextResponse } from 'ai'; // Assuming this is still required
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Separate each question with '|||'. These are for an anonymous social messaging platform and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing on universal themes that encourage friendly interaction (e.g., "What's a hobby you've recently started?|||If you could have dinner with any historical figure, who would it be?|||What's a simple thing that makes you happy?"). Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming environment.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      stream: true,
      max_tokens: 400,
      prompt,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { message, status, headers, name } = error;
      return NextResponse.json({ message, status, headers, name });
    } else {
      console.error('An unexpected error occurred:', error);
      return NextResponse.json({ message: 'Internal Server Error' });
    }
  }
}
