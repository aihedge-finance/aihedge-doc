import React from 'react';
import Paginator from '@theme-original/DocItem/Paginator';
import DocFeedback from '@site/src/components/DocFeedback';

type Props = React.ComponentProps<typeof Paginator>;

export default function PaginatorWrapper(props: Props): React.JSX.Element {
  return (
    <>
      <DocFeedback />
      <Paginator {...props} />
    </>
  );
}
