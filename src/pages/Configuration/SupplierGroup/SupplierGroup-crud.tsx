/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BsExclamationTriangle } from 'react-icons/bs';
import { useParams } from 'react-router';
import SupplierGroupForm from './SupplierGroup-form';
import { PageAction } from '@/utility/page-actions';
import React from 'react';
import BreadcrumbAddNew from '@/components/Breadcrumbs/Breadcrumb-add-new';
import { SupplierGroupType } from '@/actions/configuration/supplier-group-action';

export default function SupplierGroupCRUD() {
    const [supplierGroup,] = React.useState<SupplierGroupType | undefined>();
    const [isLoading, setIsLoading] = React.useState(false);
    const [errorMsg,] = React.useState<string | null>(null);

    const { pageAction } = useParams();

    React.useEffect(() => {
        async function getData() {
            try {

            } catch {
                setIsLoading(false);
            }
        }
        getData();

    }, []);


    if (!pageAction) {
        return (
            <Alert variant="destructive">
                <BsExclamationTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Page Action type is required.</AlertDescription>
            </Alert>
        );
    }

    if (errorMsg) {
        return (
            <Alert variant="destructive">
                <BsExclamationTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
        );
    }

    if (isLoading) {
        return (
            <h1>
                <em>Loading...</em>
            </h1>
        );
    }

    if (pageAction === PageAction.view) {
        return (
            <div className="w-full flex flex-col justify-center items-center mt-2 mb-10 ">
                <h1 className="font-bold text-xl text-left w-full mb-2">Supplier Group</h1>
                <SupplierGroupForm data={supplierGroup} pageAction={PageAction.view} />
            </div>
        );
    } else if (pageAction === PageAction.add) {
        return (
            <>
                <BreadcrumbAddNew pageName="New Supplier Group" isShowAddNewButton={false} handleNavigateToAddNewPage={() => { }} />
                <div className="flex flex-col gap-10">
                    <SupplierGroupForm data={supplierGroup} pageAction={PageAction.add} />
                </div>
            </>
        );
    } else if (pageAction === PageAction.edit) {
        return (
            <div className="w-full flex flex-col justify-center items-center mt-2 mb-10">
                <h1 className="font-bold text-xl text-left w-full mb-2">
                    Update Supplier Group
                </h1>
                <SupplierGroupForm data={supplierGroup} pageAction={PageAction.edit} />
            </div>
        );
    } else if (pageAction === PageAction.delete) {
        return (
            <div className="w-full flex flex-col justify-center items-center mt-2 mb-10">
                <h1 className="font-bold text-xl text-left w-full text-destructive mb-2">
                    Delete Supplier Group
                </h1>
                <SupplierGroupForm data={supplierGroup} pageAction={PageAction.delete} />
            </div>
        );
    } else {
        return (
            <div className="w-full flex flex-col justify-center items-center mt-2 mb-10"></div>
        );
    }

}
