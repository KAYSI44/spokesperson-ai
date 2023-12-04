'use client';

import { cn } from '@/lib/utils';
import { SentimentType } from '@aws-sdk/client-comprehend';
import styles from '@/styles/feedback-reactions.module.scss';

export default function Sentiment({
  id,
  sentiment,
}: {
  id: string;
  sentiment: SentimentType;
}) {
  return (
    <div className={styles['feedback']}>
      <label className={styles['angry']}>
        <input
          type="radio"
          value="1"
          name={`feedback-${id}`}
          checked={sentiment === SentimentType.NEGATIVE}
          onChange={(e) => e.preventDefault()}
        />
        <div>
          <svg className={cn(styles['eye'], styles['left'])}>
            <use xlinkHref={`#eye-${id}`} />
          </svg>
          <svg className={cn(styles['eye'], styles['right'])}>
            <use xlinkHref={`#eye-${id}`} />
          </svg>
          <svg className={styles['mouth']}>
            <use xlinkHref={`#mouth-${id}`} />
          </svg>
        </div>
      </label>
      <label className={styles['ok']}>
        <input
          type="radio"
          value="3"
          name={`feedback-${id}`}
          checked={sentiment === SentimentType.NEUTRAL}
          onChange={(e) => e.preventDefault()}
        />
        <div></div>
      </label>
      <label className={styles['good']}>
        <input
          type="radio"
          value="4"
          name={`feedback-${id}`}
          checked={sentiment === SentimentType.MIXED}
          onChange={(e) => e.preventDefault()}
        />
        <div>
          <svg className={cn(styles['eye'], styles['left'])}>
            <use xlinkHref={`#eye-${id}`} />
          </svg>
          <svg className={cn(styles['eye'], styles['right'])}>
            <use xlinkHref={`#eye-${id}`} />
          </svg>
          <svg className={styles['mouth']}>
            <use xlinkHref={`#mouth-${id}`} />
          </svg>
        </div>
      </label>
      <label className={styles['happy']}>
        <input
          type="radio"
          value="5"
          name={`feedback-${id}`}
          checked={sentiment === SentimentType.POSITIVE}
          onChange={(e) => e.preventDefault()}
        />
        <div>
          <svg className={cn(styles['eye'], styles['left'])}>
            <use xlinkHref={`#eye-${id}`} />
          </svg>
          <svg className={cn(styles['eye'], styles['right'])}>
            <use xlinkHref={`#eye-${id}`} />
          </svg>
        </div>
      </label>

      <svg xmlns="http://www.w3.org/2000/svg" className="hidden">
        <symbol
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 7 4"
          id={`eye-${id}`}
        >
          <path d="M1,1 C1.83333333,2.16666667 2.66666667,2.75 3.5,2.75 C4.33333333,2.75 5.16666667,2.16666667 6,1"></path>
        </symbol>
        <symbol
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 18 7"
          id={`mouth-${id}`}
        >
          <path d="M1,5.5 C3.66666667,2.5 6.33333333,1 9,1 C11.6666667,1 14.3333333,2.5 17,5.5"></path>
        </symbol>
      </svg>
    </div>
  );
}
