import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@/lib/axios-instance";
import { AxiosInstance } from "axios";
import { ReactQueryKey } from "@/utility/react-query-key";
import { ApiResponseType } from "../api-response-type";

export type ChartOfAccount = {
    Id: number;
    Name: string;
    Contactperson: string;
    Mobile: string;
    Phone: string;
    Address: string;
    Email: string;
    Web: string;
    ChequeBook: string;
    BankAccountNo: string;
    Isactive: boolean;
};

export async function GetAllChartOfAccount(axios: AxiosInstance) {
    const response = await axios.get(`/169d74c5-deaf-4b49-de77-08dd8f61bf1f/accounting/ChartOfAccount`);
    return response.data;
}

export function GetAllActiveChartOfAccount() {
    const axios = useAxiosInstance();

    const getData = async (): Promise<ApiResponseType<ChartOfAccount[]>> =>
        (await axios.get("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/accounting/ChartOfAccount?IsActive=true")).data;

    const query = useQuery({
        queryKey: [ReactQueryKey.ChartOfAccountsActive],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}

export async function GetTransactionById(axios: AxiosInstance, id: number): Promise<ApiResponseType<ChartOfAccount>> {
    const response = await axios.get(`/169d74c5-deaf-4b49-de77-08dd8f61bf1f/accounting/ChartOfAccount/${id}`);
    return response.data;
}

// export async function Save(ChartOfAccount: ChartOfAccount, axios: AxiosInstance) {
//     const { Name: NAME } = ChartOfAccount;

//     if (!NAME) {
//         throw new Error("Name is required");
//     }
//     if (NAME.length < 2) {
//         throw new Error("ChartOfAccount name must be at least 2 character.");
//     }

//     const response = await axios.post("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/ChartOfAccount", ChartOfAccount);

//     if (!response) {
//         throw new Error("This ChartOfAccount already exist.");
//     }

//     return response.data;
// }

// export async function Update(ChartOfAccount: ChartOfAccount, axios: AxiosInstance) {
//     const { Name: NAME } = ChartOfAccount;

//     if (!NAME) {
//         throw new Error("Name is required");
//     }
//     if (NAME.length < 2) {
//         throw new Error("ChartOfAccount name must be at least 2 character.");
//     }

//     const response = await axios.put(
//         "/169d74c5-deaf-4b49-de77-08dd8f61bf1f/ChartOfAccount/" + ChartOfAccount.Id,
//         ChartOfAccount
//     );

//     if (!response) {
//         throw new Error("This ChartOfAccount already exist.");
//     }

//     return response.data;
// }

// export async function Delete(id: number, axios: AxiosInstance) {
//     if (Number(id) <= 0) {
//         throw new Error("ChartOfAccount not selected.");
//     }

//     await axios.delete("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/ChartOfAccount/" + id);
// }