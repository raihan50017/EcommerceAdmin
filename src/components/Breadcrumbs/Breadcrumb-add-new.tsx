import { cn } from "@/lib/utils";

interface Props {
  pageName: string;
  addNewButtonText?: string;
  isShowAddNewButton?: boolean;
  handleNavigateToAddNewPage: React.MouseEventHandler<HTMLInputElement>;
}
const BreadcrumbAddNew = ({ pageName, addNewButtonText, isShowAddNewButton, handleNavigateToAddNewPage }: Props) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      <div>
        <div className={cn(isShowAddNewButton === false ? 'hidden' : '')}>
          <label
            className="flex cursor-pointer items-center justify-center gap-2 rounded bg-primary py-1 px-2 text-sm font-medium text-white hover:bg-opacity-90 xsm:px-4"
          >
            <input type="button" name="cover" id="cover" className="sr-only" onClick={handleNavigateToAddNewPage} />
            <span>{addNewButtonText}</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default BreadcrumbAddNew;
