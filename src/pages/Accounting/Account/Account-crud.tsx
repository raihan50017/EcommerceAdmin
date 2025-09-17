/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BsExclamationTriangle } from 'react-icons/bs';
import { useParams } from 'react-router';
import { PageAction } from '@/utility/page-actions';
import useAxiosInstance from '@/lib/axios-instance';
import React from 'react';
import BreadcrumbAddNew from '@/components/Breadcrumbs/Breadcrumb-add-new';
import AccountForm from './Account-form';
import { AccountType, GetAccountById } from '@/actions/accounting/account-action';

export default function AccountCRUD() {
    const axios = useAxiosInstance();
    const [account, setAccount] = React.useState<AccountType | undefined>();
    const [isLoading, setIsLoading] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

    const { pageAction, id } = useParams();

    React.useEffect(() => {
        async function getData() {
            try {
                setIsLoading(true);

                await GetAccountById(axios, Number(id))
                    .then((res) => {
                        if (res.IsError) {
                            console.log("Error found: ", res.Errors);
                            setErrorMsg(JSON.stringify(res.Errors));
                            setAccount(undefined);
                        } else {
                            setAccount(res.Data);
                            console.log('account-type: ', res.Data);
                        }
                    })
                    .catch((m) => console.log(m));
                setIsLoading(false);
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
                <h1 className="font-bold text-xl text-left w-full mb-2">Account</h1>
                <AccountForm data={account} pageAction={PageAction.view} />
            </div>
        );
    } else if (pageAction === PageAction.add) {
        return (
            <>
                <BreadcrumbAddNew pageName="New Account" isShowAddNewButton={false} handleNavigateToAddNewPage={() => { }} />
                <div className="flex flex-col gap-10">
                    <AccountForm data={account} pageAction={PageAction.add} />
                </div>
            </>
        );
    } else if (pageAction === PageAction.edit) {
        return (
            <div className="w-full flex flex-col justify-center items-center mt-2 mb-10">
                <h1 className="font-bold text-xl text-left w-full mb-2">
                    Update Account
                </h1>
                <AccountForm data={account} pageAction={PageAction.edit} />
            </div>
        );
    } else if (pageAction === PageAction.delete) {
        return (
            <div className="w-full flex flex-col justify-center items-center mt-2 mb-10">
                <h1 className="font-bold text-xl text-left w-full text-destructive mb-2">
                    Delete Account
                </h1>
                <AccountForm data={account} pageAction={PageAction.delete} />
            </div>
        );
    } else {
        return (
            <div className="w-full flex flex-col justify-center items-center mt-2 mb-10"></div>
        );
    }

}
