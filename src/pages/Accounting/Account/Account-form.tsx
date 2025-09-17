/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { zodResolver } from "@hookform/resolvers/zod";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
    Delete,
    Save,
    Update,
} from "@/actions/accounting/account-action";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useAxiosInstance from "@/lib/axios-instance";
import { cn } from "@/lib/utils";
import { PageAction } from "@/utility/page-actions";
import { ReactQueryKey } from "@/utility/react-query-key";
import { z } from "zod";
import AppPageContainer from "@/components/AppPageContainerProps";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import React from "react";
import { SelectItemType } from "@/types/selectItemType";
import { toast } from "sonner";
import { Label } from "@radix-ui/react-label";
import { AccountType } from "@/actions/accounting/account-action";
import { GetAllCashFlowCategory } from "@/actions/accounting/cash-flow-category-action";
import { GetAllAccountTypeCaching } from "@/actions/accounting/account-type-action";


const formSchema = z.object({
    Id: z.coerce.number().default(0),
    Name: z.string().min(1),
    IsActive: z.boolean().default(true),
    CashFlowCatagoryId: z.coerce.number().default(0),
    CashFlowCategoryName: z.string(),
    AccountTypeId: z.coerce.number().default(0),
    AccountTypeName: z.string(),
    Description: z.string().optional(),
});

type AccountFormSchema = z.infer<typeof formSchema>;

export default function AccountForm({
    data,
    pageAction,
}: {
    data: AccountType | undefined;
    pageAction: string;
}) {
    // console.log("gauge: ", data);
    const [Errors, setErrors] = React.useState<string[] | null>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [openAccountType, setOpenAccountType] = React.useState(false)
    const [accountType, setAccountType] = React.useState<SelectItemType[]>([])

    const [openCashFlowCategory, setOpenCashFlowCategory] = React.useState(false)
    const [cashFlowCategory, setCashFlowCategory] = React.useState<SelectItemType[]>([])


    const queryClient = useQueryClient();
    const navigator = useNavigate();
    const axios = useAxiosInstance();

    const { data: accountTypeData } = GetAllAccountTypeCaching();
    const { data: cashFlowCategoryData } = GetAllCashFlowCategory();


    React.useEffect(() => {
        if (accountTypeData?.IsError) {
            setIsLoading(false);
            setErrors(accountTypeData.Errors);
        } else {
            const _: SelectItemType[] = [];
            accountTypeData?.Data?.forEach((element) => {
                _.push({ label: element.Name, value: element.Id.toString() });
            });

            setAccountType([..._]);
        }
    }, [accountTypeData])


    React.useEffect(() => {
        if (cashFlowCategoryData?.IsError) {
            setErrors(cashFlowCategoryData.Errors);
        } else {
            const _: SelectItemType[] = [];
            cashFlowCategoryData?.Data?.forEach((element) => {
                _.push({ label: element.Name, value: element.Id.toString() });
            });

            setCashFlowCategory([..._]);
        }
    }, [cashFlowCategoryData])


    const mutation = useMutation({
        mutationFn: (tag: AccountType) => {
            if (pageAction === PageAction.add) {
                return Save(tag, axios);
            } else if (pageAction === PageAction.edit) {
                return Update(tag, axios);
            } else if (pageAction === PageAction.delete) {
                return Delete(tag.Id!, axios);
            } else {
                throw new Error("Page Action no found.");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKey.AccountVoucher],
            });
            navigator("/chart-fo-account");
        },
        onError: (err: AxiosError) => {
            console.log(err.response?.data);
        },
    });

    // 1. Define your form.
    const form = useForm<AccountFormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            Id: data?.Id,
            Name: data?.Name || "",
            IsActive: data?.IsActive || true,
            AccountTypeId: data?.AccountTypeId || 0,
            AccountTypeName: data?.AccountTypeName || "",
            CashFlowCatagoryId: data?.CashFlowCatagoryId || 0,
            CashFlowCategoryName: data?.CashFlowCategoryName || "",
            Description: data?.Description || "",
        },
    });

    const { control, handleSubmit } = form;


    // 2. Define a submit handler.
    function onSubmit(values: AccountFormSchema) {
        console.log(values);
        mutation.mutate(values);
    }

    const onError = (errors: any) => {
        const extractMessages = (errObj: any, parentKey = ''): string[] => {
            if (!errObj || typeof errObj !== 'object') return [];

            return Object.entries(errObj).flatMap(([key, value]) => {
                const fullKey = parentKey ? `${parentKey}.${key}` : key;

                if (
                    value &&
                    typeof value === 'object' &&
                    'message' in value &&
                    typeof (value as { message?: unknown }).message === 'string'
                ) {
                    return [`${fullKey}: ${(value as { message: string }).message}`];
                }

                // Array errors (like VoucherDetails[0])
                if (Array.isArray(value)) {
                    return value.flatMap((item, index) =>
                        extractMessages(item, `${fullKey}[${index}]`)
                    );
                }

                // Nested object errors
                if (typeof value === 'object') {
                    return extractMessages(value, fullKey);
                }

                return [];
            });
        };

        const messages = extractMessages(errors);
        toast("Form validation failed", {
            position: "top-center",
            description: (
                <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4 overflow-auto">
                    <code className="text-white text-sm">
                        {messages.join("\n")}
                    </code>
                </pre>
            ),
        })
    };



    let errorMessage: string = "";
    if (mutation.isError) {
        errorMessage = mutation.error.message;
    }
    return (
        <AppPageContainer>
            <Alert
                variant="destructive"
                className={mutation.isError ? "visible" : "hidden"}
            >
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage + ". " + JSON.stringify(Errors)}</AlertDescription>
            </Alert>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
                    <div className="min-w-full flex flex-col flex-wrap gap-2 justify-between">
                        <div className="w-full flex gap-5">
                            <div className="w-full sm:w-6/12 flex flex-col gap-3">
                                <FormField
                                    control={form.control}
                                    name="Id"
                                    render={({ field }) => (
                                        <FormItem className="hidden">
                                            <FormLabel>Id</FormLabel>
                                            <FormControl>
                                                <Input placeholder="GAUGE" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Account Type */}
                                <FormField
                                    control={form.control}
                                    name="AccountTypeId"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="block text-black dark:text-white">Account Type</FormLabel>
                                            <Popover open={openAccountType} onOpenChange={setOpenAccountType}>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn(
                                                                "w-full justify-between border-gray-400",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value
                                                                ? accountType.find(
                                                                    (c) => c.value === field.value?.toString()
                                                                )?.label
                                                                : "Select account category type"}
                                                            <ChevronsUpDown className="opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-white text-black  border-gray-400" align="start">
                                                    <Command>
                                                        <CommandInput
                                                            placeholder="Search account category..."
                                                            className="h-9"
                                                        />
                                                        <CommandList>
                                                            <CommandEmpty>No type found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {accountType.map((_) => (
                                                                    <CommandItem
                                                                        value={_.label}
                                                                        key={_.value}
                                                                        onSelect={() => {
                                                                            form.setValue("AccountTypeId", Number(_.value))
                                                                            form.setValue("AccountTypeName", _.label)
                                                                            setOpenAccountType(false)
                                                                        }}
                                                                    >
                                                                        {_.label}
                                                                        <Check
                                                                            className={cn(
                                                                                "ml-auto",
                                                                                _.value === field.value?.toString()
                                                                                    ? "opacity-100"
                                                                                    : "opacity-0"
                                                                            )}
                                                                        />
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Cash Flow Category */}
                                <FormField
                                    control={form.control}
                                    name="CashFlowCatagoryId"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="block text-black dark:text-white">Cash Flow Category</FormLabel>
                                            <Popover open={openCashFlowCategory} onOpenChange={setOpenCashFlowCategory}>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn(
                                                                "w-full justify-between border-gray-400",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value
                                                                ? cashFlowCategory.find(
                                                                    (c) => c.value === field.value?.toString()
                                                                )?.label
                                                                : "Select cash flow category"}
                                                            <ChevronsUpDown className="opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-white text-black  border-gray-400" align="start">
                                                    <Command>
                                                        <CommandInput
                                                            placeholder="Search cash flow category..."
                                                            className="h-9"
                                                        />
                                                        <CommandList>
                                                            <CommandEmpty>No cash flow found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {cashFlowCategory.map((_) => (
                                                                    <CommandItem
                                                                        value={_.label}
                                                                        key={_.value}
                                                                        onSelect={() => {
                                                                            form.setValue("CashFlowCatagoryId", Number(_.value))
                                                                            form.setValue("CashFlowCategoryName", _.label)
                                                                            setOpenCashFlowCategory(false)
                                                                        }}
                                                                    >
                                                                        {_.label}
                                                                        <Check
                                                                            className={cn(
                                                                                "ml-auto",
                                                                                _.value === field.value?.toString()
                                                                                    ? "opacity-100"
                                                                                    : "opacity-0"
                                                                            )}
                                                                        />
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Account */}
                                <FormField
                                    control={control}
                                    name="Name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="block text-black dark:text-white">Name</FormLabel>
                                            <FormControl>
                                                <Input type="text" {...field}
                                                    className="w-full border-[1.5px] border-gray-400 bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Description */}
                                <FormField
                                    control={control}
                                    name="Description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="block text-black dark:text-white">Description</FormLabel>
                                            <FormControl>
                                                <Input type="text" {...field}
                                                    className="w-full border-[1.5px] border-gray-400 bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Active */}
                                <FormField
                                    control={form.control}
                                    name="IsActive"
                                    render={({ field }) => {
                                        return (
                                            <FormItem className="flex flex-row items-center gap-2">
                                                <FormControl className="w-full">
                                                    <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                                                        <Checkbox
                                                            defaultChecked
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                            name={field.name}
                                                            ref={field.ref}
                                                            className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                                                        />
                                                        <div className="grid gap-1.5 font-normal">
                                                            <p className="text-sm leading-none font-medium">
                                                                Is Active
                                                            </p>
                                                            <p className="text-muted-foreground text-sm">
                                                                This item will show other pages when it checked.
                                                            </p>
                                                        </div>
                                                    </Label>
                                                </FormControl>
                                            </FormItem>
                                        )
                                    }}
                                />

                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                disabled={mutation.isPending ? true : isLoading}
                                className={cn(
                                    "w-24",
                                    pageAction === PageAction.view ? "hidden" : " "
                                )}
                                variant={
                                    pageAction === PageAction.delete ? "destructive" : "default"
                                }
                            >
                                {pageAction === PageAction.add
                                    ? "Save"
                                    : pageAction === PageAction.edit
                                        ? "Update"
                                        : "Delete"}
                            </Button>
                            <Button
                                type="reset"
                                disabled={mutation.isPending}
                                onClick={() => {
                                    form.reset();
                                    form.clearErrors();
                                }}
                                variant={"outline"}
                                className={cn(
                                    "w-24",
                                    pageAction === PageAction.view ? "hidden" : "",
                                    pageAction === PageAction.delete ? "hidden" : ""
                                )}
                            >
                                Cancel
                            </Button>
                        </div>
                        <Button
                            type="reset"
                            disabled={mutation.isPending}
                            onClick={() =>
                                navigator("/chart-fo-account")
                            }
                            variant={"outline"}
                            className={cn("w-24")}
                        >
                            Back
                        </Button>
                    </div>
                </form>
            </Form>
        </AppPageContainer>
    );
}




{/*  <Button type="button" variant="destructive" onClick={() => remove(index)}>
                                                 Remove
                                                </Button> */}

{/* <Button type="button" onClick={() => append({
                                VouchersNo: "",
                                AccountId: 0,
                                AccountName: "",
                                DebitAmount: 0,
                                CreditAmount: 0,
                                IsDebitAccount: true,
                            })}>
                                Add Detail
                            </Button> */}