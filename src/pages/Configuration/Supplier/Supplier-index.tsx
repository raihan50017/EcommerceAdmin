import BreadcrumbAddNew from "@/components/Breadcrumbs/Breadcrumb-add-new";
import { PageAction } from "@/utility/page-actions";
import { useNavigate } from "react-router";
import SupplierTable from "./Supplier-table";

const SupplierIndex = () => {
  const navigator = useNavigate();
  return (
    <>
      <BreadcrumbAddNew
        pageName="Supplier"
        addNewButtonText="Add New Supplier"
        handleNavigateToAddNewPage={() => navigator(`${PageAction.add}/0`)} />

      <div className="flex flex-col gap-10">
        <SupplierTable />
      </div>
    </>
  );
};

export default SupplierIndex;
