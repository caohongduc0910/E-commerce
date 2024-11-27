const PaginationHelper = (index, totalBooks) => {
    const objectPagination: {
      limitItems: number;
      currentPage: number;
      startItem: number;
      totalPages: number;
    } = {
      limitItems: 5,
      currentPage: 1,
      startItem: 0,
      totalPages: 0,
    };
  
    if (index) {
      objectPagination.currentPage = index;
      objectPagination.startItem =
        (objectPagination.currentPage - 1) * objectPagination.limitItems;
    }
  
    objectPagination['totalPages'] = Math.ceil(
      totalBooks / objectPagination.limitItems,
    );
  
    return objectPagination;
  };
  
  export default PaginationHelper