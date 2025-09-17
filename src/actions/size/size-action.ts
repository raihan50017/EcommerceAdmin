import { AxiosInstance } from "axios";
import { ApiResponseType } from "../api-response-type";

export type SizeType = {
    id: string;
    name: string;
};


export async function GetAllSize(axios: AxiosInstance): Promise<ApiResponseType<SizeType>> {
    const response = await axios.get("/Size");
    response.data.Data = response.data;
    return response?.data;
}


export async function GetSizeById(axios: AxiosInstance, id: number): Promise<ApiResponseType<SizeType>> {
    const response = await axios.get(`/Size/${id}`);
    response.data.Data = response.data;
    return response.data;
}

export async function Save(size: SizeType, axios: AxiosInstance) {
    const { name: name } = size;

    if (!name) {
        throw new Error("Name is required");
    }
    if (name.length < 2) {
        throw new Error("Name must be at least 2 character.");
    }

    const response = await axios.post("/Size", size);

    if (!response) {
        throw new Error("This post already exist.");
    }

    return response.data;
}

export async function Update(size: SizeType, axios: AxiosInstance) {
    const { name: name } = size;

    if (!name) {
        throw new Error("Name is required");
    }
    if (name.length < 2) {
        throw new Error("Name must be at least 2 character.");
    }

    const response = await axios.put(
        "/api/Size" + size.id,
        size
    );

    if (!response) {
        throw new Error("This size already exist.");
    }

    return response.data;
}

export async function Delete(id: string, axios: AxiosInstance) {
    if (id === null || id === undefined) {
        throw new Error("Size not selected.");
    }

    await axios.delete("/Size/" + id);
}
