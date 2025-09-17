import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@/lib/axios-instance";
import { ReactQueryKey } from "@/utility/react-query-key";

export type CompanyType = {
    Id: string;
    Name: string;
    ShortName: string;
    Address: string;
    Image: string;
};

export function GetAllCompany() {
    const axios = useAxiosInstance();

    const getData = async (): Promise<CompanyType[]> =>
        (await axios.get("/Company")).data;

    const query = useQuery({
        queryKey: [ReactQueryKey.Company],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}
