import { AxiosInstance } from "axios";
import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@/lib/axios-instance";
import { ReactQueryKey } from "@/utility/react-query-key";
import { ApiResponseType } from "../api-response-type";

export type AccountTypeType = {
    Id: number,
    Name: string,
    IsActive: boolean,
    AccountCatagoryId: number,
    AccountCatagoryName: string
};


export async function GetAllAccountType(axios: AxiosInstance): Promise<ApiResponseType<AccountTypeType[]>> {
    const response = await axios.get("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/accounting/AccountType");
    return response.data;
}

export async function GetAccountTypeById(axios: AxiosInstance, id: number): Promise<ApiResponseType<AccountTypeType>> {
    const response = await axios.get(`/169d74c5-deaf-4b49-de77-08dd8f61bf1f/accounting/AccountType/${id}`);
    return response.data;
}

export async function Save(AccountType: AccountTypeType, axios: AxiosInstance) {
    const { Name: NAME } = AccountType;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("Voucher name must be at least 2 character.");
    }

    const response = await axios.post("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/accounting/AccountType", AccountType);

    if (!response) {
        throw new Error("This Account Type already exist.");
    }

    return response.data;
}

export async function Update(AccountType: AccountTypeType, axios: AxiosInstance) {
    const { Name: NAME } = AccountType;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("Voucher name must be at least 2 character.");
    }

    const response = await axios.put(
        "/169d74c5-deaf-4b49-de77-08dd8f61bf1f/accounting/AccountType/" + AccountType.Id,
        AccountType
    );

    if (!response) {
        throw new Error("This AccountType already exist.");
    }

    return response.data;
}

export async function Delete(id: number, axios: AxiosInstance) {
    if (Number(id) <= 0) {
        throw new Error("Account Type not selected.");
    }

    await axios.delete("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/accounting/AccountType/" + id);
}


export function GetAllAccountTypeCaching() {
    const axios = useAxiosInstance();

    const getData = async (): Promise<ApiResponseType<AccountTypeType[]>> =>
        (await axios.get("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/accounting/AccountType")).data;

    const query = useQuery({
        queryKey: [ReactQueryKey.AccountTypesActive],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}