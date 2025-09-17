/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
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
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SelectItemType } from "@/types/selectItemType";
import { Delete, Save, TransactionType, Update } from "@/actions/accounting/transaction-type-action";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { GetAllActiveChartOfAccount } from "@/actions/accounting/chart-of-account-action";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";


const voucherDetailsSchema = z.object({
    Id: z.coerce.number(),
    TransactionTypeId: z.coerce.number(),
    TransactionTypeName: z.string().nullable().optional(),
    AccountId: z.coerce.number(),
    AccountName: z.string(),
    IsDebitAccount: z.boolean(),
});

const formSchema = z.object({
    Id: z.coerce.number(),
    Name: z.string().nonempty(),
    Description: z.string().optional(),
    IsActive: z.boolean(),
    TransactionTypeDetails: z.array(voucherDetailsSchema),
});

type TransactionTypeFormSchema = z.infer<typeof formSchema>;

export default function SupplierForm({
    data,
    pageAction,
}: {
    data: TransactionType | undefined;
    pageAction: string;
}) {
    // console.log("gauge: ", data);
    const [Errors, setErrors] = React.useState<string[] | null>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [openChartOfAccountIndex, setOpenChartOfAccountIndex] = React.useState<number | null>(null);
    const [ChartOfAccounts, setChartOfAccounts] = React.useState<SelectItemType[]>([])

    const queryClient = useQueryClient();
    const navigator = useNavigate();
    const axios = useAxiosInstance();

    const { data: chartOfAccountsData } = GetAllActiveChartOfAccount();
    console.log(Errors);
    React.useEffect(() => {
        if (chartOfAccountsData?.IsError) {
            setErrors(chartOfAccountsData.Errors);
        } else {
            const _: SelectItemType[] = [];
            chartOfAccountsData?.Data?.forEach((element) => {
                _.push({ label: element.Name, value: element.Id.toString() });
            });

            setChartOfAccounts([..._]);
        }
    }, [chartOfAccountsData])

    const mutation = useMutation({
        mutationFn: (tag: TransactionType) => {
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
                queryKey: [ReactQueryKey.TransactionTypesActive],
            });
            navigator("/transaction-type");
        },
        onError: (err: AxiosError) => {
            toast("Message", {
                position: "top-center",
                description: (
                    <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4 overflow-auto">
                        <code className="text-white text-sm">
                            {Array.isArray((err.response?.data as any)?.Errors)
                                ? (err.response?.data as any).Errors.join("\n")
                                : "An error occurred."}
                        </code>
                    </pre>
                ),
            })
        },
    });

    // 1. Define your form.
    const form = useForm<TransactionTypeFormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            Id: data?.Id,
            Name: data?.Name,
            Description: data?.Description,
            IsActive: data?.IsActive,
            TransactionTypeDetails: data?.TransactionTypeDetails,
        },
    });

    const { control, handleSubmit } = form;
    const { fields } = useFieldArray({
        control,
        name: "TransactionTypeDetails",
    });

    // 2. Define a submit handler.
    function onSubmit(values: TransactionTypeFormSchema) {
        setIsLoading(true);
        console.log(values);
        mutation.mutate(values);

        setIsLoading(false);
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

                // Array errors (like Transaction TypeDetails[0])
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
    return (
        <AppPageContainer>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
                    <div className="min-w-full flex flex-col flex-wrap gap-2 justify-between">
                        {/* Transaction Type Master */}
                        <div className="w-full flex gap-5">
                            <div className="w-full sm:w-4/12 flex flex-col gap-3">
                                {/* Transaction Type Id */}
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

                                {/* Name */}
                                <FormField
                                    control={form.control}
                                    name="Name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="block text-black dark:text-white">Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Transaction Type Name" {...field}
                                                    className="w-full border-[1.5px] border-gray-400 bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Description */}
                                <FormField
                                    control={form.control}
                                    name="Description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="block text-black dark:text-white">Description</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Description" {...field}
                                                    className="w-full border-[1.5px] border-gray-400 bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

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

                        {/* Dynamic Transaction TypeDetails */}
                        <div className="space-y-4 border rounded p-4">
                            <h4 className="text-base font-semibold text-black">Transaction Type Details</h4>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="whitespace-nowrap text-black text-center">Account Name</TableHead>
                                        <TableHead className="whitespace-nowrap text-black text-center">Is Debit Account</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.map((_item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">
                                                <FormField
                                                    control={form.control}
                                                    name={`TransactionTypeDetails.${index}.AccountId`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <Popover
                                                                open={openChartOfAccountIndex === index}
                                                                onOpenChange={(open) => setOpenChartOfAccountIndex(open ? index : null)}
                                                            >
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
                                                                                ? ChartOfAccounts.find(
                                                                                    (language) => language.value === field.value?.toString()
                                                                                )?.label
                                                                                : "Select account"}
                                                                            <ChevronsUpDown className="opacity-50" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0 bg-white text-black  border-gray-400" align="start">
                                                                    <Command>
                                                                        <CommandInput
                                                                            placeholder="Search account..."
                                                                            className="h-9"
                                                                        />
                                                                        <CommandList>
                                                                            <CommandEmpty>No account found.</CommandEmpty>
                                                                            <CommandGroup>
                                                                                {ChartOfAccounts.map((_) => (
                                                                                    <CommandItem
                                                                                        value={_.label}
                                                                                        key={_.value}
                                                                                        onSelect={() => {
                                                                                            form.setValue(`TransactionTypeDetails.${index}.AccountId`, Number(_.value))
                                                                                            form.setValue(`TransactionTypeDetails.${index}.AccountName`, _.label)
                                                                                            // setOpenChartOfAccount(false)
                                                                                            setOpenChartOfAccountIndex(null); // ✅ close only this popover
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
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <FormField
                                                    control={control}
                                                    name={`TransactionTypeDetails.${index}.IsDebitAccount`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <div className="flex gap-2 justify-center items-center">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value}
                                                                        onCheckedChange={field.onChange}
                                                                        name={field.name}
                                                                        ref={field.ref}
                                                                        className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                                                                    />
                                                                </FormControl>
                                                                <div className="space-y-1 leading-none">
                                                                    <FormLabel className=" text-black dark:text-white">{field.value ? 'Yes' : 'No'}</FormLabel>
                                                                </div>
                                                            </div>
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                </TableBody>
                            </Table>
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
                                navigator("/transaction-type")
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
                                Transaction TypesNo: "",
                                AccountId: 0,
                                AccountName: "",
                                DebitAmount: 0,
                                CreditAmount: 0,
                                IsDebitAccount: true,
                            })}>
                                Add Detail
                            </Button> */}