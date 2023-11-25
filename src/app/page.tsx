import MagicButton from '@/components/interact/magic-button';
import StreamPlayer from '@/components/stream/stream-player';

export default function Home() {
  return (
    <main>
      <div className="max-w-4xl lg:mx-auto mx-2 grid grid-cols-2 grid-rows-1 gap-2 min-h-[80vh]">
        <StreamPlayer className="col-start-1 col-end-2 row-span-1" />
        <StreamPlayer className="col-start-2 col-end-3 row-span-1" />
      </div>
      <div className="my-12 grid place-items-center">
        <MagicButton dotsAmount={10}>Start Interview</MagicButton>
      </div>
    </main>
  );
}
