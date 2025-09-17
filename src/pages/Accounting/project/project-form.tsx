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
} from "@/actions/accounting/project-action";
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
import { Project } from "@/actions/accounting/project-action";
import { GetAllActiveSupplier } from "@/actions/accounting/supplier-action";


const formSchema = z.object({
    Id: z.coerce.number().default(0),
    Name: z.string().min(1),
    Code: z.string().default(""),
    PartyId: z.coerce.number().default(0),
    PartyName: z.string().default(""),
    Description: z.string().default(""),
    CostBudget: z.coerce.number().default(0),
    RevenueBudget: z.coerce.number().default(0),
    IsWatchlistOnDashboard: z.boolean().default(false),
    IsActive: z.boolean().default(true),
});


type AccountTypeFormSchema = z.infer<typeof formSchema>;

export default function ProjectForm({
    data,
    pageAction,
}: {
    data: Project | undefined;
    pageAction: string;
}) {
    // console.log("gauge: ", data);
    const [Errors, setErrors] = React.useState<string[] | null>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [openParty, setOpenParty] = React.useState(false)
    const [party, setParty] = React.useState<SelectItemType[]>([])


    const queryClient = useQueryClient();
    const navigator = useNavigate();
    const axios = useAxiosInstance();

    const { data: supplierData } = GetAllActiveSupplier();


    React.useEffect(() => {
        if (supplierData?.IsError) {
            setErrors(supplierData.Errors);
        } else {
            const _: SelectItemType[] = [];
            supplierData?.Data?.forEach((element) => {
                _.push({ label: element.Name, value: element.Id.toString() });
            });

            setParty([..._]);
        }
    }, [supplierData])

    const mutation = useMutation({
        mutationFn: (tag: Project) => {
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
            navigator("/project");
        },
        onError: (err: AxiosError) => {
            console.log(err.response?.data);
        },
    });

    // 1. Define your form.
    const form = useForm<AccountTypeFormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            Id: data?.Id,
            Name: data?.Name || "",
            Code: data?.Code || "",
            PartyId: data?.PartyId || 0,
            PartyName: data?.PartyName || "",
            Description: data?.Description || "",
            CostBudget: data?.CostBudget || 0,
            RevenueBudget: data?.RevenueBudget || 0,
            IsWatchlistOnDashboard: data?.IsWatchlistOnDashboard || false,
            IsActive: data?.IsActive || true,
        },
    });

    const { control, handleSubmit } = form;


    // 2. Define a submit handler.
    function onSubmit(values: Project) {
        setIsLoading(false);
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

                                {/* project name */}
                                <FormField
                                    control={control}
                                    name="Name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="block text-black dark:text-white">Project Name</FormLabel>
                                            <FormControl>
                                                <Input type="text" {...field}
                                                    className="w-full border-[1.5px] border-gray-400 bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* project code */}
                                <FormField
                                    control={control}
                                    name="Code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="block text-black dark:text-white">Project Code</FormLabel>
                                            <FormControl>
                                                <Input type="text" {...field}
                                                    className="w-full border-[1.5px] border-gray-400 bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Account Category */}
                                <FormField
                                    control={form.control}
                                    name="PartyId"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="block text-black dark:text-white">Customer Name</FormLabel>
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
                                                                ? party.find(
                                                                    (c) => c.value === field.value?.toString()
                                                                )?.label
                                                                : "Select customer type"}
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
                                                            <CommandEmpty>No customer found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {party.map((_) => (
                                                                    <CommandItem
                                                                        value={_.label}
                                                                        key={_.value}
                                                                        onSelect={() => {
                                                                            form.setValue("PartyId", Number(_.value))
                                                                            form.setValue("PartyName", _.label)
                                                                            setOpenParty(false)
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

                                {/* project description */}
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

                                {/* cost budget */}
                                <FormField
                                    control={control}
                                    name="CostBudget"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="block text-black dark:text-white">Cost Budget(USD)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field}
                                                    className="w-full border-[1.5px] border-gray-400 bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* cost budget */}
                                <FormField
                                    control={control}
                                    name="RevenueBudget"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="block text-black dark:text-white">Revenue Budget</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field}
                                                    className="w-full border-[1.5px] border-gray-400 bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Active */}
                                <FormField
                                    control={form.control}
                                    name="IsWatchlistOnDashboard"
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
                                                                Is Watchlist On Dashboard
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
                                navigator("/project")
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