import BreadcrumbAddNew from "@/components/Breadcrumbs/Breadcrumb-add-new";
import { PageAction } from "@/utility/page-actions";
import { useNavigate } from "react-router";
import ProductVariantTable from "./product-variant-table";

const ProductVariantIndex = () => {
  const navigator = useNavigate();
  return (
    <>
      <BreadcrumbAddNew
        pageName="Product Variant"
        addNewButtonText="Add New Product Variant"
        handleNavigateToAddNewPage={() => navigator(`${PageAction.add}/0`)} />

      <div className="flex flex-col gap-10">
        <ProductVariantTable />
      </div>
    </>
  );
};

export default ProductVariantIndex;
