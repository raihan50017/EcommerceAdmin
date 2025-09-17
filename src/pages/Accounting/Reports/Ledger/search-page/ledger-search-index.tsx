import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import LedgerSearchFrom from './ledger-search-from';

export default function LedgerSearchIndex() {
    return (
        <>
            <Breadcrumb pageName="Ledger Report" />
            <div className='border flex justify-center pt-10'>
                <div className="flex flex-col bg-white rounded-lg p-10 sm:w-6/12 w-full">
                    <LedgerSearchFrom />
                </div>
            </div>
        </>
    );
}
