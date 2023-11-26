import { NextResponse, type NextRequest } from 'next/server';
import {
  S3,
  PutObjectCommand,
  type PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import {
  Transcribe,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand,
  type Transcript,
} from '@aws-sdk/client-transcribe';
import axios from 'axios';
import { TranscribeSpeechOutput } from '@/lib/dto';

interface TranscriptionResult {
  jobName: string;
  accountId: string;
  results: {
    transcripts: {
      transcript: string;
    }[];
  };
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<TranscribeSpeechOutput>> {
  try {
    const { audio: base64 }: { audio: string } = await request.json();

    // Decode the base64 audio data
    const audioBuffer = Buffer.from(base64, 'base64');

    // Initialize S3
    const s3 = new S3({ region: process.env.aws_region });

    // Set the S3 bucket and key
    const key = `${uuid()}.wav`;

    // Set S3 parameters
    const params: PutObjectCommandInput = {
      Bucket: process.env.aws_s3_bucket_name,
      Key: key,
      Body: audioBuffer,
      ContentType: 'audio/wav',
    };

    // Upload the audio file to S3
    const uploadCommand = new PutObjectCommand(params);
    await s3.send(uploadCommand);

    // Get the uri to the audio file
    const s3LocationUri = `https://${process.env.aws_s3_bucket_name}.s3.${process.env.aws_region}.amazonaws.com/${key}`;

    // Initialize AWS Transcribe
    const transcribe = new Transcribe({ region: process.env.aws_region });

    // Use AWS Transcribe to process the audio
    const jobName = uuid();
    const transcribeJob = new StartTranscriptionJobCommand({
      Media: {
        MediaFileUri: s3LocationUri,
      },
      TranscriptionJobName: jobName,
      IdentifyLanguage: true,
    });

    const { TranscriptionJob } = await transcribe.startTranscriptionJob(
      transcribeJob.input,
    );

    // Long polling function to get transcription status
    const pollTranscriptionJob = new Promise<Transcript | undefined>(
      (resolve) => {
        async function runJob(jobName: string) {
          const getTranscriptionJobCommand = new GetTranscriptionJobCommand({
            TranscriptionJobName: jobName,
          });
          const getTranscriptionJobData = await transcribe.send(
            getTranscriptionJobCommand,
          );

          const status =
            getTranscriptionJobData.TranscriptionJob?.TranscriptionJobStatus;

          if (status === 'COMPLETED') {
            resolve(getTranscriptionJobData.TranscriptionJob?.Transcript);
          } else if (status === 'FAILED') {
            throw new Error(
              getTranscriptionJobData.TranscriptionJob?.FailureReason,
            );
          } else {
            // If not completed, wait and poll again
            setTimeout(() => runJob(jobName), 5000); // Poll every 5 seconds
          }
        }

        if (!TranscriptionJob?.TranscriptionJobName)
          throw new Error('Failed to start transcription job.');

        // Start long polling
        runJob(TranscriptionJob.TranscriptionJobName);
      },
    );

    const transcript = await pollTranscriptionJob;
    if (!transcript?.TranscriptFileUri)
      throw new Error('Failed to get transcription URL');

    const response = await axios(transcript?.TranscriptFileUri);
    const transcriptionResult = response.data as TranscriptionResult;

    if (!transcriptionResult.results.transcripts.length)
      throw new Error('No transcripts generated.');

    return NextResponse.json(
      {
        result: {
          text: transcriptionResult.results.transcripts[0].transcript,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    const message = `Error processing image: ${error}`;
    return NextResponse.json({ error: { message } }, { status: 500 });
  }
}
