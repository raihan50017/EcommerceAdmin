import BreadcrumbAddNew from "@/components/Breadcrumbs/Breadcrumb-add-new";
import { PageAction } from "@/utility/page-actions";
import { useNavigate } from "react-router";
import AccountTypeTable from "./Account-type-table";

const AccountTypeIndex = () => {
  const navigator = useNavigate();
  return (
    <>
      <BreadcrumbAddNew
        pageName="Account Type"
        addNewButtonText="Add New Account Type"
        handleNavigateToAddNewPage={() => navigator(`${PageAction.add}/0`)} />

      <div className="flex flex-col gap-10">
        <AccountTypeTable />
      </div>
    </>
  );
};

export default AccountTypeIndex;
