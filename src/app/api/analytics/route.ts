import { AnalyticsInput, AnalyticsOutput } from '@/lib/dto';
import { NextRequest, NextResponse } from 'next/server';
import { Analytics } from '@segment/analytics-node';
import { v4 as uuidv4 } from 'uuid';

const analytics = new Analytics({
  writeKey: process.env.SEGMENT_WRITE_KEY as string,
});

export async function POST(
  request: NextRequest,
): Promise<NextResponse<AnalyticsOutput>> {
  try {
    const data = await request.json();
    const { event } = data as AnalyticsInput;

    const timestamp = new Date();

    analytics.track({
      userId: uuidv4(),
      event: 'report',
      properties: event,
      timestamp,
    });

    console.log(timestamp);

    return NextResponse.json({});
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
