import { AnalyticsInput, AnalyticsOutput } from '@/lib/dto';
import { NextRequest, NextResponse } from 'next/server';
import { Analytics } from '@segment/analytics-node';

const analytics = new Analytics({
  writeKey: process.env.SEGMENT_WRITE_KEY as string,
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<AnalyticsOutput>> {
  try {
    const data = await request.json();
    const { event } = data as AnalyticsInput;

    analytics.track({
      userId: params.id, // using meeting id as user id
      event: 'report',
      properties: event,
    });

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
