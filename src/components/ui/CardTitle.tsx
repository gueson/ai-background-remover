'use client';

import clsx from 'clsx';
import { Fragment } from 'react';

export default function CardTitle(props: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Fragment>
      <h3 className={clsx('text-2xl font-semibold text-gray-900', props.className)}>
        {props.children}
      </h3>
    </Fragment>
  );
}
