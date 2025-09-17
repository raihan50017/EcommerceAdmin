import BreadcrumbAddNew from "@/components/Breadcrumbs/Breadcrumb-add-new";
import { PageAction } from "@/utility/page-actions";
import { useNavigate } from "react-router";
import SupplierGroupTable from "./SupplierGroup-table";

const SupplierGroupIndex = () => {
  const navigator = useNavigate();
  return (
    <>
      <BreadcrumbAddNew
        pageName="Supplier Group"
        addNewButtonText="Add New Supplier Group"
        handleNavigateToAddNewPage={() => navigator(`${PageAction.add}/0`)} />

      <div className="flex flex-col gap-10">
        <SupplierGroupTable />
      </div>
    </>
  );
};

export default SupplierGroupIndex;
