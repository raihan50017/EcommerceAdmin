import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@/lib/axios-instance";
import { AxiosInstance } from "axios";
import { ReactQueryKey } from "@/utility/react-query-key";
import { ApiResponseType } from "../api-response-type";

export type Project = {
    Id: number;
    Name: string;
    Code: string;
    Description: string;
    PartyId: number;
    PartyName: string;
    CostBudget: number;
    RevenueBudget: number;
    IsWatchlistOnDashboard: boolean;
    IsActive: boolean;
};

export async function GetAllProject(axios: AxiosInstance) {
    const response = await axios.get(`/169d74c5-deaf-4b49-de77-08dd8f61bf1f/Project`);
    return response.data;
}

export function GetAllActiveProject() {
    const axios = useAxiosInstance();

    const getData = async (): Promise<ApiResponseType<Project[]>> =>
        (await axios.get("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/Project?IsActive=true")).data;

    const query = useQuery({
        queryKey: [ReactQueryKey.ProjectsActive],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}

export async function GetProjectById(axios: AxiosInstance, id: number): Promise<ApiResponseType<Project>> {
    const response = await axios.get(`/169d74c5-deaf-4b49-de77-08dd8f61bf1f/Project/${id}`);
    return response.data;
}

export async function Save(Project: Project, axios: AxiosInstance) {
    const { Name: NAME } = Project;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("Project name must be at least 2 character.");
    }

    const response = await axios.post("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/Project", Project);

    if (!response) {
        throw new Error("This Project already exist.");
    }

    return response.data;
}

export async function Update(Project: Project, axios: AxiosInstance) {
    const { Name: NAME } = Project;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("Project name must be at least 2 character.");
    }

    const response = await axios.put(
        "/169d74c5-deaf-4b49-de77-08dd8f61bf1f/Project/" + Project.Id,
        Project
    );

    if (!response) {
        throw new Error("This Project already exist.");
    }

    return response.data;
}

export async function Delete(id: number, axios: AxiosInstance) {
    if (Number(id) <= 0) {
        throw new Error("Project not selected.");
    }

    await axios.delete("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/Project/" + id);
}