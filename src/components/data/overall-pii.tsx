'use client';

import AddressIcon from '@/media/address.svg';
import AgeIcon from '@/media/age.svg';
import BankIcon from '@/media/bank.svg';
import CCardIcon from '@/media/ccard.svg';
import NumberIcon from '@/media/number.svg';
import OtherIcon from '@/media/other.svg';
import PersonIcon from '@/media/person.svg';
import Image from 'next/image';
import { useMemo } from 'react';
import useMeetingID from '@/hooks/use-meeting-id';
import useReviewData from '@/hooks/use-review-data';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { PiiEntityType } from '@aws-sdk/client-comprehend';
import { isDefined, mergePiiEntitiesByType } from '@/lib/typing';

const {
  ADDRESS,
  EMAIL,
  MAC_ADDRESS,
  AGE,
  DATE_TIME,
  BANK_ACCOUNT_NUMBER,
  BANK_ROUTING,
  INTERNATIONAL_BANK_ACCOUNT_NUMBER,
  IN_PERMANENT_ACCOUNT_NUMBER,
  SWIFT_CODE,
  CREDIT_DEBIT_CVV,
  CREDIT_DEBIT_EXPIRY,
  CREDIT_DEBIT_NUMBER,
  PHONE,
  NAME,
  PASSPORT_NUMBER,
  PASSWORD,
  URL,
  DRIVER_ID,
} = PiiEntityType;

export default function PiiList() {
  const { meetingID } = useMeetingID();
  const { events } = useReviewData(meetingID);

  const pii = useMemo(() => {
    const piiList = events
      ?.map((event) => event?.pii)
      .filter(isDefined)
      .flat();

    if (!piiList) return undefined;

    const mergedEntities = mergePiiEntitiesByType(piiList);

    return mergedEntities.map((info) => {
      let icon: {
        src: string;
        width: number;
        height: number;
      };

      if (([ADDRESS, EMAIL, MAC_ADDRESS] as string[]).includes(info.type)) {
        icon = AddressIcon;
      } else if (([AGE, DATE_TIME] as string[]).includes(info.type)) {
        icon = AgeIcon;
      } else if (
        (
          [
            BANK_ACCOUNT_NUMBER,
            BANK_ROUTING,
            INTERNATIONAL_BANK_ACCOUNT_NUMBER,
            IN_PERMANENT_ACCOUNT_NUMBER,
            SWIFT_CODE,
          ] as string[]
        ).includes(info.type)
      ) {
        icon = BankIcon;
      } else if (
        (
          [
            CREDIT_DEBIT_CVV,
            CREDIT_DEBIT_EXPIRY,
            CREDIT_DEBIT_NUMBER,
          ] as string[]
        ).includes(info.type)
      ) {
        icon = CCardIcon;
      } else if (([PHONE] as string[]).includes(info.type)) {
        icon = NumberIcon;
      } else if (
        (
          [NAME, PASSPORT_NUMBER, PASSWORD, URL, DRIVER_ID] as string[]
        ).includes(info.type)
      ) {
        icon = PersonIcon;
      } else {
        icon = OtherIcon;
      }

      return { ...info, icon };
    });
  }, [events]);

  return (
    <div className="w-full aspect-video bg-muted/50 p-6 rounded-xl flex flex-col">
      <div className="mb-4 flex justify-between items-center shrink-0 grow-0">
        <h3 className="font-bold text-lg text-muted-foreground/80">
          Personal Identifying Information
        </h3>
      </div>

      {pii ? (
        <ScrollArea className="w-full">
          <div className="flex w-max space-x-4 p-4">
            {pii?.map((info) => (
              <div
                key={info.type}
                className="p-4 bg-muted/80 w-fit rounded-sm flex gap-4"
              >
                <Image
                  alt={info.type}
                  src={info.icon.src}
                  width={info.icon.width}
                  height={info.icon.height}
                  className="w-16 h-16"
                />
                <div className="">
                  <h4 className="font-semibold">{info.type}</h4>
                  <p className="">{info.value}</p>
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ) : (
        <p>NIL</p>
      )}
    </div>
  );
}
