import { AxiosInstance } from "axios";
import { ApiResponseType } from "../api-response-type";

export type PostType = {
    ID: number;
    title: string;
    content: string;
};


export async function GetAllPost(axios: AxiosInstance): Promise<ApiResponseType<PostType[]>> {
    const response = await axios.get("/posts");
    console.log(response?.data)
    response.data.Data = response.data;
    return response?.data;
}

export async function GetMyPost(axios: AxiosInstance): Promise<ApiResponseType<PostType[]>> {
    const response = await axios.get("/myposts");
    console.log(response?.data)
    response.data.Data = response.data;
    return response?.data;
}

export async function GetPostById(axios: AxiosInstance, id: number): Promise<ApiResponseType<PostType>> {
    const response = await axios.get(`/posts/${id}`);
    response.data.Data = response.data;
    return response.data;
}

export async function Save(post: PostType, axios: AxiosInstance) {
    const { title: title } = post;

    if (!title) {
        throw new Error("Title is required");
    }
    if (title.length < 2) {
        throw new Error("Title must be at least 2 character.");
    }

    const response = await axios.post("/posts", post);

    if (!response) {
        throw new Error("This post already exist.");
    }

    return response.data;
}

export async function Update(post: PostType, axios: AxiosInstance) {
    const { title: title } = post;

    if (!title) {
        throw new Error("Title is required");
    }
    if (title.length < 2) {
        throw new Error("Title must be at least 2 character.");
    }

    const response = await axios.put(
        "/api/posts" + post.ID,
        post
    );

    if (!response) {
        throw new Error("This post already exist.");
    }

    return response.data;
}

export async function Delete(id: number, axios: AxiosInstance) {
    if (Number(id) <= 0) {
        throw new Error("Account Type not selected.");
    }

    await axios.delete("/posts/" + id);
}
