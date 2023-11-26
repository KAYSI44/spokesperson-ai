import { NextResponse, type NextRequest } from 'next/server';
import {
  Comprehend,
  DetectToxicContentCommand,
} from '@aws-sdk/client-comprehend';

export async function POST(request: NextRequest) {
  try {
    const { text }: { text: string } = await request.json();

    const comprehend = new Comprehend({ region: process.env.aws_region });
    const toxicContentCommand = new DetectToxicContentCommand({
      LanguageCode: 'en',
      TextSegments: [{ Text: text }],
    });

    const { ResultList } = await comprehend.detectToxicContent(
      toxicContentCommand.input,
    );

    return NextResponse.json(
      {
        result:
          ResultList?.map((x) => {
            const value = x.Labels?.map((l) => l.Name);
            return { toxicity: x.Toxicity, value };
          }) ?? [],
      },
      { status: 200 },
    );
  } catch (error) {
    const message = `Error processing image: ${error}`;
    console.log(error);
    return NextResponse.json({ error: { message } }, { status: 500 });
  }
}
