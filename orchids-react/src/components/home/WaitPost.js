import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export default function WaitPost() {
  return (
    <Stack spacing={1}>
      {/* For variant="text", adjust the height via font-size */}
      <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
      {/* For other variants, adjust the size with `width` and `height` */}
      <Skeleton variant="circular" width={30} height={30} />
      <Skeleton variant="rectangular" width={600} height={140} />
      {/* <Skeleton variant="rounded" width={400} height={60} /> */}
    </Stack>
  );
}