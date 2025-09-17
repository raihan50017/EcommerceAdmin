import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@/lib/axios-instance";
import { AxiosInstance } from "axios";
import { ReactQueryKey } from "@/utility/react-query-key";
import { ApiResponseType } from "../api-response-type";

export type SupplierType = {
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

export async function GetAllSupplier(axios: AxiosInstance) {
    const response = await axios.get(`/169d74c5-deaf-4b49-de77-08dd8f61bf1f/Supplier`);
    return response.data;
}

export function GetAllActiveSupplier() {
    const axios = useAxiosInstance();

    const getData = async (): Promise<ApiResponseType<SupplierType[]>> =>
        (await axios.get("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/Supplier?IsActive=true")).data;

    const query = useQuery({
        queryKey: [ReactQueryKey.SuppliersActive],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}

export async function GetTransactionById(axios: AxiosInstance, id: number): Promise<ApiResponseType<SupplierType>> {
    const response = await axios.get(`/169d74c5-deaf-4b49-de77-08dd8f61bf1f/Supplier/${id}`);
    return response.data;
}

// export async function Save(Supplier: Supplier, axios: AxiosInstance) {
//     const { Name: NAME } = Supplier;

//     if (!NAME) {
//         throw new Error("Name is required");
//     }
//     if (NAME.length < 2) {
//         throw new Error("Supplier name must be at least 2 character.");
//     }

//     const response = await axios.post("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/Supplier", Supplier);

//     if (!response) {
//         throw new Error("This Supplier already exist.");
//     }

//     return response.data;
// }

// export async function Update(Supplier: Supplier, axios: AxiosInstance) {
//     const { Name: NAME } = Supplier;

//     if (!NAME) {
//         throw new Error("Name is required");
//     }
//     if (NAME.length < 2) {
//         throw new Error("Supplier name must be at least 2 character.");
//     }

//     const response = await axios.put(
//         "/169d74c5-deaf-4b49-de77-08dd8f61bf1f/Supplier/" + Supplier.Id,
//         Supplier
//     );

//     if (!response) {
//         throw new Error("This Supplier already exist.");
//     }

//     return response.data;
// }

// export async function Delete(id: number, axios: AxiosInstance) {
//     if (Number(id) <= 0) {
//         throw new Error("Supplier not selected.");
//     }

//     await axios.delete("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/Supplier/" + id);
// }