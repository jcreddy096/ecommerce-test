'use client';

import { Pagination as MUIPagination } from '@mui/material';

type Props = {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
};

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }: Props) => {
  const pageCount = Math.ceil(totalItems / itemsPerPage);

  return (
    <MUIPagination
      count={pageCount}
      page={currentPage}
      onChange={onPageChange}
      color="primary"
    />
  );
};

export default Pagination;
