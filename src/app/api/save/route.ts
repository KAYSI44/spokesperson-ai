import { NextResponse, type NextRequest } from 'next/server';
import {
  S3,
  PutObjectCommand,
  GetObjectCommand,
  type PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import { SaveFrameOutput } from '@/lib/dto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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

    // Generate a link to view or download the image
    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.aws_s3_bucket_name,
      Key: key,
    })
    const uri = await getSignedUrl(
      s3,
      getObjectCommand,
      { expiresIn: 24 * 60 * 60 },
    );

    return NextResponse.json(
      { result: { uri } },
      { status: 200 },
    );
  } catch (error) {
    const message = `Error processing image: ${error}`;
    return NextResponse.json({ error: { message } }, { status: 500 });
  }
}
