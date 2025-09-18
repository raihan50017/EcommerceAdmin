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
    ProductVariantType,
    Save,
} from "@/actions/product-variant/product-variant-action";
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
import React, { useState } from "react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SelectItemType } from "@/types/selectItemType";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { GetAllColor } from "@/actions/color/color-action";
import { GetAllSize } from "@/actions/size/size-action";
import { GetAllProduct } from "@/actions/product/product-action";
import { Table } from "@/components/ui/table";


const formSchema = z.object({
    id: z.string().default(""),
    productId: z.string().min(1, "Product is required"),
    productName: z.string().min(1, "Product is required"),
    sizeId: z.string().optional(),
    sizeName: z.string().optional(),
    colorId: z.string().optional(),
    colorName: z.string().optional(),
    sku: z.string().optional(),
    price: z.any().optional(),
    stock: z.any().optional(),
});

type productVariantFormSchema = z.infer<typeof formSchema>;

export default function ProductVariantForm({
    data,
    pageAction,
}: {
    data: ProductVariantType | undefined;
    pageAction: string;
}) {
    const [Errors, _] = React.useState<string[] | null>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [product, setProduct] = React.useState<SelectItemType[]>([])
    const [color, setColor] = React.useState<SelectItemType[]>([])
    const [size, setSize] = React.useState<SelectItemType[]>([])


    const [openProduct, setOpenProduct] = React.useState(false)
    const [openColor, setOpenColor] = React.useState(false)
    const [openSize, setOpenSize] = React.useState(false)


    const [variantData, setVariantsData] = useState<ProductVariantType[]>([]);

    const axios = useAxiosInstance();

    React.useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await GetAllProduct(axios);
                const productData = res?.data?.items ?? [];
                const _: SelectItemType[] = [];
                productData?.forEach((element) => {
                    _.push({ label: element.name, value: element.id.toString() });
                });

                setProduct([..._]);

            } catch (err) {
                console.error(err);
                setProduct([]);
            }
        };

        const fetchColor = async () => {
            try {
                const res = await GetAllColor(axios);
                const colorData = res?.data?.items ?? [];
                const _: SelectItemType[] = [];
                colorData?.forEach((element) => {
                    _.push({ label: element.name, value: element.id.toString() });
                });

                setColor([..._]);

            } catch (err) {
                console.error(err);
                setColor([]);
            }
        };

        const fetchSize = async () => {
            try {
                const res = await GetAllSize(axios);
                const sizeData = res?.data?.items ?? [];
                const _: SelectItemType[] = [];
                sizeData?.forEach((element) => {
                    _.push({ label: element.name, value: element.id.toString() });
                });

                setSize([..._]);

            } catch (err) {
                console.error(err);
                setSize([]);
            }
        };
        fetchSize()
        fetchColor();
        fetchProduct();
    }, []);


    const queryClient = useQueryClient();
    const navigator = useNavigate();


    const mutation = useMutation({
        mutationFn: (tag: ProductVariantType[]) => {
            if (pageAction === PageAction.add) {
                return Save(tag, tag[0].productId, axios);
            } else if (pageAction === PageAction.delete) {
                return Delete(tag[0].productId!, axios);
            } else {
                throw new Error("Page Action no found.");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKey.AccountVoucher],
            });
            navigator("/dashboard/product-variant");
        },
        onError: (err: AxiosError) => {
            console.log(err.response?.data);
        },
    });

    const form = useForm<productVariantFormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: data?.id || "",
            productId: data?.productId || "",
            productName: data?.productName || "",
            colorId: data?.colorId || "",
            colorName: data?.colorName || "",
            sizeName: data?.sizeName || "",
            sku: data?.sku || "",
            price: data?.price || 0,
            stock: data?.stock || 0,
        },
    });

    const { control } = form;


    function onSubmit() {
        try {
            setIsLoading(true);
            mutation.mutate(variantData);
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


    const handleAdd = () => {
        const values = form.getValues();

        if (!values.colorId || !values.sizeId || !values.price || !values.stock) {
            toast.error("Please fill all required fields!");
            return;
        }

        const isExist = variantData.some(
            (item) => item.colorId === values.colorId && item.sizeId === values.sizeId
        );

        if (isExist) {
            toast.error("This variant already exists!");
            return;
        }

        const sku = `${values.productName?.substring(0, 3).toUpperCase()}-${values.colorName?.substring(0, 3).toUpperCase()}-${values.sizeName}`;

        const newVariant: ProductVariantType = {
            id: values.id || crypto.randomUUID(),
            productId: values.productId,
            productName: values.productName,
            colorId: values.colorId,
            colorName: values.colorName || "",
            sizeId: values.sizeId,
            sizeName: values.sizeName || "",
            price: Number(values.price),
            stock: Number(values.stock),
            sku,
        };

        setVariantsData((prev) => [...prev, newVariant]);

        form.setValue("colorId", "");
        form.setValue("colorName", "");
        form.setValue("sizeId", "");
        form.setValue("sizeName", "");
        form.setValue("price", "");
        form.setValue("stock", "");
    };



    const getVariantsByProduct = async (productId: string) => {
        const params: Record<string, any> = { productId };
        const response = await axios.get("/Product/variants-by-product", { params });
        const data = response.data.data;
        setVariantsData(data.items)
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
                <form
                    onSubmit={form.handleSubmit(onSubmit, onError)}
                    className="space-y-6 bg-white dark:bg-slate-900 rounded-xl p-6  dark:border-gray-700"
                >
                    {/* Master Section */}
                    <div className="flex flex-col gap-4">
                        {/* Product Selection */}
                        <FormField
                            control={form.control}
                            name="productId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Product</FormLabel>
                                    <Popover open={openProduct} onOpenChange={setOpenProduct}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full justify-between border-gray-300",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? product.find((item) => item.value === field.value)
                                                            ?.label
                                                        : "Select product"}
                                                    <ChevronsUpDown className="opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0 bg-white border border-gray-200 rounded-lg shadow-md">
                                            <Command>
                                                <CommandInput
                                                    placeholder="Search product..."
                                                    className="h-9"
                                                />
                                                <CommandList>
                                                    <CommandEmpty>No product found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {product.map((item) => (
                                                            <CommandItem
                                                                value={item.label}
                                                                key={item.value}
                                                                onSelect={() => {
                                                                    form.setValue("productId", item.value);
                                                                    form.setValue("productName", item.label);
                                                                    getVariantsByProduct(item.value);
                                                                    setOpenProduct(false);
                                                                }}
                                                            >
                                                                {item.label}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto",
                                                                        item.value === field.value
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

                    {/* Details Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Color Selection */}
                        <FormField
                            control={form.control}
                            name="colorId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <Popover open={openColor} onOpenChange={setOpenColor}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full justify-between border-gray-300",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? color.find((item) => item.value === field.value)
                                                            ?.label
                                                        : "Select color"}
                                                    <ChevronsUpDown className="opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0 bg-white border border-gray-200 rounded-lg shadow-md">
                                            <Command>
                                                <CommandInput placeholder="Search color..." className="h-9" />
                                                <CommandList>
                                                    <CommandEmpty>No color found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {color.map((item) => (
                                                            <CommandItem
                                                                value={item.label}
                                                                key={item.value}
                                                                onSelect={() => {
                                                                    form.setValue("colorId", item.value);
                                                                    form.setValue("colorName", item.label);
                                                                    setOpenColor(false);
                                                                }}
                                                            >
                                                                {item.label}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto",
                                                                        item.value === field.value
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

                        {/* Size Selection */}
                        <FormField
                            control={form.control}
                            name="sizeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Size</FormLabel>
                                    <Popover open={openSize} onOpenChange={setOpenSize}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full justify-between border-gray-300",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? size.find((item) => item.value === field.value)
                                                            ?.label
                                                        : "Select size"}
                                                    <ChevronsUpDown className="opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0 bg-white border border-gray-200 rounded-lg shadow-md">
                                            <Command>
                                                <CommandInput placeholder="Search size..." className="h-9" />
                                                <CommandList>
                                                    <CommandEmpty>No size found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {size.map((item) => (
                                                            <CommandItem
                                                                value={item.label}
                                                                key={item.value}
                                                                onSelect={() => {
                                                                    form.setValue("sizeId", item.value);
                                                                    form.setValue("sizeName", item.label);
                                                                    setOpenSize(false);
                                                                }}
                                                            >
                                                                {item.label}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto",
                                                                        item.value === field.value
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

                        {/* Price */}
                        <FormField
                            control={control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Stock */}
                        <FormField
                            control={control}
                            name="stock"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stock</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Add Button */}
                    <Button type="button" variant="default" onClick={handleAdd}>
                        + Add Variant
                    </Button>

                    {/* Variants Table */}
                    {variantData.length > 0 && (
                        <div className="overflow-x-auto border rounded-lg mt-4  text-gray-950">
                            <Table>
                                <thead>
                                    <tr className="text-left" style={{ backgroundColor: "#bbf9dc" }}>
                                        <th className="p-2">Color</th>
                                        <th className="p-2">Size</th>
                                        <th className="p-2">Price</th>
                                        <th className="p-2">Stock</th>
                                        <th className="p-2">SKU</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {variantData.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="border-t hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            <td className="p-2">{item.colorName}</td>
                                            <td className="p-2">{item.sizeName}</td>
                                            <td className="p-2">{item.price}</td>
                                            <td className="p-2">{item.stock}</td>
                                            <td className="p-2">{item.sku}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}

                    {/* Action Buttons */}
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
                                navigator("/dashboard/product-variant")
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


