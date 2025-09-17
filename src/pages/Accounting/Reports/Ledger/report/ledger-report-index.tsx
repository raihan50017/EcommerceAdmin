/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router';
import { LedgerReportType } from './ledger-report-type';
import useAxiosInstance from '@/lib/axios-instance';
import useApiUrl from '@/hooks/use-ApiUrl';
import LedgerReport from './ledger-report';

export default function LedgerReportIndex() {
    const [data, setData] = useState<LedgerReportType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const axios = useAxiosInstance();
    const api = useApiUrl();

    let fromDate: string | null = "";
    let toDate: string | null = "";
    let factoryId: string | null = "";

    if (searchParams.get("fromDate")) {
        fromDate = searchParams.get("fromDate");
    }
    if (searchParams.get("toDate")) {
        toDate = searchParams.get("toDate");
    }
    if (searchParams.get("factoryId")) {
        factoryId = searchParams.get("factoryId");
    }

    useEffect(() => {
        document.title = "Daily Knitting Update";
    }, []);

    useEffect(() => {
        async function getData() {
            try {
                setIsLoading(true);

                await axios
                    .get(
                        `${api.ProductionUrl}/169d74c5-deaf-4b49-de77-08dd8f61bf1f/accounting/reports/ledger-report?fromDate=${fromDate}&toDate=${toDate}&factoryId=${factoryId}`
                    )
                    .then((res) => {
                        if (res.data) {
                            const result = res.data;
                            if (result.IsError) {
                                console.log("Error found: ", result.ErrorMessage);
                                setData([]);
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
                <LedgerReport data={data} />
            )}
        </>
    );
}
