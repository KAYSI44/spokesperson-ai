import { NextResponse, type NextRequest } from 'next/server';
import { Comprehend, DetectSentimentCommand } from '@aws-sdk/client-comprehend';
import { SentimentAnalysisOutput } from '@/lib/dto';

export async function POST(
  request: NextRequest,
): Promise<NextResponse<SentimentAnalysisOutput>> {
  try {
    const { text }: { text: string } = await request.json();

    const comprehend = new Comprehend({ region: process.env.aws_region });
    const detectSentimentCommand = new DetectSentimentCommand({
      LanguageCode: 'en',
      Text: text,
    });

    const { Sentiment: sentiment } = await comprehend.detectSentiment(
      detectSentimentCommand.input,
    );

    if (!sentiment) throw new Error('Failed to analyze sentiment');

    return NextResponse.json({ result: { sentiment } }, { status: 200 });
  } catch (error) {
    const message = `Error processing image: ${error}`;
    return NextResponse.json({ error: { message } }, { status: 500 });
  }
}
