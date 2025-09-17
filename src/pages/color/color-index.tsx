import BreadcrumbAddNew from "@/components/Breadcrumbs/Breadcrumb-add-new";
import { PageAction } from "@/utility/page-actions";
import { useNavigate } from "react-router";
import ColorTable from "./color-table";

const ColorIndex = () => {
  const navigator = useNavigate();
  return (
    <>
      <BreadcrumbAddNew
        pageName="Color"
        addNewButtonText="Add New Color"
        handleNavigateToAddNewPage={() => navigator(`${PageAction.add}/0`)} />

      <div className="flex flex-col gap-10">
        <ColorTable />
      </div>
    </>
  );
};

export default ColorIndex;
