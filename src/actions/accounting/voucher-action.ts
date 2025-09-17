import { AxiosInstance } from "axios";
import { ApiResponseType } from "../api-response-type";

export type VoucherType = {
    Id?: number | undefined;
    VoucherNo: string;
    VoucherDate: Date;
    TransactionTypeId: number;
    TransactionTypeName: string;
    Amount: number;
    PaymentMethodId?: number | undefined;
    PaymentMethodName?: string | null;
    TaxPercentage?: number | undefined;
    TaxAmount?: number | undefined;
    PartyId?: number;
    PartyName?: string | null | undefined;
    ProjectId?: number;
    ProjectName?: string | null | undefined;
    // CompanyId: string;
    // CompanyName: string;
    Accounts?: string;
    VoucherDetails: VoucherDetailsType[];
};

export type VoucherDetailsType = {
    Id: number;
    VoucherId: number;
    VouchersNo?: string | null | undefined;
    AccountId: number;
    AccountName: string;
    DebitAmount: number;
    CreditAmount: number;
    IsDebitAccount: boolean;
};


export async function GetAllVoucher(axios: AxiosInstance): Promise<ApiResponseType<VoucherType[]>> {
    const response = await axios.get("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/accounting/voucher");
    return response.data;
}

export async function GetVoucherById(axios: AxiosInstance, id: number): Promise<ApiResponseType<VoucherType>> {
    const response = await axios.get(`/169d74c5-deaf-4b49-de77-08dd8f61bf1f/accounting/voucher/${id}`);
    return response.data;
}

export async function Save(VoucherType: VoucherType, axios: AxiosInstance) {
    const { VoucherNo: NAME } = VoucherType;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("Voucher name must be at least 2 character.");
    }

    const response = await axios.post("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/accounting/Voucher", VoucherType);

    if (!response) {
        throw new Error("This VoucherType already exist.");
    }

    return response.data;
}

export async function Update(VoucherType: VoucherType, axios: AxiosInstance) {
    const { VoucherNo: NAME } = VoucherType;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("Voucher name must be at least 2 character.");
    }

    const response = await axios.put(
        "/169d74c5-deaf-4b49-de77-08dd8f61bf1f/accounting/Voucher/" + VoucherType.Id,
        VoucherType
    );

    if (!response) {
        throw new Error("This VoucherType already exist.");
    }

    return response.data;
}

export async function Delete(id: number, axios: AxiosInstance) {
    if (Number(id) <= 0) {
        throw new Error("Voucher not selected.");
    }

    await axios.delete("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/accounting/Voucher/" + id);
}