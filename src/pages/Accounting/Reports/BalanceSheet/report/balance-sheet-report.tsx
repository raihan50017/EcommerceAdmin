import React from 'react'
import { BalanceSheetReportType } from './balance-sheet-report-type'

type SectionProps = {
    title: string;
    rows: BalanceSheetReportType[] | undefined;
    total: number | undefined;
};

export default function BalanceSheetReport({ data }: { data?: BalanceSheetReportType[] }) {

    const uniqueAccountCatagoies = [...new Set(data?.map(item => item.AccountCatagoryName))]; // [ 'A', 'B']

    return (
        <div className="max-w-3xl mx-auto p-6 font-sans text-sm text-black">
            <h1 className="text-xl font-semibold text-center mb-1">
                Statement of Financial Position (Balance sheet)
            </h1>
            <p className="text-center text-gray-600 mb-6">
                It provides a snapshot of a company’s financial position at a specific point in time.
                <br />
                <span className="italic">[Assets = Liabilities + Equity]</span>
            </p>

            <div className="mb-4">
                <h2 className="text-lg font-semibold">ABC Traders</h2>
                <p>As of June 10, 2025</p>
            </div>

            {uniqueAccountCatagoies?.map(c =>
                <Section
                    title={c}
                    rows={data?.filter(f => f.AccountCatagoryName === c)?.map(ele => ele)}
                    total={data?.filter(f => f.AccountCatagoryName === c)?.reduce((p, c) => p + c.Amount, 0)} />
            )}

            {/* Assets */}
            {/* <Section title="Assets" rows={[
                { name: "Cash", amount: 350 },
                { name: "Bank", amount: 600 },
                { name: "Accounts Receivable", amount: 1200 },
                { name: "Inventory", amount: 2000 },
            ]} total={4150} /> */}

            {/* Liabilities */}
            <Section title="Liabilities" rows={[
                {
                    AccountName: "Accounts Payable", Amount: 1000,
                    AccountCatagoryName: '',
                    SortingNo: 0
                },
            ]} total={1000} />

            {/* Owner's Equity */}
            <Section title="Owner’s Equity" rows={[
                {
                    AccountName: "Capital", Amount: 5000,
                    AccountCatagoryName: '',
                    SortingNo: 0
                },
                {
                    AccountName: "Less: Drawings", Amount: -500,
                    AccountCatagoryName: '',
                    SortingNo: 0
                },
                {
                    AccountName: "Less: Net Loss", Amount: -1350,
                    AccountCatagoryName: '',
                    SortingNo: 0
                },
            ]} total={3150} />

            {/* Balance Sheet Summary */}
            <div className="mt-8 border border-black">
                <div className="flex justify-between p-2 font-semibold bg-gray-100">
                    <span>Total Assets</span>
                    <span>{data?.filter(f => f.AccountCatagoryName === 'Asset')?.reduce((p, c) => p + c.Amount, 0)?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-2 font-semibold">
                    <span>Total Liabilities + Equity</span>
                    <span>{data?.filter(f => f.AccountCatagoryName === 'Liability')?.reduce((p, c) => p + c.Amount, 0)?.toFixed(2)} + {data?.filter(f => f.AccountCatagoryName === 'Equity')?.reduce((p, c) => p + c.Amount, 0)?.toFixed(2)} =
                        {data?.filter(f => f.AccountCatagoryName === 'Liability' || f.AccountCatagoryName === 'Equity')?.reduce((p, c) => p + c.Amount, 0)?.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
}

const Section: React.FC<SectionProps> = ({ title, rows, total }) => (
    <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">{title}</h3>
        <table className="w-full border border-black">
            <thead className="bg-gray-100">
                <tr>
                    <th className="border border-black px-2 py-1 text-left">Account</th>
                    <th className="border border-black px-2 py-1 text-right">Amount (USD)</th>
                </tr>
            </thead>
            <tbody>
                {rows?.map((row, idx) => (
                    <tr key={idx}>
                        <td className="border border-black px-2 py-1">{row.AccountName}</td>
                        <td className="border border-black px-2 py-1 text-right">
                            {row.Amount < 0 ? `(${Math.abs(row.Amount).toFixed(2)})` : row.Amount.toFixed(2)}
                        </td>
                    </tr>
                ))}
                <tr className="bg-green-100 font-semibold">
                    <td className="border border-black px-2 py-1">Total {title}</td>
                    <td className="border border-black px-2 py-1 text-right">{total?.toFixed(2)}</td>
                </tr>
            </tbody>
        </table>
    </div>
);
