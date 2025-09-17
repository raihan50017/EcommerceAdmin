import { AxiosInstance } from "axios";
import { ApiResponseType } from "../api-response-type";

export type ProductVariantType = {
    id?: string;
    productId: string;
    productName: string;
    sizeId: string;
    colorId: string;
    sizeName: string;
    colorName: string;
    sku: string;
    price: number;
    stock: number;
}


export async function GetAllProductVariant(
    axios: AxiosInstance
): Promise<ApiResponseType<ProductVariantType[]>> {
    const response = await axios.get("/Product/variants");

    response.data.Data = response.data.Data ?? response.data;

    return response.data;
}


export async function GetProducteVariantById(axios: AxiosInstance, id: number): Promise<ApiResponseType<ProductVariantType>> {
    const response = await axios.get(`/Product/variants/${id}`);
    response.data.Data = response.data;
    return response.data;
}

export async function GetProductVariantByProductId(
    axios: AxiosInstance,
    productId: string,
    pageNumber?: number,
    pageSize?: number
): Promise<ApiResponseType<ProductVariantType[]>> {
    if (!productId) throw new Error("Product ID is required");

    const params: Record<string, any> = { productId };
    if (pageNumber !== undefined) params.pageNumber = pageNumber;
    if (pageSize !== undefined) params.pageSize = pageSize;

    const response = await axios.get("/Product/variants-by-product", { params });

    response.data.Data = response.data.Data || response.data;
    return response.data;
}


export async function Save(variants: ProductVariantType[], productId: string, axios: AxiosInstance) {

    const data = {
        productId: productId,
        variants: variants

    }

    const response = await axios.post(`/Product/${productId}/variants`, data);

    if (!response || response.status !== 200) {
        throw new Error("This product variant already exists or failed to save.");
    }

    return response.data;
}


export async function Delete(id: string, axios: AxiosInstance) {
    if (id === null || id === undefined) {
        throw new Error("Color not selected.");
    }

    await axios.delete("/Product/" + id);
}

