import moment from 'moment';
import { LedgerReportType } from './ledger-report-type'


export default function LedgerReport({ data }: { data?: LedgerReportType[] }) {
    const uniqueAccount = [...new Set(data?.map(item => item.Account))]; // [ 'A', 'B']
    return (
        <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-blue-800">ABC Traders</h1>
                <h2 className="text-xl text-gray-600 mt-2">Period: 1st June 2025 to 10th June 2025</h2>
            </div>

            {uniqueAccount?.map(ac =>
                <AccountSection data={data?.filter(f => f.Account === ac)} />
            )}

            {/* Cash Account */}
            <div className="mb-10 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-600 p-4">
                    <h3 className="text-white font-semibold">Cash Account (LF: 101)</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">Date</th>
                                <th className="p-3 text-left">Particulars</th>
                                <th className="p-3 text-left">LF</th>
                                <th className="p-3 text-right">Debit (USD)</th>
                                <th className="p-3 text-right">Credit (USD)</th>
                                <th className="p-3 text-right">Balance (USD)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3">2025-06-01</td>
                                <td className="p-3">Capital A/c</td>
                                <td className="p-3">301</td>
                                <td className="p-3 text-right text-green-600">5,000.00</td>
                                <td className="p-3 text-right"></td>
                                <td className="p-3 text-right">5,000.00</td>
                            </tr>
                            <tr className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3">2025-06-02</td>
                                <td className="p-3">Rent Expense A/c</td>
                                <td className="p-3">201</td>
                                <td className="p-3 text-right"></td>
                                <td className="p-3 text-right text-red-600">800</td>
                                <td className="p-3 text-right">4,200.00</td>
                            </tr>
                            <tr className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3">2025-06-06</td>
                                <td className="p-3">Utilities Expense A/c</td>
                                <td className="p-3">203</td>
                                <td className="p-3 text-right"></td>
                                <td className="p-3 text-right text-red-600">350</td>
                                <td className="p-3 text-right">3,850.00</td>
                            </tr>
                            <tr className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3">2025-06-07</td>
                                <td className="p-3">Bank A/c</td>
                                <td className="p-3">102</td>
                                <td className="p-3 text-right"></td>
                                <td className="p-3 text-right text-red-600">3,000.00</td>
                                <td className="p-3 text-right">850</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="p-3">2025-06-09</td>
                                <td className="p-3">Drawings A/c</td>
                                <td className="p-3">302</td>
                                <td className="p-3 text-right"></td>
                                <td className="p-3 text-right text-red-600">500</td>
                                <td className="p-3 text-right font-medium">350 (Dr)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bank Account */}
            <div className="mb-10 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-600 p-4">
                    <h3 className="text-white font-semibold">Bank Account (LF: 102)</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">Date</th>
                                <th className="p-3 text-left">Particulars</th>
                                <th className="p-3 text-left">LF</th>
                                <th className="p-3 text-right">Debit (USD)</th>
                                <th className="p-3 text-right">Credit (USD)</th>
                                <th className="p-3 text-right">Balance (USD)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3">2025-06-07</td>
                                <td className="p-3">Cash A/c</td>
                                <td className="p-3">101</td>
                                <td className="p-3 text-right text-green-600">3,000.00</td>
                                <td className="p-3 text-right"></td>
                                <td className="p-3 text-right">3,000.00</td>
                            </tr>
                            <tr className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3">2025-06-05</td>
                                <td className="p-3">Salaries Expense A/c</td>
                                <td className="p-3">202</td>
                                <td className="p-3 text-right"></td>
                                <td className="p-3 text-right text-red-600">1,000.00</td>
                                <td className="p-3 text-right">2,000.00</td>
                            </tr>
                            <tr className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3">2025-06-08</td>
                                <td className="p-3">Advertising Expense A/c</td>
                                <td className="p-3">204</td>
                                <td className="p-3 text-right"></td>
                                <td className="p-3 text-right text-red-600">400</td>
                                <td className="p-3 text-right">1,600.00</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="p-3">2025-06-10</td>
                                <td className="p-3">Accounts Payable A/c</td>
                                <td className="p-3">401</td>
                                <td className="p-3 text-right"></td>
                                <td className="p-3 text-right text-red-600">1,000.00</td>
                                <td className="p-3 text-right font-medium">600 (Dr)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Capital Account */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-600 p-4">
                    <h3 className="text-white font-semibold">Capital Account (LF: 301)</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">Date</th>
                                <th className="p-3 text-left">Particulars</th>
                                <th className="p-3 text-left">LF</th>
                                <th className="p-3 text-right">Debit (USD)</th>
                                <th className="p-3 text-right">Credit (USD)</th>
                                <th className="p-3 text-right">Balance (USD)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="hover:bg-gray-50">
                                <td className="p-3">2025-06-01</td>
                                <td className="p-3">Cash A/c</td>
                                <td className="p-3">101</td>
                                <td className="p-3 text-right"></td>
                                <td className="p-3 text-right text-green-600">5,000.00</td>
                                <td className="p-3 text-right font-medium">5,000.00 (Cr)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function AccountSection({ data }: { data?: LedgerReportType[] }) {
    return (
        <div className="mb-10 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 p-4">
                <h3 className="text-white font-semibold">{data ? data[0]?.Account : ''}</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Particulars</th>
                            <th className="p-3 text-left">LF</th>
                            <th className="p-3 text-right">Debit (USD)</th>
                            <th className="p-3 text-right">Credit (USD)</th>
                            <th className="p-3 text-right">Balance (USD)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map(d =>
                            <tr className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3">{moment(d?.VoucherDate).format("DD-MMM-YY")}</td>
                                <td className="p-3">{d?.Particulars}</td>
                                <td className="p-3">{d?.LedgerFolio}</td>
                                <td className="p-3 text-right text-green-600">{d?.DebitAmount}</td>
                                <td className="p-3 text-right">{d?.CreditAmount}</td>
                                <td className="p-3 text-right">{d?.BalanceDisplay}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
