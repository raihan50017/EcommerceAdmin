import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@/lib/axios-instance";
import { AxiosInstance } from "axios";
import { ReactQueryKey } from "@/utility/react-query-key";
import { ApiResponseType } from "../api-response-type";

export type TransactionType = {
    Id: number;
    Name: string;
    Description?: string | undefined;
    IsActive: boolean;
    TransactionTypeDetails: TransactionTypeDetailsType[];
};

export type TransactionTypeDetailsType = {
    Id: number;
    TransactionTypeId: number;
    TransactionTypeName?: string | null | undefined;
    AccountId: number;
    AccountName: string;
    IsDebitAccount: boolean;
};

export async function GetAllTransactionType(axios: AxiosInstance) {
    const response = await axios.get(`/169d74c5-deaf-4b49-de77-08dd8f61bf1f/accounting/TransactionType`);
    return response.data;
}

export function GetAllActiveTransactionType() {
    const axios = useAxiosInstance();

    const getData = async (): Promise<ApiResponseType<TransactionType[]>> =>
        (await axios.get("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/accounting/TransactionType?IsActive=true")).data;

    const query = useQuery({
        queryKey: [ReactQueryKey.TransactionTypesActive],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}

export async function GetTransactionById(axios: AxiosInstance, id: number): Promise<ApiResponseType<TransactionType>> {
    const response = await axios.get(`/169d74c5-deaf-4b49-de77-08dd8f61bf1f/accounting/TransactionType/${id}`);
    return response.data;
}

export async function Save(TransactionType: TransactionType, axios: AxiosInstance) {
    const { Name: NAME } = TransactionType;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("TransactionType name must be at least 2 character.");
    }

    const response = await axios.post("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/accounting/TransactionType", TransactionType);

    if (!response) {
        throw new Error("This TransactionType already exist.");
    }

    return response.data;
}

export async function Update(TransactionType: TransactionType, axios: AxiosInstance) {
    const { Name: NAME } = TransactionType;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("TransactionType name must be at least 2 character.");
    }

    const response = await axios.put(
        "/169d74c5-deaf-4b49-de77-08dd8f61bf1f/accounting/TransactionType/" + TransactionType.Id,
        TransactionType
    );

    if (!response) {
        throw new Error("This TransactionType already exist.");
    }

    return response.data;
}

export async function Delete(id: number, axios: AxiosInstance) {
    if (Number(id) <= 0) {
        throw new Error("TransactionType not selected.");
    }

    await axios.delete("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/accounting/TransactionType/" + id);
}