import BreadcrumbAddNew from "@/components/Breadcrumbs/Breadcrumb-add-new";
import { PageAction } from "@/utility/page-actions";
import { useNavigate } from "react-router";
import CategoryTable from "./category-table";

const CategoryIndex = () => {
  const navigator = useNavigate();
  return (
    <>
      <BreadcrumbAddNew
        pageName="Category"
        addNewButtonText="Add New Category"
        handleNavigateToAddNewPage={() => navigator(`${PageAction.add}/0`)} />

      <div className="flex flex-col gap-10">
        <CategoryTable />
      </div>
    </>
  );
};

export default CategoryIndex;
