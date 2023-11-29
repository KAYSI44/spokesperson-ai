import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';
import { AccessTokenOutput } from '@/lib/dto';
import { IDENTITY } from '@/lib/constants';

const { LK_API_KEY, LK_API_SECRET } = process.env;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<AccessTokenOutput>> {
  try {
    const { asGuest }: { asGuest?: boolean } = await request.json();

    const at = new AccessToken(LK_API_KEY, LK_API_SECRET, {
      identity: asGuest ? IDENTITY.GUEST : IDENTITY.HOST,
    });

    at.addGrant({ roomJoin: true, room: params.id });

    const token = at.toJwt();

    return NextResponse.json({
      result: {
        token,
      },
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: {
          message: `${e}`,
        },
      },
      {
        status: 500,
      },
    );
  }
}
