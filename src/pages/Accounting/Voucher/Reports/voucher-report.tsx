import { VoucherType } from '@/actions/accounting/voucher-action';
import moment from "moment";

export default function VoucherReport({ data }: { data?: VoucherType | null }) {
    const voucherData = {
        voucherNo: "12345687",
        date: "06/25/2025",
        amount: "$1,250.00",
        paymentMethod: "Bank Transfer",
        amountPaidTo: "John Doe",
        amountInWords: "One Thousand Two Hundred Fifty Dollars Only",
        onAccountOf: "Office Supplies Purchase",
        authorizedBy: "Jane Smith",
        receivedBy: "John Doe",
    };

    return (
        <div className="max-w-3xl mx-auto p-6 border border-gray-300 font-sans text-sm bg-white">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-blue-900">ABC Traders Ltd.</h1>
                <p className="text-gray-500 text-xs">123 Main St, Dhaka, Bangladesh</p>
                <h2 className="text-xl font-bold text-blue-800 mt-2">Payment Voucher</h2>
            </div>

            <div className="flex justify-between mb-4 text-black">
                <div />
                <div className="text-right text-sm space-y-1">
                    <p><strong>Payment Voucher No:</strong> <span className="text-gray-700">{data?.VoucherNo}</span></p>
                    <p><strong>Date:</strong> {moment(data?.VoucherDate).format("DD-MMM-YY")}</p>
                </div>
            </div>

            <div className="space-y-4 text-sm text-black">
                <p>
                    <strong>Amount :</strong> {data?.Amount}
                </p>

                <div>
                    <strong>Payment Method:</strong>
                    <p className="border-b border-black w-full inline-block mb-1">{data?.PaymentMethodName ?? 'NA'}</p>
                    <span className="text-xs italic text-gray-600">By Cheque or by Cash or Bank</span>
                </div>

                <div>
                    <strong>Amount Paid To:</strong>
                    <p className="border-b border-black w-full inline-block mb-1">{voucherData.amountPaidTo}</p>
                    <span className="text-xs italic text-gray-600">Name of Receiver</span>
                </div>

                <div>
                    <strong>Amount in Words:</strong>
                    <p className="border-b border-black w-full inline-block mb-1">{voucherData.amountInWords}</p>
                </div>

                <div>
                    <strong>On Account of:</strong>
                    <p className="border-b border-black w-full inline-block mb-1">{data?.TransactionTypeName}</p>
                </div>

                <div className="flex justify-between mt-8">
                    <div className="text-center">
                        <div className="border-t border-black w-40 mx-auto mb-1" />
                        {/* <span>{voucherData.authorizedBy}</span><br /> */}
                        <span className="text-xs text-gray-700">Authorized by</span>
                    </div>
                    <div className="text-center">
                        <div className="border-t border-black w-40 mx-auto mb-1" />
                        {/* <span>{voucherData.receivedBy}</span><br /> */}
                        <span className="text-xs text-gray-700">Received By</span>
                    </div>
                </div>
            </div>
        </div>
    );
};