import moment from 'moment';
import { JournalReportType } from './journal-report-type'

export default function JournalReport({ data }: { data?: JournalReportType[] }) {
    const uniqueVoucherId = [...new Set(data?.map(item => item.Id))]; // [ 'A', 'B']
    return (
        <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">General Journal</h1>
                <p className="text-gray-600 italic">
                    Journal is a book in which all the transactions of a business are recorded for the first time.
                </p>
            </div>

            {/* Journal Entries Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="p-3 text-left">Date</th>
                                <th className="p-3 text-left">Particulars</th>
                                <th className="p-3 text-left">LF</th>
                                <th className="p-3 text-right">Debit Amount</th>
                                <th className="p-3 text-right">Credit Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {uniqueVoucherId?.map(d =>
                                <JournalSection data={data?.filter(f => f.Id == d)} />
                            )}
                            {/* Entry 1 */}
                            <tr className="border-b border-gray-200">
                                <td className="p-3 align-top">2025-06-01</td>
                                <td className="p-3">
                                    <div className="font-medium">Cash A/c Dr.</div>
                                    <div className="ml-4">To Capital A/c</div>
                                    <div className="text-gray-500 text-sm italic mt-1">(Owner invested cash in business)</div>
                                </td>
                                <td className="p-3 align-top">
                                    <div>101</div>
                                    <div className="mt-4">301</div>
                                </td>
                                <td className="p-3 text-right align-top text-green-600">5,000.00</td>
                                <td className="p-3 text-right align-top text-red-600">5,000.00</td>
                            </tr>

                            {/* Entry 2 */}
                            <tr className="border-b border-gray-200">
                                <td className="p-3 align-top">2025-06-02</td>
                                <td className="p-3">
                                    <div className="font-medium">Rent Expense A/c Dr.</div>
                                    <div className="ml-4">To Cash A/c</div>
                                    <div className="text-gray-500 text-sm italic mt-1">(Paid office rent in cash)</div>
                                </td>
                                <td className="p-3 align-top">
                                    <div>201</div>
                                    <div className="mt-4">101</div>
                                </td>
                                <td className="p-3 text-right align-top text-green-600">800</td>
                                <td className="p-3 text-right align-top text-red-600">800</td>
                            </tr>

                            {/* Entry 3 */}
                            <tr className="border-b border-gray-200">
                                <td className="p-3 align-top">2025-06-03</td>
                                <td className="p-3">
                                    <div className="font-medium">Inventory A/c Dr.</div>
                                    <div className="ml-4">To Accounts Payable A/c</div>
                                    <div className="text-gray-500 text-sm italic mt-1">(Purchased goods on credit)</div>
                                </td>
                                <td className="p-3 align-top">
                                    <div>150</div>
                                    <div className="mt-4">401</div>
                                </td>
                                <td className="p-3 text-right align-top text-green-600">2,000</td>
                                <td className="p-3 text-right align-top text-red-600">2,000</td>
                            </tr>

                            {/* Entry 4 */}
                            <tr className="border-b border-gray-200">
                                <td className="p-3 align-top">2025-06-04</td>
                                <td className="p-3">
                                    <div className="font-medium">Accounts Receivable A/c Dr.</div>
                                    <div className="ml-4">To Sales A/c</div>
                                    <div className="text-gray-500 text-sm italic mt-1">(Goods sold on credit)</div>
                                </td>
                                <td className="p-3 align-top">
                                    <div>402</div>
                                    <div className="mt-4">501</div>
                                </td>
                                <td className="p-3 text-right align-top text-green-600">1,200</td>
                                <td className="p-3 text-right align-top text-red-600">1,200</td>
                            </tr>

                            {/* Entry 5 */}
                            <tr className="border-b border-gray-200">
                                <td className="p-3 align-top">2025-06-05</td>
                                <td className="p-3">
                                    <div className="font-medium">Salaries Expense A/c Dr.</div>
                                    <div className="ml-4">To Bank A/c</div>
                                    <div className="text-gray-500 text-sm italic mt-1">(Paid salaries through bank)</div>
                                </td>
                                <td className="p-3 align-top">
                                    <div>202</div>
                                    <div className="mt-4">102</div>
                                </td>
                                <td className="p-3 text-right align-top text-green-600">1,000</td>
                                <td className="p-3 text-right align-top text-red-600">1,000</td>
                            </tr>

                            {/* Entry 6 */}
                            <tr className="border-b border-gray-200">
                                <td className="p-3 align-top">2025-06-06</td>
                                <td className="p-3">
                                    <div className="font-medium">Utilities Expense A/c Dr.</div>
                                    <div className="ml-4">To Cash A/c</div>
                                    <div className="text-gray-500 text-sm italic mt-1">(Paid electricity bill in cash)</div>
                                </td>
                                <td className="p-3 align-top">
                                    <div>203</div>
                                    <div className="mt-4">101</div>
                                </td>
                                <td className="p-3 text-right align-top text-green-600">350</td>
                                <td className="p-3 text-right align-top text-red-600">350</td>
                            </tr>

                            {/* Entry 7 */}
                            <tr className="hover:bg-gray-50">
                                <td className="p-3 align-top">2025-06-07</td>
                                <td className="p-3">
                                    <div className="font-medium">Bank A/c Dr.</div>
                                    <div className="ml-4">To Cash A/c</div>
                                    <div className="text-gray-500 text-sm italic mt-1">(Deposited cash into bank)</div>
                                </td>
                                <td className="p-3 align-top">
                                    <div>102</div>
                                    <div className="mt-4">101</div>
                                </td>
                                <td className="p-3 text-right align-top text-green-600">3,000</td>
                                <td className="p-3 text-right align-top text-red-600">3,000</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function JournalSection({ data }: { data?: JournalReportType[] }) {
    return (
        <>
            {data?.map((d, i) =>
                i == 0 ?
                    <tr>
                        <td className="p-1 pl-2 align-top">{moment(d?.VoucherDate).format('DD-MMM-YY')}</td>
                        <td className="p-0 font-medium">
                            <div className="font-medium">{d?.Particulars}</div>
                            {/* <div className="text-gray-500 text-sm italic mt-1">({data ? data[0]?.TransactionTypeName : ''})</div> */}
                        </td>
                        <td className="p-0 align-top">
                            <div>{d?.LedgerFolio}</div>
                        </td>

                        <td className="p-0 text-right align-top text-green-600">
                            <div className="font-medium">{d?.DebitAmount > 0 ? d?.DebitAmount : ''}</div>
                        </td>
                        <td className="p-1 pr-2 text-right align-top text-red-600">
                            <div className="font-medium">{d?.CreditAmount > 0 ? d?.CreditAmount : ''}</div>
                        </td>
                    </tr> :
                    <tr>
                        <td className="p-0 align-top"></td>
                        <td className="p-0">
                            <div className="ml-4">{d?.Particulars}</div>

                            {/* <div className="text-gray-500 text-sm italic mt-1">({data ? data[0]?.TransactionTypeName : ''})</div> */}
                        </td>
                        <td className="p-0 align-top">
                            <div className="mt-4">{d?.LedgerFolio}</div>
                        </td>
                        <td className="p-1 text-right align-top text-green-600">
                            <div className="font-medium">{d?.DebitAmount > 0 ? d?.DebitAmount : ''}</div>
                        </td>
                        <td className="p-1 pr-2 text-right align-top text-red-600">
                            <div className="font-medium">{d?.CreditAmount > 0 ? d?.CreditAmount : ''}</div>
                        </td>
                    </tr>)}
            <tr className="border-b border-gray-200">
                <td></td>
                <td className="pb-1">
                    <div className="text-gray-500 text-sm italic mt-1">({data ? data[0]?.TransactionTypeName : ''})</div>
                </td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </>
    );
}
