'use client';

import clsx from 'clsx';
import { Fragment } from 'react';

export default function CardHeader(props: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Fragment>
      <div className={clsx('flex flex-col space-y-1.5 p-4', props.className)}>
        {props.children}
      </div>
    </Fragment>
  );
}