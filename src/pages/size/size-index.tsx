import BreadcrumbAddNew from "@/components/Breadcrumbs/Breadcrumb-add-new";
import { PageAction } from "@/utility/page-actions";
import { useNavigate } from "react-router";
import SizeTable from "./size-table";

const SizeIndex = () => {
  const navigator = useNavigate();
  return (
    <>
      <BreadcrumbAddNew
        pageName="Size"
        addNewButtonText="Add New Size"
        handleNavigateToAddNewPage={() => navigator(`${PageAction.add}/0`)} />

      <div className="flex flex-col gap-10">
        <SizeTable />
      </div>
    </>
  );
};

export default SizeIndex;
