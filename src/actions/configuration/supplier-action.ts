import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@/lib/axios-instance";
import { ReactQueryKey } from "@/utility/react-query-key";
import { AxiosInstance } from "axios";
import { ApiResponseType } from "../api-response-type";

export type Supplier = {
    Id: number;
    Name: string;
    Contactperson?: string;
    Mobile?: string;
    Phone?: string;
    Address?: string;
    Email?: string;
    Web?: string;
    ChequeBook?: string;
    BankAccountNo?: string;
    Isactive: boolean;
    lstSupplierToGroupMap?: SupplierToGroupMap[];
};
export type SupplierToGroupMap = {
    Id: number;
    SupplierId: number;
    SupplierName?: string;
    SupplierGroupId: number;
    SupplierGroupName?: string;
};

export async function GetAllsupplier(axios: AxiosInstance) {
    const response = await axios.get(`/169d74c5-deaf-4b49-de77-08dd8f61bf1f/supplier`);
    return response.data;
}

export function GetAllActivesupplier() {
    const axios = useAxiosInstance();

    const getData = async (): Promise<ApiResponseType<Supplier[]>> =>
        (await axios.get("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/supplier?IsActive=true")).data;

    const query = useQuery({
        queryKey: [ReactQueryKey.Supplier],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}

export async function GetSupplierById(axios: AxiosInstance, id: number): Promise<ApiResponseType<Supplier>> {
    const response = await axios.get(`/169d74c5-deaf-4b49-de77-08dd8f61bf1f/supplier/${id}`);
    return response.data;
}

export async function Save(supplier: Supplier, axios: AxiosInstance) {
    const { Name: NAME } = supplier;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("supplier name must be at least 2 character.");
    }

    const response = await axios.post("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/supplier", supplier);

    if (!response) {
        throw new Error("This supplier already exist.");
    }

    return response.data;
}

export async function Update(supplier: Supplier, axios: AxiosInstance) {
    const { Name: NAME } = supplier;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("supplier name must be at least 2 character.");
    }

    const response = await axios.put(
        "/169d74c5-deaf-4b49-de77-08dd8f61bf1f/supplier/" + supplier.Id,
        supplier
    );

    if (!response) {
        throw new Error("This supplier already exist.");
    }

    return response.data;
}

export async function Delete(id: number, axios: AxiosInstance) {
    if (Number(id) <= 0) {
        throw new Error("Supplier not selected.");
    }

    await axios.delete("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/supplier/" + id);
}