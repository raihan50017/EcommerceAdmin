import BreadcrumbAddNew from "@/components/Breadcrumbs/Breadcrumb-add-new";
import { PageAction } from "@/utility/page-actions";
import { useNavigate } from "react-router";
import ProjectTable from "./project-table";

const ProjectIndex = () => {
  const navigator = useNavigate();
  return (
    <>
      <BreadcrumbAddNew
        pageName="Project"
        addNewButtonText="Add New Project"
        handleNavigateToAddNewPage={() => navigator(`${PageAction.add}/0`)} />

      <div className="flex flex-col gap-10">
        <ProjectTable />
      </div>
    </>
  );
};

export default ProjectIndex;
