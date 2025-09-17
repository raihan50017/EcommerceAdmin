import React from 'react'
import { IncomeStatementReportType } from './income-statement-report-type'
import { cn } from '@/lib/utils';

type RowProps = {
    name: string;
    amount: number;
    highlight?: boolean;
    strong?: boolean;
    showValue?: boolean;
};

export default function IncomeStatementReport({ data }: { data?: IncomeStatementReportType[] }) {
    const uniqueAccountTypes = [...new Set(data?.map(item => item.AccountTypeName))]; // [ 'A', 'B']
    return (
        <div className="max-w-md mx-auto p-6 font-sans text-sm text-black">
            <h1 className="text-xl font-semibold text-center mb-1">
                Income Statement (Profit & Loss Report)
            </h1>
            <p className="text-center text-gray-600 italic mb-4">
                Income & Expense Accounts (only)
            </p>

            <div className="mb-2">
                <p className="font-semibold">Company Name: <span className="font-normal">ABC Traders</span></p>
                <p className="font-semibold">
                    Period: <span className="font-normal">January 1, 2025 – March 31, 2025</span>
                </p>
            </div>

            <table className="w-full border border-black">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border border-black px-2 py-1 text-left">Category</th>
                        <th className="border border-black px-2 py-1 text-right">Amount (USD)</th>
                    </tr>
                </thead>
                <tbody>
                    {uniqueAccountTypes?.map(atype => {
                        return (
                            <>
                                <Row name={atype} amount={0} strong={true} showValue={false} />
                                {data?.filter(f => f.AccountTypeName === atype)?.map(d => <Row name={d.AccountName} amount={d.Amount} />)}
                            </>
                        )
                    })}

                    {/* Revenue */}
                    {/* <Row name="Sales Revenue" amount={50000} />
                    <Row name="Service Revenue" amount={10000} />
                    <Row name="Total Revenue" amount={60000} highlight /> */}

                    {/* Cost of Goods Sold */}
                    <Row name="Purchases" amount={20000} />
                    <Row name="Freight-in" amount={1000} />
                    <Row name="Total COGS" amount={21000} highlight />

                    {/* Gross Profit */}
                    <Row name="Gross Profit" amount={39000} highlight />

                    {/* Operating Expenses */}
                    <Row name="Salaries & Wages" amount={8000} />
                    <Row name="Rent" amount={3000} />
                    <Row name="Utilities" amount={700} />
                    <Row name="Office Supplies" amount={300} />
                    <Row name="Total Operating Exp." amount={12000} highlight />

                    {/* Operating Income */}
                    <Row name="Operating Income" amount={27000} highlight />

                    {/* Other Income/Expenses */}
                    <Row name="Interest Income" amount={200} />
                    <Row name="Interest Expense" amount={-500} />
                    <Row name="Net Other Income" amount={-300} highlight />

                    {/* Net Income Before Tax */}
                    <Row name="Net Income Before Tax" amount={26700} highlight />

                    {/* Income Tax */}
                    <Row name="Income Tax (10%)" amount={-2670} />

                    {/* Final Net Income */}
                    <Row name="Net Income" amount={2565000} highlight strong />
                </tbody>
            </table>
        </div>
    );
}

const Row: React.FC<RowProps> = ({ name, amount, highlight = false, strong = false, showValue = true }) => (
    <tr className={highlight ? "bg-green-100" : ""}>
        <td className={cn("border border-black px-2 py-1")}>
            {strong ? <strong>{name}</strong> : name}
        </td>
        <td className="border border-black px-2 py-1 text-right">
            {showValue ? (amount < 0
                ? `(${Math.abs(amount).toFixed(2)})`
                : amount.toFixed(2)) : ''}
        </td>
    </tr>
);
