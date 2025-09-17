export type ApiResponseType<T> = {
    succeeded: boolean;
    message: string | null;
    data: {
        items: T[];
        totalCount: number;
        pageNumber: number;
        pageSize: number;
        totalPages: number;
    } | null;
    errors: string[] | null;
};

export type SingleApiResponse<T> = {
    succeeded: boolean;
    message: string | null;
    data: T | null;
    errors: string[] | null;
};