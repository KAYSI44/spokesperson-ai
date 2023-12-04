import { NextResponse, type NextRequest } from 'next/server';
import { OverallReportOutput } from '@/lib/dto';
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import { generateReportPrompt } from '@/lib/prompts';
import { jsonrepair } from 'jsonrepair';

export async function POST(
  request: NextRequest,
): Promise<NextResponse<OverallReportOutput>> {
  try {
    const { transcripts }: { transcripts: string[] } = await request.json();

    const bedrockClient = new BedrockRuntimeClient({
      region: process.env.aws_region,
    });

    const chatCommand = new InvokeModelCommand({
      modelId: 'amazon.titan-text-express-v1',
      contentType: 'application/json',
      accept: '*/*',
      body: JSON.stringify({
        inputText: generateReportPrompt(transcripts),
        textGenerationConfig: {
          maxTokenCount: 4096,
          stopSequences: [],
          temperature: 0,
          topP: 1,
        },
      }),
    });

    const { body } = await bedrockClient.send(chatCommand);
    const result = JSON.parse(body.transformToString()) as {
      results: {
        outputText: string;
      }[];
    };

    const data = JSON.parse(
      jsonrepair(result.results[0].outputText),
    ) as OverallReportOutput['result'];

    return NextResponse.json(
      { result: data },
      { status: 200 },
    );
  } catch (error) {
    const message = `Error processing transcripts: ${error}`;
    return NextResponse.json({ error: { message } }, { status: 500 });
  }
}
