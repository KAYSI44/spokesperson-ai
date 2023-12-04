import { AnalyticsOutput } from '@/lib/dto';
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
    analytics.track({
      userId: params.id, // using meeting id as user id
      event: 'joined-meeting',
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
