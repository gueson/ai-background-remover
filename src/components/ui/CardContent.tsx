'use client';

import clsx from 'clsx';
import { Fragment } from 'react';

export default function CardContent(props: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Fragment>
      <div className={clsx('p-4', props.className)}>
        {props.children}
      </div>
    </Fragment>
  );
}