import { NextResponse, type NextRequest } from 'next/server';
import {
  Comprehend,
  DetectKeyPhrasesCommand,
} from '@aws-sdk/client-comprehend';

export async function POST(request: NextRequest) {
  try {
    const { text }: { text: string } = await request.json();

    const comprehend = new Comprehend({ region: process.env.aws_region });
    const keyPhrasesCommand = new DetectKeyPhrasesCommand({
      LanguageCode: 'en',
      Text: text,
    });

    const { KeyPhrases } = await comprehend.detectKeyPhrases(
      keyPhrasesCommand.input,
    );

    return NextResponse.json(
      { result: KeyPhrases?.map((x) => x.Text) ?? [] },
      { status: 200 },
    );
  } catch (error) {
    const message = `Error processing image: ${error}`;
    console.log(error);
    return NextResponse.json({ error: { message } }, { status: 500 });
  }
}
