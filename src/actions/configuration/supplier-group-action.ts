import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@/lib/axios-instance";
import { ReactQueryKey } from "@/utility/react-query-key";
import { AxiosInstance } from "axios";
import { ApiResponseType } from "../api-response-type";

export type SupplierGroupType = {
    Id: number;
    Name: string;
    Remarks?: string;
    IsActive: boolean;
};

export async function GetAllsupplierGroup(axios: AxiosInstance) {
    const response = await axios.get(`/169d74c5-deaf-4b49-de77-08dd8f61bf1f/supplierGroup`);
    return response.data;
}

export function GetAllActivesupplierGroup() {
    const axios = useAxiosInstance();

    const getData = async (): Promise<ApiResponseType<SupplierGroupType[]>> =>
        (await axios.get("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/supplierGroup?IsActive=true")).data;

    const query = useQuery({
        queryKey: [ReactQueryKey.SupplierGroup],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}

export async function GetSupplierGroupById(axios: AxiosInstance, id: number): Promise<ApiResponseType<SupplierGroupType>> {
    const response = await axios.get(`/169d74c5-deaf-4b49-de77-08dd8f61bf1f/supplierGroup/${id}`);
    return response.data;
}

export async function Save(supplierGroup: SupplierGroupType, axios: AxiosInstance) {
    const { Name: NAME } = supplierGroup;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("supplierGroup name must be at least 2 character.");
    }

    const response = await axios.post("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/supplierGroup", supplierGroup);

    if (!response) {
        throw new Error("This supplierGroup already exist.");
    }

    return response.data;
}

export async function Update(supplierGroup: SupplierGroupType, axios: AxiosInstance) {
    const { Name: NAME } = supplierGroup;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("supplierGroup name must be at least 2 character.");
    }

    const response = await axios.put(
        "/169d74c5-deaf-4b49-de77-08dd8f61bf1f/supplierGroup/" + supplierGroup.Id,
        supplierGroup
    );

    if (!response) {
        throw new Error("This supplierGroup already exist.");
    }

    return response.data;
}

export async function Delete(id: number, axios: AxiosInstance) {
    if (Number(id) <= 0) {
        throw new Error("supplierGroup not selected.");
    }

    await axios.delete("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/supplierGroup/" + id);
}