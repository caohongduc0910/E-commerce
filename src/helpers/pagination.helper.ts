const PaginationHelper = (index, total) => {
    const objectPagination: {
      limitItems: number;
      currentPage: number;
      skip: number;
      totalPages: number;
    } = {
      limitItems: 5,
      currentPage: 1,
      skip: 0,
      totalPages: 0,
    };
  
    if (index) {
      objectPagination.currentPage = index;
      objectPagination.skip =
        (objectPagination.currentPage - 1) * objectPagination.limitItems;
    }
  
    objectPagination['totalPages'] = Math.ceil(
      total / objectPagination.limitItems,
    );
  
    return objectPagination;
  };
  
  export default PaginationHelper