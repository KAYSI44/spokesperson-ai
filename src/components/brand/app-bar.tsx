import Image from 'next/image';
import Link from 'next/link';
import SpokespersonLogo from '@/media/spokesperson.png';
import SegmentLogo from '@/media/segment.png';
import S3Logo from '@/media/s3.png';

export default function AppBar() {
  return (
    <div className="max-w-4xl mx-auto mt-6 flex items-center gap-2">
      <Link href="/">
        <Image
          src={SpokespersonLogo.src}
          width={SpokespersonLogo.width}
          height={SpokespersonLogo.height}
          alt="Spokesperson"
          className="w-8 h-8"
        />
      </Link>

      <div>
        <p className="font-bold text-sm">Spokesperson AI</p>
        <p className="text-xs font-semibold">
          Powered by{' '}
          <a
            className="hover:underline"
            href="https://segment.com/"
            target="_blank"
          >
            Segment{' '}
            <Image
              className="w-4 h-4 inline"
              src={SegmentLogo.src}
              width={SegmentLogo.width}
              height={SegmentLogo.height}
              alt="Segment"
            />{' '}
          </a>
          and{' '}
          <a
            className="hover:underline"
            href="https://aws.amazon.com/s3/"
            target="_blank"
          >
            S3{' '}
            <Image
              className="w-4 h-4 inline"
              src={S3Logo.src}
              width={S3Logo.width}
              height={S3Logo.height}
              alt="S3"
            />
          </a>
        </p>
      </div>
    </div>
  );
}
