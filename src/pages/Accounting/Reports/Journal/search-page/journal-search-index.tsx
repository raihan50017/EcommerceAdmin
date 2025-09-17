import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import JournalSearchFrom from './journal-search-from';

export default function JournalSearchIndex() {
    return (
        <>
            <Breadcrumb pageName="Journal Report" />
            <div className='border flex justify-center pt-10'>
                <div className="flex flex-col bg-white rounded-lg p-10 sm:w-6/12 w-full">
                    <JournalSearchFrom />
                </div>
            </div>
        </>
    );
}
