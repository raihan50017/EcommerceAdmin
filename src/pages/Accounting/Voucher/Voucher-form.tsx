/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { zodResolver } from "@hookform/resolvers/zod";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
    VoucherType,
    Delete,
    Save,
    Update,
} from "@/actions/accounting/voucher-action";
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
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SelectItemType } from "@/types/selectItemType";
import { GetAllActiveTransactionType, GetTransactionById } from "@/actions/accounting/transaction-type-action";
import { GetAllActivePaymentMethod } from "@/actions/accounting/payment-method-action";
import { GetAllActiveSupplier } from "@/actions/accounting/supplier-action";
import { GetAllActiveProject } from "@/actions/accounting/project-action";
import { toast } from "sonner";


const voucherDetailsSchema = z.object({
    Id: z.coerce.number(),
    VoucherId: z.coerce.number(),
    VouchersNo: z.string().nullable().optional(),
    AccountId: z.coerce.number(),
    AccountName: z.string(),
    DebitAmount: z.coerce.number(),
    CreditAmount: z.coerce.number(),
    IsDebitAccount: z.boolean(),
});

const formSchema = z.object({
    Id: z.coerce.number().optional(),
    VoucherNo: z.string().min(1),
    VoucherDate: z.coerce.date(),
    TransactionTypeId: z.coerce.number(),
    TransactionTypeName: z.string(),
    Amount: z.coerce.number(),
    PaymentMethodId: z.coerce.number().optional(),
    PaymentMethodName: z.string().nullable().optional(),
    TaxPercentage: z.coerce.number().optional(),
    TaxAmount: z.coerce.number().optional(),
    PartyId: z.coerce.number().optional(),
    PartyName: z.string().nullable().optional(),
    ProjectId: z.coerce.number().optional(),
    ProjectName: z.string().nullable().optional(),
    VoucherDetails: z.array(voucherDetailsSchema),
});

type VoucherFormSchema = z.infer<typeof formSchema>;

export default function VoucherForm({
    data,
    pageAction,
}: {
    data: VoucherType | undefined;
    pageAction: string;
}) {
    // console.log("gauge: ", data);
    const [Errors, setErrors] = React.useState<string[] | null>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [openTransactionType, setOpenTransaction] = React.useState(false)
    const [TransactionTypes, setTransactionTypes] = React.useState<SelectItemType[]>([])

    const [openPaymentMethod, setOpenPaymentMethod] = React.useState(false)
    const [PaymentMethods, setPaymentMethods] = React.useState<SelectItemType[]>([])

    const [openParty, setOpenParty] = React.useState(false)
    const [Parties, setParties] = React.useState<SelectItemType[]>([])

    const [openProject, setOpenProject] = React.useState(false)
    const [Projects, setProjects] = React.useState<SelectItemType[]>([])

    const queryClient = useQueryClient();
    const navigator = useNavigate();
    const axios = useAxiosInstance();

    const { data: transactionTypesData } = GetAllActiveTransactionType();
    const { data: paymentMethodsData } = GetAllActivePaymentMethod();
    const { data: partysData } = GetAllActiveSupplier();
    const { data: projectsData } = GetAllActiveProject();

    React.useEffect(() => {
        if (transactionTypesData?.IsError) {
            setErrors(transactionTypesData.Errors);
        } else {
            const _: SelectItemType[] = [];
            transactionTypesData?.Data?.forEach((element) => {
                _.push({ label: element.Name, value: element.Id.toString() });
            });

            setTransactionTypes([..._]);
        }
    }, [transactionTypesData])

    React.useEffect(() => {
        if (paymentMethodsData?.IsError) {
            setErrors(paymentMethodsData.Errors);
        } else {
            const _: SelectItemType[] = [];
            paymentMethodsData?.Data?.forEach((element) => {
                _.push({ label: element.Name, value: element.Id.toString() });
            });

            setPaymentMethods([..._]);
        }
    }, [paymentMethodsData])


    React.useEffect(() => {
        if (partysData?.IsError) {
            setErrors(partysData.Errors);
        } else {
            const _: SelectItemType[] = [];
            partysData?.Data?.forEach((element) => {
                _.push({ label: element.Name, value: element.Id.toString() });
            });

            setParties([..._]);
        }
    }, [partysData])

    React.useEffect(() => {
        if (projectsData?.IsError) {
            setErrors(projectsData.Errors);
        } else {
            const _: SelectItemType[] = [];
            projectsData?.Data?.forEach((element) => {
                _.push({ label: element.Name, value: element.Id.toString() });
            });

            setProjects([..._]);
        }
    }, [projectsData])

    const mutation = useMutation({
        mutationFn: (tag: VoucherType) => {
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
            navigator("/voucher");
        },
        onError: (err: AxiosError) => {
            console.log(err.response?.data);
        },
    });

    // 1. Define your form.
    const form = useForm<VoucherFormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            Id: data?.Id,
            VoucherNo: data?.VoucherNo,
            VoucherDate: data?.VoucherDate,
            TransactionTypeId: data?.TransactionTypeId,
            TransactionTypeName: data?.TransactionTypeName,
            Amount: data?.Amount,
            PaymentMethodId: data?.PaymentMethodId,
            PaymentMethodName: data?.PaymentMethodName,
            TaxPercentage: data?.TaxPercentage,
            TaxAmount: data?.TaxAmount,
            PartyId: data?.PartyId,
            PartyName: data?.PartyName,
            ProjectId: data?.ProjectId,
            ProjectName: data?.VoucherNo,
            VoucherDetails: data?.VoucherDetails,
        },
    });

    const { control, handleSubmit } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: "VoucherDetails",
    });

    // 2. Define a submit handler.
    function onSubmit(values: VoucherFormSchema) {
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

    async function getTransferTypeDetails(id: number) {
        setIsLoading(true);
        remove();
        const details = await GetTransactionById(axios, id);

        if (details.IsError) {
            toast("Message", {
                position: "top-center",
                description: (
                    <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4 overflow-auto">
                        <code className="text-white text-sm">
                            {details.Errors.join("\n")}
                        </code>
                    </pre>
                ),
            })
        } else {
            details?.Data?.TransactionTypeDetails?.map((_) =>
                append({
                    Id: 0,
                    VoucherId: 0,
                    VouchersNo: form.getValues("VoucherNo"),
                    AccountId: _.AccountId,
                    AccountName: _.AccountName,
                    DebitAmount: _.IsDebitAccount ? form.getValues("Amount") : 0,
                    CreditAmount: _.IsDebitAccount ? 0 : form.getValues("Amount"),
                    IsDebitAccount: _.IsDebitAccount,
                })
            )
        }
        setIsLoading(false);
    }

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
                        {/* Voucher Master */}
                        <div className="w-full flex gap-5">
                            <div className="w-full sm:w-6/12 flex flex-col gap-3">
                                {/* Voucher Id */}
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

                                {/* Voucher No */}
                                <FormField
                                    control={form.control}
                                    name="VoucherNo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="block text-black dark:text-white">Voucher No</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Voucher No" {...field} disabled
                                                    className="w-full border-[1.5px] border-gray-400 bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* VoucherDate */}
                                <FormField
                                    control={form.control}
                                    name="VoucherDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="block text-black dark:text-white">Voucher Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal border-gray-400",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-white text-black  border-gray-400" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        // disabled={(date) =>
                                                        //     date > new Date() || date < new Date("1900-01-01")
                                                        // }
                                                        captionLayout="dropdown"
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* TransactionType */}
                                <FormField
                                    control={form.control}
                                    name="TransactionTypeId"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="block text-black dark:text-white">Transaction Type</FormLabel>
                                            <Popover open={openTransactionType} onOpenChange={setOpenTransaction}>
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
                                                                ? TransactionTypes.find(
                                                                    (language) => language.value === field.value?.toString()
                                                                )?.label
                                                                : "Select transaction type"}
                                                            <ChevronsUpDown className="opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-white text-black  border-gray-400" align="start">
                                                    <Command>
                                                        <CommandInput
                                                            placeholder="Search transaction type..."
                                                            className="h-9"
                                                        />
                                                        <CommandList>
                                                            <CommandEmpty>No transaction type found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {TransactionTypes.map((_) => (
                                                                    <CommandItem
                                                                        value={_.label}
                                                                        key={_.value}
                                                                        onSelect={() => {
                                                                            form.setValue("TransactionTypeId", Number(_.value))
                                                                            form.setValue("TransactionTypeName", _.label)
                                                                            getTransferTypeDetails(Number(_.value));
                                                                            setOpenTransaction(false)
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

                                {/* Amount */}
                                <FormField
                                    control={control}
                                    name="Amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="block text-black dark:text-white">Amount</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field}
                                                    onBlur={() => getTransferTypeDetails(form.getValues("TransactionTypeId"))}
                                                    className="w-full border-[1.5px] border-gray-400 bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* PaymentMethod */}
                                <FormField
                                    control={form.control}
                                    name="PaymentMethodId"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="block text-black dark:text-white ">Payment Method</FormLabel>
                                            <Popover open={openPaymentMethod} onOpenChange={setOpenPaymentMethod}>
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
                                                                ? PaymentMethods.find(
                                                                    (language) => language.value === field.value?.toString()
                                                                )?.label
                                                                : "Select payment method"}
                                                            <ChevronsUpDown className="opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-white text-black  border-gray-400" align="start">
                                                    <Command>
                                                        <CommandInput
                                                            placeholder="Search payment method..."
                                                            className="h-9"
                                                        />
                                                        <CommandList>
                                                            <CommandEmpty>No payment method found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {PaymentMethods.map((language) => (
                                                                    <CommandItem
                                                                        value={language.label}
                                                                        key={language.value}
                                                                        onSelect={() => {
                                                                            form.setValue("PaymentMethodId", Number(language.value))
                                                                            form.setValue("PaymentMethodName", language.label)
                                                                            setOpenPaymentMethod(false)
                                                                        }}
                                                                    >
                                                                        {language.label}
                                                                        <Check
                                                                            className={cn(
                                                                                "ml-auto",
                                                                                language.value === field.value?.toString()
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
                            </div>

                            <div className="w-full sm:w-6/12 flex flex-col gap-3">

                                {/* Party */}
                                <FormField
                                    control={form.control}
                                    name="PartyId"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="block text-black dark:text-white ">Party</FormLabel>
                                            <Popover open={openParty} onOpenChange={setOpenParty}>
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
                                                                ? Parties.find(
                                                                    (language) => language.value === field.value?.toString()
                                                                )?.label
                                                                : "Select Party"}
                                                            <ChevronsUpDown className="opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-white text-black  border-gray-400" align="start">
                                                    <Command>
                                                        <CommandInput
                                                            placeholder="Search Party..."
                                                            className="h-9"
                                                        />
                                                        <CommandList>
                                                            <CommandEmpty>No Party found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {Parties.map((language) => (
                                                                    <CommandItem
                                                                        value={language.label}
                                                                        key={language.value}
                                                                        onSelect={() => {
                                                                            form.setValue("PartyId", Number(language.value))
                                                                            form.setValue("PartyName", language.label)
                                                                            setOpenParty(false)
                                                                        }}
                                                                    >
                                                                        {language.label}
                                                                        <Check
                                                                            className={cn(
                                                                                "ml-auto",
                                                                                language.value === field.value?.toString()
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

                                {/* Projects */}
                                <FormField
                                    control={form.control}
                                    name="ProjectId"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="block text-black dark:text-white ">Project</FormLabel>
                                            <Popover open={openProject} onOpenChange={setOpenProject}>
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
                                                                ? Projects.find(
                                                                    (language) => language.value === field.value?.toString()
                                                                )?.label
                                                                : "Select Project"}
                                                            <ChevronsUpDown className="opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-white text-black  border-gray-400" align="start">
                                                    <Command>
                                                        <CommandInput
                                                            placeholder="Search Project..."
                                                            className="h-9"
                                                        />
                                                        <CommandList>
                                                            <CommandEmpty>No Project found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {Projects.map((language) => (
                                                                    <CommandItem
                                                                        value={language.label}
                                                                        key={language.value}
                                                                        onSelect={() => {
                                                                            form.setValue("ProjectId", Number(language.value))
                                                                            form.setValue("ProjectName", language.label)
                                                                            setOpenProject(false)
                                                                        }}
                                                                    >
                                                                        {language.label}
                                                                        <Check
                                                                            className={cn(
                                                                                "ml-auto",
                                                                                language.value === field.value?.toString()
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

                                {/* Text % */}
                                <FormField
                                    control={control}
                                    name="TaxPercentage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="block text-black dark:text-white ">Tax %</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field}
                                                    className="w-full border-[1.5px] border-gray-400 bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Text Amount */}
                                <FormField
                                    control={control}
                                    name="TaxAmount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="block text-black dark:text-white ">Tax Amount</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field}
                                                    className="w-full border-[1.5px] border-gray-400 bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                            </div>

                        </div>

                        {/* Dynamic VoucherDetails */}
                        <div className="space-y-4 border rounded p-4">
                            <h4 className="text-base font-semibold text-black">Voucher Details</h4>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="whitespace-nowrap text-black text-center">Account Name</TableHead>
                                        <TableHead className="whitespace-nowrap text-black text-center hidden">Account Id</TableHead>
                                        <TableHead className="whitespace-nowrap text-black text-center">Debit Amount</TableHead>
                                        <TableHead className="whitespace-nowrap text-black text-center">Credit Amount</TableHead>
                                        <TableHead className="whitespace-nowrap text-black text-center">Is Debit Account</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.map((_item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">
                                                <FormField
                                                    control={control}
                                                    name={`VoucherDetails.${index}.AccountName`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input {...field} className="border-0 outline-0 text-center" />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium hidden">
                                                <FormField
                                                    control={control}
                                                    name={`VoucherDetails.${index}.AccountId`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input {...field} className="border-0 outline-0 text-center" />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormField
                                                    control={control}
                                                    name={`VoucherDetails.${index}.DebitAmount`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input type="number" {...field} className="border-0 outline-0 text-center" />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormField
                                                    control={control}
                                                    name={`VoucherDetails.${index}.CreditAmount`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input type="number" {...field} className="border-0 outline-0 text-center" />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <FormField
                                                    control={control}
                                                    name={`VoucherDetails.${index}.IsDebitAccount`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <div className="flex gap-2 justify-center items-center">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value}
                                                                        onCheckedChange={field.onChange}
                                                                        name={field.name}
                                                                        ref={field.ref}
                                                                        disabled
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
                            <Button
                                type="button"
                                disabled={mutation.isPending}
                                onClick={() => {
                                    const url = `/voucher/voucher-report?id=${data?.Id}`;
                                    window.open(url, "_blank");
                                }}
                                variant={"outline"}
                                className={cn(
                                    "w-24 bg-green-300",
                                )}
                            >
                                Show
                            </Button>
                        </div>
                        <Button
                            type="reset"
                            disabled={mutation.isPending}
                            onClick={() =>
                                navigator("/voucher")
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