import { AxiosInstance } from "axios";
import { ApiResponseType, SingleApiResponse } from "../api-response-type";

export type CategoryType = {
    id: string;
    name: string;
};


export async function GetAllCategory(axios: AxiosInstance): Promise<ApiResponseType<CategoryType>> {
    const response = await axios.get("/Category");
    response.data.Data = response.data;
    return response?.data;
}


export async function GetCategoryById(axios: AxiosInstance, id: string): Promise<SingleApiResponse<CategoryType>> {
    const response = await axios.get(`/Category/${id}`);
    return response.data;
}

export async function Save(category: CategoryType, axios: AxiosInstance) {
    const { name: name } = category;

    if (!name) {
        throw new Error("Name is required");
    }
    if (name.length < 2) {
        throw new Error("Name must be at least 2 character.");
    }

    const response = await axios.post("/Category", category);

    if (!response) {
        throw new Error("This post already exist.");
    }

    return response.data;
}

export async function Update(category: CategoryType, axios: AxiosInstance) {
    const { name: name } = category;

    if (!name) {
        throw new Error("Name is required");
    }
    if (name.length < 2) {
        throw new Error("Name must be at least 2 character.");
    }

    const response = await axios.put(
        "/Category/" + category.id,
        category
    );


    if (!response) {
        throw new Error("This category already exist.");
    }

    return response.data;
}

export async function Delete(id: string, axios: AxiosInstance) {
    if (id === null || id === undefined) {
        throw new Error("Category not selected.");
    }

    await axios.delete("/Category/" + id);
}
