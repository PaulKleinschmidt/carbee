import cx from 'classnames';

type Props = {
  onPaginationClick(page: number): void;
  currentPage: number;
  hasNextPage: boolean;
};

export const PaginationControls = ({
  onPaginationClick,
  currentPage,
  hasNextPage,
}: Props) => {
  const buttonClass =
    'mx-1 bg-brand-secondary-400 text-background-color-body rounded-sm shadow-lg p-1 transition-all';
  const disabledClass =
    'bg-gray-300 text-background-color-body cursor-not-allowed';

  return (
    <div className="text-center">
      <button
        onClick={() => {
          onPaginationClick(currentPage - 1);
        }}
        disabled={currentPage === 0}
        className={cx(buttonClass, currentPage === 0 && disabledClass)}
      >
        Prev
      </button>
      Page: {currentPage + 1}
      <button
        className={cx(buttonClass, !hasNextPage && disabledClass)}
        disabled={!hasNextPage}
        onClick={() => {
          onPaginationClick(currentPage + 1);
        }}
      >
        Next
      </button>
    </div>
  );
};
