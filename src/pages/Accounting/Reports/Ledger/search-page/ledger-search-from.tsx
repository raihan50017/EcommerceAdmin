import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import React from "react"
import { SelectItemType } from "@/types/selectItemType"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { GetAllCompany } from "@/actions/configuration/company-action"

const formSchema = z.object({
    fromDate: z.coerce.date(),
    toDate: z.coerce.date(),
    factoryId: z.string().optional()
})

export default function LedgerSearchFrom() {
    const [openFactory, setOpenTransaction] = React.useState(false)
    const [Factorys, setFactorys] = React.useState<SelectItemType[]>([])

    const { data: companyData } = GetAllCompany();

    React.useEffect(() => {
        const _: SelectItemType[] = [];
        companyData?.forEach((element) => {
            _.push({ label: element.Name, value: element.Id.toString() });
        });

        setFactorys([..._]);

    }, [companyData])

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fromDate: new Date(),
            toDate: new Date(),
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        const url = `/accounting/reports/ledger-report?fromDate=${values.fromDate.toISOString()}&toDate=${values.toDate.toISOString()}&factoryId=${values.factoryId ?? ''}`;
        window.open(url, "_blank");
    }

    return (
        <Form {...form}>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="fromDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="block text-black dark:text-white">From Date</FormLabel>
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

                <FormField
                    control={form.control}
                    name="toDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="block text-black dark:text-white">To Date</FormLabel>
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

                {/* Factory */}
                <FormField
                    control={form.control}
                    name="factoryId"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="block text-black dark:text-white">Company</FormLabel>
                            <Popover open={openFactory} onOpenChange={setOpenTransaction}>
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
                                                ? Factorys.find(
                                                    (language) => language.value === field.value?.toString()
                                                )?.label
                                                : "Select Company"}
                                            <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-white text-black  border-gray-400" align="start">
                                    <Command>
                                        <CommandInput
                                            placeholder="Search Company..."
                                            className="h-9"
                                        />
                                        <CommandList>
                                            <CommandEmpty>No Company found.</CommandEmpty>
                                            <CommandGroup>
                                                {Factorys.map((_) => (
                                                    <CommandItem
                                                        value={_.label}
                                                        key={_.value}
                                                        onSelect={() => {
                                                            form.setValue("factoryId", _.value)
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

                <Button type="submit" className="w-full">Show</Button>
            </form>
        </Form>
    )
}