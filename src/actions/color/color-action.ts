import { AxiosInstance } from "axios";
import { ApiResponseType } from "../api-response-type";

export type ColorType = {
    id: string;
    name: string;
    code: string;
};


export async function GetAllColor(axios: AxiosInstance): Promise<ApiResponseType<ColorType>> {
    const response = await axios.get("/Color");
    response.data.Data = response.data;
    return response?.data;
}


export async function GetColorById(axios: AxiosInstance, id: number): Promise<ApiResponseType<ColorType>> {
    const response = await axios.get(`/Color/${id}`);
    response.data.Data = response.data;
    return response.data;
}

export async function Save(color: ColorType, axios: AxiosInstance) {
    const { name: name } = color;
    const { code: code } = color;

    if (!name) {
        throw new Error("Name is required");
    }
    if (name.length < 2) {
        throw new Error("Name must be at least 2 character.");
    }
    if (!code) {
        throw new Error("Name is required");
    }
    if (code.length < 2) {
        throw new Error("Code must be at least 2 character.");
    }

    const response = await axios.post("/Color", color);

    if (!response) {
        throw new Error("This post already exist.");
    }

    return response.data;
}

export async function Update(color: ColorType, axios: AxiosInstance) {
    const { name: name } = color;
    const { code: code } = color;

    if (!name) {
        throw new Error("Name is required");
    }
    if (name.length < 2) {
        throw new Error("Name must be at least 2 character.");
    }
    if (!code) {
        throw new Error("Code is required");
    }
    if (code.length < 2) {
        throw new Error("Code must be at least 2 character.");
    }

    const response = await axios.put(
        "/api/Color" + color.id,
        color
    );

    if (!response) {
        throw new Error("This color already exist.");
    }

    return response.data;
}

export async function Delete(id: string, axios: AxiosInstance) {
    if (id === null || id === undefined) {
        throw new Error("Color not selected.");
    }

    await axios.delete("/Color/" + id);
}
