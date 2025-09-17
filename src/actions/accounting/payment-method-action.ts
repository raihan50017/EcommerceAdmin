import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@/lib/axios-instance";
import { AxiosInstance } from "axios";
import { ReactQueryKey } from "@/utility/react-query-key";
import { ApiResponseType } from "../api-response-type";

export type PaymentMethod = {
    Id: number;
    Name: string;
    Days: number;
    IsActive: boolean;
};

export async function GetAllPaymentMethod(axios: AxiosInstance) {
    const response = await axios.get(`/169d74c5-deaf-4b49-de77-08dd8f61bf1f/PaymentMethod`);
    return response.data;
}

export function GetAllActivePaymentMethod() {
    const axios = useAxiosInstance();

    const getData = async (): Promise<ApiResponseType<PaymentMethod[]>> =>
        (await axios.get("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/PaymentMethod?IsActive=true")).data;

    const query = useQuery({
        queryKey: [ReactQueryKey.PaymentMethodsActive],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}

export async function GetTransactionById(axios: AxiosInstance, id: number): Promise<ApiResponseType<PaymentMethod>> {
    const response = await axios.get(`/169d74c5-deaf-4b49-de77-08dd8f61bf1f/PaymentMethod/${id}`);
    return response.data;
}

// export async function Save(PaymentMethod: PaymentMethod, axios: AxiosInstance) {
//     const { Name: NAME } = PaymentMethod;

//     if (!NAME) {
//         throw new Error("Name is required");
//     }
//     if (NAME.length < 2) {
//         throw new Error("PaymentMethod name must be at least 2 character.");
//     }

//     const response = await axios.post("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/PaymentMethod", PaymentMethod);

//     if (!response) {
//         throw new Error("This PaymentMethod already exist.");
//     }

//     return response.data;
// }

// export async function Update(PaymentMethod: PaymentMethod, axios: AxiosInstance) {
//     const { Name: NAME } = PaymentMethod;

//     if (!NAME) {
//         throw new Error("Name is required");
//     }
//     if (NAME.length < 2) {
//         throw new Error("PaymentMethod name must be at least 2 character.");
//     }

//     const response = await axios.put(
//         "/169d74c5-deaf-4b49-de77-08dd8f61bf1f/PaymentMethod/" + PaymentMethod.Id,
//         PaymentMethod
//     );

//     if (!response) {
//         throw new Error("This PaymentMethod already exist.");
//     }

//     return response.data;
// }

// export async function Delete(id: number, axios: AxiosInstance) {
//     if (Number(id) <= 0) {
//         throw new Error("PaymentMethod not selected.");
//     }

//     await axios.delete("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/PaymentMethod/" + id);
// }