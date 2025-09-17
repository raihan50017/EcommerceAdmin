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
    ProductImageType,
    ProductType,
    Save,
    Update,
} from "@/actions/product/product-action";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { GetAllCategory } from "@/actions/category/category-action";
import { GetAllBrand } from "@/actions/brand/brand-action";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SelectItemType } from "@/types/selectItemType";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";


const formSchema = z.object({
    id: z.string().default(""),
    name: z.string().min(1),
    description: z.string().min(1),
    careInstructions: z.string().min(1),
    categoryId: z.string().min(1),
    categoryName: z.string().min(1),
    brandId: z.string().min(1),
    brandName: z.string().min(1),
    WebRootPath: z.string().optional(),
    Images: z.any().optional(),
    IsPrimary: z.string().optional(),
});

type productFormSchema = z.infer<typeof formSchema>;

export default function ProductForm({
    data,
    pageAction,
}: {
    data: ProductType | undefined;
    pageAction: string;
}) {
    const [Errors, _] = React.useState<string[] | null>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [category, setCategory] = React.useState<SelectItemType[]>([])
    const [brand, setBrand] = React.useState<SelectItemType[]>([])


    const [openCategory, setOpenCategory] = React.useState(false)
    const [openBrand, setOpenBrand] = React.useState(false)

    const axios = useAxiosInstance();

    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await GetAllCategory(axios);
                const categoryData = res?.data?.items ?? [];
                const _: SelectItemType[] = [];
                categoryData?.forEach((element) => {
                    _.push({ label: element.name, value: element.id.toString() });
                });

                setCategory([..._]);


            } catch (err) {
                console.error(err);
                setCategory([]);
            }
        };

        const fetchBrands = async () => {
            try {
                const res = await GetAllBrand(axios);
                const brandData = res?.data?.items ?? [];
                const _: SelectItemType[] = [];
                brandData?.forEach((element) => {
                    _.push({ label: element.name, value: element.id.toString() });
                });

                setBrand([..._]);

            } catch (err) {
                console.error(err);
                setBrand([]);
            }
        };

        fetchBrands();
        fetchCategories();
    }, []);


    const queryClient = useQueryClient();
    const navigator = useNavigate();


    const mutation = useMutation({
        mutationFn: (tag: ProductType) => {
            if (pageAction === PageAction.add) {
                return Save(tag, axios);
            } else if (pageAction === PageAction.edit) {
                return Update(tag, axios);
            } else if (pageAction === PageAction.delete) {
                return Delete(tag.id!, axios);
            } else {
                throw new Error("Page Action no found.");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKey.AccountVoucher],
            });
            navigator("/dashboard/product");
        },
        onError: (err: AxiosError) => {
            console.log(err.response?.data);
        },
    });

    // 1. Define your form.
    const form = useForm<productFormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: data?.id || "",
            name: data?.name || "",
            description: data?.description || "",
            careInstructions: data?.careInstructions || "",
            categoryId: data?.categoryId || "",
            categoryName: data?.categoryName || "",
            brandId: data?.brandId || "",
            brandName: data?.brandName || "",
        },
    });

    const { control, handleSubmit } = form;

    function onSubmit(values: productFormSchema) {
        try {
            setIsLoading(true);

            const payload: ProductType = {
                id: values.id || "",
                name: values.name,
                description: values.description,
                careInstructions: values.careInstructions,
                categoryId: values.categoryId,
                categoryName: values.categoryName,
                brandId: values.brandId,
                brandName: values.brandName,
                webRootPath: "",
                variants: [],
                images: values.Images as (File | ProductImageType)[] || [],
            };

            mutation.mutate(payload);
        } catch (err) {
            console.error("Submit Error:", err);
        } finally {
            setIsLoading(false);
        }
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

                if (Array.isArray(value)) {
                    return value.flatMap((item, index) =>
                        extractMessages(item, `${fullKey}[${index}]`)
                    );
                }

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
                                    name="id"
                                    render={({ field }) => (
                                        <FormItem className="hidden">
                                            <FormLabel>id</FormLabel>
                                            <FormControl>
                                                <Input placeholder="id" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                                {/* Name */}
                                <FormField
                                    control={control}
                                    name="name"
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

                                {/* Category */}
                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <Popover
                                                open={openCategory}
                                                onOpenChange={setOpenCategory}
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
                                                                ? category.find(
                                                                    (item) => item.value === field.value?.toString()
                                                                )?.label
                                                                : "Select category"}
                                                            <ChevronsUpDown className="opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-white text-black  border-gray-400" align="start">
                                                    <Command>
                                                        <CommandInput
                                                            placeholder="Search category..."
                                                            className="h-9"
                                                        />
                                                        <CommandList>
                                                            <CommandEmpty>No category found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {category.map((_) => (
                                                                    <CommandItem
                                                                        value={_.label}
                                                                        key={_.value}
                                                                        onSelect={() => {
                                                                            form.setValue("categoryId", _.value)
                                                                            form.setValue("categoryName", _.label)
                                                                            setOpenCategory(false)
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

                                {/* Brand */}
                                <FormField
                                    control={form.control}
                                    name="brandId"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <Popover
                                                open={openBrand}
                                                onOpenChange={setOpenBrand}
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
                                                                ? brand.find(
                                                                    (item) => item.value === field.value?.toString()
                                                                )?.label
                                                                : "Select brand"}
                                                            <ChevronsUpDown className="opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-white text-black  border-gray-400" align="start">
                                                    <Command>
                                                        <CommandInput
                                                            placeholder="Search brand..."
                                                            className="h-9"
                                                        />
                                                        <CommandList>
                                                            <CommandEmpty>No brand found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {brand.map((_) => (
                                                                    <CommandItem
                                                                        value={_.label}
                                                                        key={_.value}
                                                                        onSelect={() => {
                                                                            form.setValue("brandId", _.value)
                                                                            form.setValue("brandName", _.label)
                                                                            setOpenBrand(false);
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


                                {/* Description */}
                                <FormField
                                    control={control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="block text-black dark:text-white">Description</FormLabel>
                                            <FormControl>
                                                <Textarea  {...field}
                                                    className="w-full border-[1.5px] border-gray-400 bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Care Instruction */}
                                <FormField
                                    control={control}
                                    name="careInstructions"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="block text-black dark:text-white">Care Instruction</FormLabel>
                                            <FormControl>
                                                <Textarea  {...field}
                                                    className="w-full border-[1.5px] border-gray-400 bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Images Section */}
                                <FormField
                                    control={control}
                                    name="Images"
                                    render={({ field }) => {
                                        const allImages = field.value || [];

                                        const existingImages = (allImages as (File | ProductImageType)[]).filter(
                                            (img): img is ProductImageType => !(img instanceof File)
                                        );
                                        
                                        const newFiles = (allImages as (File | ProductImageType)[]).filter(
                                            (img): img is File => img instanceof File
                                        );

                                        const [previews, setPreviews] = React.useState<string[]>([]);

                                        React.useEffect(() => {
                                            const urls = newFiles.map((file) => URL.createObjectURL(file));
                                            setPreviews(urls);

                                            return () => urls.forEach((url) => URL.revokeObjectURL(url));
                                        }, []);

                                        return (
                                            <FormItem>
                                                <FormLabel className="block text-black dark:text-white">
                                                    Upload Images
                                                </FormLabel>
                                                <FormControl>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const files = e.target.files ? Array.from(e.target.files) : [];
                                                            field.onChange([...existingImages, ...files]);
                                                        }}
                                                        className="w-full border-[1.5px] border-gray-400 bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                    />
                                                </FormControl>

                                                <div className="mt-4 grid grid-cols-3 gap-4">
                                                    {existingImages.map((image) => (
                                                        <div key={image.id} className="relative border rounded-lg overflow-hidden">
                                                            <img
                                                                src={image.imageUrl}
                                                                alt="Product"
                                                                className="h-24 w-full object-cover"
                                                            />
                                                            <div className="absolute top-1 right-1 bg-white p-1 rounded">
                                                                <input
                                                                    type="radio"
                                                                    name="isPrimary"
                                                                    value={image.id}
                                                                    defaultChecked={image.isPrimary}
                                                                    onChange={() => form.setValue("IsPrimary", image.id)}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {newFiles.map((file, index) => (
                                                        <div key={index} className="relative border rounded-lg overflow-hidden">
                                                            <img
                                                                src={previews[index]}
                                                                alt="Preview"
                                                                className="h-24 w-full object-cover"
                                                            />
                                                            <div className="absolute top-1 right-1 bg-white p-1 rounded">
                                                                <input
                                                                    type="radio"
                                                                    name="isPrimary"
                                                                    value={file.name}
                                                                    onChange={() => form.setValue("IsPrimary", file.name)}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </FormItem>
                                        );
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
                                navigator("/dashboard/product")
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


