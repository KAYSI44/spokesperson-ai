'use client'

import { useTransition, animated } from '@react-spring/web';
import { useEffect, useMemo, useState } from 'react';

interface MessageHubProps {
  config?: {
    tension: number;
    friction: number;
    precision: number;
  };
  timeout?: number;
  children: (add: AddFunction) => void;
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
    <div className="fixed z-10 w-auto bottom-10 mx-auto left-10 right-10 flex flex-col pointer-events-none items-end">
      {transitions(({ life, ...style }, item) => (
        <animated.div
          style={style}
          className="relative overflow-hidden w-[40ch]"
        >
          <div
            ref={(ref: HTMLDivElement) => ref && refMap.set(item, ref)}
            className="text-white bg-[#445159] opacity-90 px-6 py-4 text-md grid grid-cols-[1fr_auto] gap-2 overflow-hidden h-auto rounded-sm mt-2"
          >
            <animated.div
              style={{ right: life }}
              className="absolute bottom-0 left-0 w-auto bg-gradient-to-br from-[#00b4e6] to-[#00f0e0] h-[5px]"
            />
            <p>{item.msg}</p>
          </div>
        </animated.div>
      ))}
    </div>
  );
}
