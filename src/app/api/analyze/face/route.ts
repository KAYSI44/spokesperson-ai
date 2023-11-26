import { NextResponse, type NextRequest } from 'next/server';
import { DetectFacesCommand, Rekognition } from '@aws-sdk/client-rekognition';
import { FaceAnalysisOutput } from '@/lib/dto';

export async function POST(
  request: NextRequest,
): Promise<NextResponse<FaceAnalysisOutput>> {
  try {
    const { image: base64 }: { image: string } = await request.json();

    // Decode the base64 image data
    const imageBuffer = Buffer.from(base64, 'base64');

    // Initialize AWS Rekognition
    const rekognition = new Rekognition({ region: process.env.aws_region });

    // Use AWS Rekognition to process the image
    const detectFaces = new DetectFacesCommand({
      Image: {
        Bytes: imageBuffer,
      },
      Attributes: ['GENDER', 'SMILE', 'EMOTIONS', 'EYES_OPEN', 'EYE_DIRECTION'],
    });

    const { FaceDetails } = await rekognition.detectFaces(detectFaces.input);

    return NextResponse.json({ result: FaceDetails }, { status: 200 });
  } catch (error) {
    const message = `Error processing image: ${error}`;
    return NextResponse.json({ error: { message } }, { status: 500 });
  }
}
