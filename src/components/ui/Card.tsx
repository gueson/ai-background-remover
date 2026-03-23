'use client';

import clsx from 'clsx';
import { Fragment } from 'react';

export default function Card(props: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Fragment>
      <div
        className={clsx(
          'border border-gray-200 bg-white rounded-lg shadow-sm p-4',
          props.className
        )}
      >
        {props.children}
      </div>
    </Fragment>
  );
}