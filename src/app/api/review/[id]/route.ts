import { NextRequest, NextResponse } from 'next/server';
import { S3, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { ReviewOutput } from '@/lib/dto';
import { Readable } from 'stream';
import { AnalysisEvent } from '@/context/analytics-context';
import { unzipStream } from '@/lib/server';

interface SegmentDocument {
  userId: string;
  properties: AnalysisEvent;
}

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<ReviewOutput>> {
  try {
    // Initialize S3
    const s3 = new S3({ region: process.env.aws_region });

    // Folder with this meeting's data (from Segment)
    const segmentFolder = `${process.env.SEGMENT_S3_PATH_PREFIX}/${params.id}`;

    // List objects in the specified path
    const listObjectsCommand = new ListObjectsV2Command({
      Bucket: process.env.aws_s3_bucket_name,
      Prefix: segmentFolder,
    });
    const objects = await s3.send(listObjectsCommand);

    // Create an array of promises for fetching objects
    const fetchPromises: Promise<Uint8Array>[] = [];

    for (const object of objects.Contents || []) {
      const key = object.Key;
      fetchPromises.push(
        s3
          .getObject({
            Bucket: process.env.aws_s3_bucket_name,
            Key: key,
          })
          .then((res) => unzipStream(res.Body as Readable)),
      );
    }

    const fetchResults = await Promise.all(fetchPromises);
    const jsonResults = fetchResults
      .map(
        (data) =>
          JSON.parse(Buffer.from(data).toString('utf-8')) as SegmentDocument,
      )
      .map((doc) => doc.properties);

    return NextResponse.json({
      result: { events: jsonResults },
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
