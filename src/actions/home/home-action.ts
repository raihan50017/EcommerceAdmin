import { AxiosInstance } from "axios";
import { ApiResponseType } from "../api-response-type";

export type UserType = {
    id: number;
    username: string;
    email: string;
};

export type CommentType = {
    id: number;
    content: string;
    post_id: number;
    author: string;
    author_id: number;
    created_at: string;
    user: UserType;
};

export type ReactionType = {
    id: number;
    type: string;
    post_id: number;
    author: string;
    author_id: number;
    created_at: string;
    user: UserType;
};

export type HomePostType = {
    id: number;
    title: string;
    content: string;
    author: string;
    author_id: number;
    created_at: string;
    user: UserType;
    comments: CommentType[] | null;
    reactions: ReactionType[] | null;
};

export async function GetHomePosts(axios: AxiosInstance): Promise<ApiResponseType<HomePostType[]>> {
    const response = await axios.get("/posts");
    console.log(response?.data)
    response.data.Data = response.data;
    return response?.data;
}

export async function SaveComment({ content, post_id }: { content: string, post_id: number }, axios: AxiosInstance) {


    if (!content) {
        throw new Error("Content is required");
    }
    if (content.length < 2) {
        throw new Error("Content must be at least 2 character.");
    }

    const response = await axios.post("/comments", { content, post_id });

    if (!response) {
        throw new Error("This comment already exist.");
    }

    return response.data;
}


export async function SaveReaction({ post_id }: { post_id: number }, axios: AxiosInstance) {

    const response = await axios.post("/reactions", { type: "Like", post_id });

    if (!response) {
        throw new Error("This reactions already exist.");
    }

    return response.data;
}


