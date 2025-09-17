import { AxiosInstance } from "axios";
import { ApiResponseType } from "../api-response-type";

export type AccountType = {
    Id: number,
    Name: string,
    AccountTypeId: number,
    AccountTypeName: string,
    CashFlowCatagoryId: number,
    CashFlowCategoryName: string,
    Description?: string,
    IsActive: boolean,

};


export async function GetAllAccount(axios: AxiosInstance): Promise<ApiResponseType<AccountType[]>> {
    const response = await axios.get("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/accounting/ChartOfAccount");
    return response.data;
}

export async function GetAccountById(axios: AxiosInstance, id: number): Promise<ApiResponseType<AccountType>> {
    const response = await axios.get(`/169d74c5-deaf-4b49-de77-08dd8f61bf1f/accounting/ChartOfAccount/${id}`);
    return response.data;
}

export async function Save(AccountType: AccountType, axios: AxiosInstance) {
    const { Name: NAME } = AccountType;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("Voucher name must be at least 2 character.");
    }

    const response = await axios.post("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/accounting/ChartOfAccount", AccountType);

    if (!response) {
        throw new Error("This Account Type already exist.");
    }

    return response.data;
}

export async function Update(AccountType: AccountType, axios: AxiosInstance) {
    const { Name: NAME } = AccountType;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("Account name must be at least 2 character.");
    }

    const response = await axios.put(
        "/169d74c5-deaf-4b49-de77-08dd8f61bf1f/accounting/ChartOfAccount/" + AccountType.Id,
        AccountType
    );

    if (!response) {
        throw new Error("This account already exist.");
    }

    return response.data;
}

export async function Delete(id: number, axios: AxiosInstance) {
    if (Number(id) <= 0) {
        throw new Error("Account not selected.");
    }

    await axios.delete("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/accounting/ChartOfAccount/" + id);
}