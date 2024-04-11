import express from "express"



// Define interfaces for the structure of pagination query parameters and results
interface PaginationQuery { 
    page?: string;
    limit?: string;
}

interface PaginationResult<T> {
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
    };
}


/**
 * Middleware for paginating database queries.
 * @param {express.Request} req - The request object containing query parameters.
 * @param {any} model - The database model to query.
 * @param {any} query - The query conditions.
 * @returns {Promise<PaginationResult<T>>} - The paginated result set and pagination details.
 */
const paginationMiddleware = async <T>(
    req: express.Request,
    model: any,
    query: any
): Promise<PaginationResult<T>> => {

    // Default to the first page with 10 items per page if not specified
    const { page = '1', limit = '10' } = req.query as PaginationQuery;
    const currentPage = parseInt(page, 10);
    const itemsPerPage = parseInt(limit, 10);

    // Calculate the starting and ending index for the query
    const startIndex = (currentPage -1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Count the total number of documents that match the query and calculate the total number of pages
    const totalItems = await model.countDocuments(query);
    const totalPages = Math.ceil(totalItems / itemsPerPage);


    // Retrieve the subset of documents for the current page
    const data = await model
        .find(query)
        .skip(startIndex)
        .limit(itemsPerPage)
        .lean();

    return {
        data,
        pagination: {
            currentPage,
            totalPages,
            totalItems,
        },
    };
};

export default paginationMiddleware;