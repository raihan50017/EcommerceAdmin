export type JournalReportType = {
    Id: number;
    VoucherDate: Date;
    Particulars: string;
    TransactionTypeName: string;
    LedgerFolio: number;
    DebitAmount: number;
    CreditAmount: number;
}