import { NextResponse, type NextRequest } from 'next/server';
import {
  Comprehend,
  DetectKeyPhrasesCommand,
} from '@aws-sdk/client-comprehend';
import { KeyPhrasesAnalysisOutput } from '@/lib/dto';

export async function POST(
  request: NextRequest,
): Promise<NextResponse<KeyPhrasesAnalysisOutput>> {
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
      {
        result: {
          keyPhrases:
            (KeyPhrases?.map((x) => x.Text).filter(
              (x) => x !== undefined,
            ) as string[]) ?? [],
        },
      },
      { status: 200 },
    );
  } catch (error) {
    const message = `Error processing image: ${error}`;
    console.log(error);
    return NextResponse.json({ error: { message } }, { status: 500 });
  }
}
