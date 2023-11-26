import { NextResponse, type NextRequest } from 'next/server';
import {
  Comprehend,
  DetectPiiEntitiesCommand,
} from '@aws-sdk/client-comprehend';
import { PiiAnalysisOutput } from '@/lib/dto';

export async function POST(
  request: NextRequest,
): Promise<NextResponse<PiiAnalysisOutput>> {
  try {
    const { text }: { text: string } = await request.json();

    const comprehend = new Comprehend({ region: process.env.aws_region });
    const piiEntitiesCommand = new DetectPiiEntitiesCommand({
      LanguageCode: 'en',
      Text: text,
    });

    const { Entities } = await comprehend.detectPiiEntities(
      piiEntitiesCommand.input,
    );

    return NextResponse.json(
      {
        result:
          (Entities?.map((x) => {
            const value = text.slice(x.BeginOffset, x.EndOffset);
            return { type: x.Type, value };
          }).filter(
            (x) => x.type !== undefined,
          ) as PiiAnalysisOutput['result']) ?? [],
      },
      { status: 200 },
    );
  } catch (error) {
    const message = `Error processing image: ${error}`;
    return NextResponse.json({ error: { message } }, { status: 500 });
  }
}
