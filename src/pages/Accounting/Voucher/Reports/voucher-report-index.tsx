import useApiUrl from '@/hooks/use-ApiUrl';
import useAxiosInstance from '@/lib/axios-instance';
import React from 'react'
import { useSearchParams } from 'react-router';
import VoucherReport from './voucher-report';
import { VoucherType } from '@/actions/accounting/voucher-action';

export default function VoucherReportIndex() {
    const [data, setData] = React.useState<VoucherType | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [searchParams] = useSearchParams();
    const axios = useAxiosInstance();
    const api = useApiUrl();

    let id: string | null = "";

    if (searchParams.get("id")) {
        id = searchParams.get("id");
    }

    React.useEffect(() => {
        document.title = "Daily Knitting Update";
    }, []);

    React.useEffect(() => {
        async function getData() {
            try {
                setIsLoading(true);

                await axios
                    .get(
                        `${api.ProductionUrl}/169d74c5-deaf-4b49-de77-08dd8f61bf1f/accounting/voucher/${id}`
                    )
                    .then((res) => {
                        if (res.data) {
                            const result = res.data;
                            if (result.IsError) {
                                console.log("Error found: ", result.ErrorMessage);
                                setData(null);
                            } else {
                                setData(result.Data);
                                console.log(result.Data);
                            }
                        } else {
                            console.log(res);
                        }
                    })
                    .catch((m) => console.log(m));

                setIsLoading(false);
            } catch {
                setIsLoading(false);
            }
        }
        getData();
    }, []);

    return (
        <>
            {isLoading ? (
                <>
                    <p className='text-center pt-10'><em>Loading...</em></p>
                </>
            ) : (
                <VoucherReport data={data} />
            )}
        </>
    );
}
