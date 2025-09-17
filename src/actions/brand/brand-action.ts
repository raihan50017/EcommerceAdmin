import { AxiosInstance } from "axios";
import { ApiResponseType } from "../api-response-type";

export type BrandType = {
    id: string;
    name: string;
};


export async function GetAllBrand(axios: AxiosInstance): Promise<ApiResponseType<BrandType>> {
    const response = await axios.get("/Brand");
    response.data.Data = response.data;
    return response?.data;
}


export async function GetBrandById(axios: AxiosInstance, id: number): Promise<ApiResponseType<BrandType>> {
    const response = await axios.get(`/Brand/${id}`);
    response.data.Data = response.data;
    return response.data;
}

export async function Save(brand: BrandType, axios: AxiosInstance) {
    const { name: name } = brand;

    if (!name) {
        throw new Error("Name is required");
    }
    if (name.length < 2) {
        throw new Error("Name must be at least 2 character.");
    }

    const response = await axios.post("/Brand", brand);

    if (!response) {
        throw new Error("This post already exist.");
    }

    return response.data;
}

export async function Update(category: BrandType, axios: AxiosInstance) {
    const { name: name } = category;

    if (!name) {
        throw new Error("Name is required");
    }
    if (name.length < 2) {
        throw new Error("Name must be at least 2 character.");
    }

    const response = await axios.put(
        "/api/Brand" + category.id,
        category
    );

    if (!response) {
        throw new Error("This brand already exist.");
    }

    return response.data;
}

export async function Delete(id: string, axios: AxiosInstance) {
    if (id === null || id === undefined) {
        throw new Error("Brand not selected.");
    }

    await axios.delete("/Brand/" + id);
}
