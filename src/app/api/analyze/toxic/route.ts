import { NextResponse, type NextRequest } from 'next/server';
import {
  Comprehend,
  DetectToxicContentCommand,
} from '@aws-sdk/client-comprehend';
import { ToxicityAnalysisOutput } from '@/lib/dto';

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ToxicityAnalysisOutput>> {
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
          (ResultList?.map((x) => {
            const value = x.Labels?.map((l) => l.Name).filter(
              (l) => l !== undefined,
            );
            return { toxicity: x.Toxicity, value };
          }).filter(
            (x) =>
              (x !== undefined && x.toxicity !== undefined) ||
              x.value !== undefined,
          ) as ToxicityAnalysisOutput['result']) ?? [],
      },
      { status: 200 },
    );
  } catch (error) {
    const message = `Error processing image: ${error}`;
    return NextResponse.json({ error: { message } }, { status: 500 });
  }
}
