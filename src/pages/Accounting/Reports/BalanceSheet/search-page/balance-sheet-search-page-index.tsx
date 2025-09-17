import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import BalanceSheetFrom from './balance-sheet-search-from';

export default function BalanceSheetSearchIndex() {
    // const api = useApiUrl();
    // const [data, setData] = React.useState<BalanceSheetType[]>([]);

    return (
        <>
            <Breadcrumb pageName="Balance Sheet Report" />
            <div className='border flex justify-center pt-10'>
                <div className="flex flex-col bg-white rounded-lg p-10 sm:w-6/12 w-full">
                    <BalanceSheetFrom />
                </div>
            </div>
        </>
    );
}
