import { NextResponse, type NextRequest } from 'next/server';
import { Comprehend, DetectSentimentCommand } from '@aws-sdk/client-comprehend';

export async function POST(request: NextRequest) {
  try {
    const { text }: { text: string } = await request.json();

    const comprehend = new Comprehend({ region: process.env.aws_region });
    const detectSentimentCommand = new DetectSentimentCommand({
      LanguageCode: 'en',
      Text: text,
    });

    const { Sentiment } = await comprehend.detectSentiment(
      detectSentimentCommand.input,
    );

    return NextResponse.json({ result: Sentiment }, { status: 200 });
  } catch (error) {
    const message = `Error processing image: ${error}`;
    console.log(error);
    return NextResponse.json({ error: { message } }, { status: 500 });
  }
}
