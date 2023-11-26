import { NextResponse, type NextRequest } from 'next/server';
import {
  S3,
  PutObjectCommand,
  type PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import { SaveFrameOutput } from '@/lib/dto';

export async function POST(
  request: NextRequest,
): Promise<NextResponse<SaveFrameOutput>> {
  try {
    const { image: base64 }: { image: string } = await request.json();

    // Decode the base64 image data
    const imageBuffer = Buffer.from(base64, 'base64');

    // Initialize S3
    const s3 = new S3({ region: process.env.aws_region });

    // Set the S3 bucket and key
    const key = `${uuid()}.png`;

    // Set S3 parameters
    const params: PutObjectCommandInput = {
      Bucket: process.env.aws_s3_bucket_name,
      Key: key,
      Body: imageBuffer,
      ContentType: 'image/png',
    };

    // Upload the image file to S3
    const uploadCommand = new PutObjectCommand(params);
    await s3.send(uploadCommand);

    // Get the uri to the uploaded file
    const s3LocationUri = `https://${process.env.aws_s3_bucket_name}.s3.${process.env.aws_region}.amazonaws.com/${key}`;

    return NextResponse.json(
      { result: { uri: s3LocationUri } },
      { status: 200 },
    );
  } catch (error) {
    const message = `Error processing image: ${error}`;
    console.log(error);
    return NextResponse.json({ error: { message } }, { status: 500 });
  }
}
