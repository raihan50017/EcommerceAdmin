import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import IncomeStatementFrom from './income-statement-search-from';

export default function IncomeStatementSearchIndex() {
    return (
        <>
            <Breadcrumb pageName="Income Statement Report" />
            <div className='border flex justify-center pt-10'>
                <div className="flex flex-col bg-white rounded-lg p-10 sm:w-6/12 w-full">
                    <IncomeStatementFrom />
                </div>
            </div>
        </>
    );
}
