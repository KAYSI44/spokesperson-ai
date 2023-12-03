'use client';

import { sample } from 'lodash';
import { useState, useEffect, useRef, useContext } from 'react';
import { cn } from '@/lib/utils';
import styles from '@/styles/feedback-reactions.module.scss';
import useReviewData from '@/hooks/use-review-data';
import useMeetingID from '@/hooks/use-meeting-id';
import { ReviewContext } from '@/context/review-context';

enum Reaction {
  ANGRY = 'angry',
  SAD = 'sad',
  OK = 'ok',
  GOOD = 'good',
  HAPPY = 'happy',
}

interface FeedbackReactionsProps {
  className?: string;
}

export default function FeedbackReactions({
  className,
}: FeedbackReactionsProps) {
  // const cycleIntervalRef = useRef<NodeJS.Timeout>();

  const { currentTimestamp } = useContext(ReviewContext);
  const [currentReaction, setReaction] = useState<Reaction>();

  const { meetingID } = useMeetingID();
  const { events } = useReviewData(meetingID);

  useEffect(() => {
    if (!events || !events.length) return;

    const currentEvent = events.find(
      (event) => event?.timestamp === currentTimestamp,
    );

    if (!currentEvent) return;

    const sentiment = currentEvent.sentiment?.sentiment;
    if (!sentiment) return;

    switch (sentiment) {
      case 'POSITIVE':
        setReaction(Reaction.HAPPY);
        break;
      case 'MIXED':
        setReaction(Reaction.OK);
        break;
      case 'NEUTRAL':
        setReaction(Reaction.OK);
        break;
      case 'NEGATIVE':
        setReaction(Reaction.ANGRY);
        break;
    }
  }, [events, currentTimestamp]);

  // useEffect(() => {
  //   if (cycleIntervalRef.current !== undefined) {
  //     clearInterval(cycleIntervalRef.current);
  //     cycleIntervalRef.current = undefined;
  //   }

  //   cycleIntervalRef.current = setInterval(() => {
  //     const reactions = [
  //       Reaction.ANGRY,
  //       Reaction.SAD,
  //       Reaction.OK,
  //       Reaction.GOOD,
  //       Reaction.HAPPY,
  //     ];
  //     setReaction(sample(reactions) as Reaction);
  //   }, 2000);

  //   return () => {
  //     clearInterval(cycleIntervalRef.current);
  //   };
  // }, []);

  return (
    <div className={cn('p-6 rounded-lg bg-muted/50', className)}>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-bold text-lg text-muted-foreground/80">
          Sentiment
        </h3>
        {events && events.length && (
          <p className="font-bold text-sm">
            {events[0].sentiment?.sentiment ?? 'NIL'}
          </p>
        )}
      </div>

      <div className={styles['feedback']}>
        <label className={styles['angry']}>
          <input
            type="radio"
            value="1"
            name={'feedback'}
            checked={currentReaction === Reaction.ANGRY}
            onChange={(e) => e.target.checked && setReaction(Reaction.ANGRY)}
          />
          <div>
            <svg className={cn(styles['eye'], styles['left'])}>
              <use xlinkHref="#eye" />
            </svg>
            <svg className={cn(styles['eye'], styles['right'])}>
              <use xlinkHref="#eye" />
            </svg>
            <svg className={styles['mouth']}>
              <use xlinkHref="#mouth" />
            </svg>
          </div>
        </label>
        <label className={styles['sad']}>
          <input
            type="radio"
            value="2"
            name={'feedback'}
            checked={currentReaction === Reaction.SAD}
            onChange={(e) => e.target.checked && setReaction(Reaction.SAD)}
          />
          <div>
            <svg className={cn(styles['eye'], styles['left'])}>
              <use xlinkHref="#eye" />
            </svg>
            <svg className={cn(styles['eye'], styles['right'])}>
              <use xlinkHref="#eye" />
            </svg>
            <svg className={styles['mouth']}>
              <use xlinkHref="#mouth" />
            </svg>
          </div>
        </label>
        <label className={styles['ok']}>
          <input
            type="radio"
            value="3"
            name={'feedback'}
            checked={currentReaction === Reaction.OK}
            onChange={(e) => e.target.checked && setReaction(Reaction.OK)}
          />
          <div></div>
        </label>
        <label className={styles['good']}>
          <input
            type="radio"
            value="4"
            name={'feedback'}
            checked={currentReaction === Reaction.GOOD}
            onChange={(e) => e.target.checked && setReaction(Reaction.GOOD)}
          />
          <div>
            <svg className={cn(styles['eye'], styles['left'])}>
              <use xlinkHref="#eye" />
            </svg>
            <svg className={cn(styles['eye'], styles['right'])}>
              <use xlinkHref="#eye" />
            </svg>
            <svg className={styles['mouth']}>
              <use xlinkHref="#mouth" />
            </svg>
          </div>
        </label>
        <label className={styles['happy']}>
          <input
            type="radio"
            value="5"
            name={'feedback'}
            checked={currentReaction === Reaction.HAPPY}
            onChange={(e) => e.target.checked && setReaction(Reaction.HAPPY)}
          />
          <div>
            <svg className={cn(styles['eye'], styles['left'])}>
              <use xlinkHref="#eye" />
            </svg>
            <svg className={cn(styles['eye'], styles['right'])}>
              <use xlinkHref="#eye" />
            </svg>
          </div>
        </label>
      </div>

      <svg xmlns="http://www.w3.org/2000/svg" className="hidden">
        <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7 4" id="eye">
          <path d="M1,1 C1.83333333,2.16666667 2.66666667,2.75 3.5,2.75 C4.33333333,2.75 5.16666667,2.16666667 6,1"></path>
        </symbol>
        <symbol
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 18 7"
          id="mouth"
        >
          <path d="M1,5.5 C3.66666667,2.5 6.33333333,1 9,1 C11.6666667,1 14.3333333,2.5 17,5.5"></path>
        </symbol>
      </svg>
    </div>
  );
}
