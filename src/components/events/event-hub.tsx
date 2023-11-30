'use client';

import { BellIcon } from 'lucide-react';
import { useTransition, animated } from '@react-spring/web';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

interface MessageHubProps {
  config?: {
    tension: number;
    friction: number;
    precision: number;
  };
  timeout?: number;
  children: (add: AddFunction) => void;
  className?: string;
}

export type AddFunction = (msg: string) => void;

interface Item {
  key: number;
  msg: string;
}

let id = 0;

export default function EventHub({
  config = { tension: 125, friction: 20, precision: 0.1 },
  timeout = 3000,
  children,
  className,
}: MessageHubProps) {
  const refMap = useMemo(() => new WeakMap(), []);
  const cancelMap = useMemo(() => new WeakMap(), []);
  const [items, setItems] = useState<Item[]>([]);

  const transitions = useTransition(items, {
    from: { opacity: 0, height: 0, life: '100%' },
    keys: (item) => item.key,
    enter: (item) => async (next, cancel) => {
      cancelMap.set(item, cancel);
      await next({ opacity: 1, height: refMap.get(item).offsetHeight });
      await next({ life: '0%' });
    },
    leave: [{ opacity: 0 }, { height: 0 }],
    onRest: (result, ctrl, item) => {
      setItems((state) =>
        state.filter((i) => {
          return i.key !== item.key;
        }),
      );
    },
    config: (item, index, phase) => (key) =>
      phase === 'enter' && key === 'life' ? { duration: timeout } : config,
  });

  useEffect(() => {
    children((msg: string) => {
      setItems((state) => [...state, { key: id++, msg }]);
    });
  }, []);

  return (
    <div
      className={cn(
        className,
        'w-full auto flex flex-col-reverse h-full pointer-events-none items-end',
      )}
    >
      {transitions(({ life, ...style }, item) => (
        <animated.div
          style={style}
          className="relative overflow-hidden w-[40ch]"
        >
          <div
            ref={(ref: HTMLDivElement) => ref && refMap.set(item, ref)}
            className="bg-muted/20 border border-muted-foreground/20 px-6 py-4 text-md overflow-hidden h-auto rounded-sm mt-2"
          >
            <div className="flex items-center mb-2 gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 p-2">
                <BellIcon className="w-full h-full stroke-green-600" />
              </div>
              <h4 className="text-sm font-bold text-green-600">
                Sent to Segment
              </h4>
            </div>
            <p>{item.msg}</p>
          </div>
        </animated.div>
      ))}
    </div>
  );
}
