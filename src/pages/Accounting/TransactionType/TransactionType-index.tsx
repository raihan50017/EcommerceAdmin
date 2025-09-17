import BreadcrumbAddNew from "@/components/Breadcrumbs/Breadcrumb-add-new";
import { PageAction } from "@/utility/page-actions";
import { useNavigate } from "react-router";
import TransactionTypeTable from "./TransactionType-table";

const TransactionTypeIndex = () => {
  const navigator = useNavigate();
  return (
    <>
      <BreadcrumbAddNew
        pageName="Transaction Type"
        addNewButtonText="Add New Transaction Type"
        handleNavigateToAddNewPage={() => navigator(`${PageAction.add}/0`)} />

      <div className="flex flex-col gap-10">
        <TransactionTypeTable />
      </div>
    </>
  );
};

export default TransactionTypeIndex;
