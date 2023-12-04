import { NextResponse, type NextRequest } from 'next/server';
import { OverallReportOutput, ReviewOutput } from '@/lib/dto';
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import { generateReportPrompt } from '@/lib/prompts';
import { Analytics } from '@segment/analytics-node';
import { jsonrepair } from 'jsonrepair';
import { GetObjectCommand, S3 } from '@aws-sdk/client-s3';
import { unzipStream } from '@/lib/server';
import { Readable } from 'stream';

const analytics = new Analytics({
  writeKey: process.env.SEGMENT_WRITE_KEY as string,
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
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

    analytics.track({
      userId: params.id, // using meeting id as user id
      event: 'end-meeting',
      properties: data,
    });

    return NextResponse.json({ result: data }, { status: 200 });
  } catch (error) {
    const message = `Error processing transcripts: ${error}`;
    return NextResponse.json({ error: { message } }, { status: 500 });
  }
}

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<OverallReportOutput>> {
  try {
    // Initialize S3
    const s3 = new S3({ region: process.env.aws_region });

    const reportFile = `${process.env.SEGMENT_S3_PATH_PREFIX}/${params.id}/meeting-report.gz`;

    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.aws_s3_bucket_name,
      Key: reportFile,
    });

    const res = await s3.send(getObjectCommand);
    const data = await unzipStream(res.Body as Readable);
    const jsonResult = JSON.parse(
      Buffer.from(data).toString('utf-8'),
    ) as OverallReportOutput['result'];

    return NextResponse.json({
      result: jsonResult,
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: {
          message: `${e}`,
        },
      },
      { status: 500 },
    );
  }
}
