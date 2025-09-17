import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@/lib/axios-instance";
import { ReactQueryKey } from "@/utility/react-query-key";
import { ApiResponseType } from "../api-response-type";

export type AccountCategoryType = {
    Id: number;
    Name: string;
};


export function GetAllAccountCategory() {
    const axios = useAxiosInstance();

    const getData = async (): Promise<ApiResponseType<AccountCategoryType[]>> =>
        (await axios.get("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/accounting/AccountCatagory")).data;

    const query = useQuery({
        queryKey: [ReactQueryKey.AccountCategoriesActive],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}