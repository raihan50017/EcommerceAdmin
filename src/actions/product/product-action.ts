import { AxiosInstance } from "axios";
import { ApiResponseType, SingleApiResponse } from "../api-response-type";
import { ProductVariantType } from "../product-variant/product-variant-action";

export type ProductImageType = {
    id: string;
    productId: string;
    imageUrl: string;
    isPrimary: boolean;
}


export type ProductType = {
    id: string;
    name: string;
    description: string;
    careInstructions: string;
    categoryId: string;
    brandId: string;
    categoryName: string;
    brandName: string;
    webRootPath: string;
    variants: ProductVariantType[];
    images: (ProductImageType | File)[];
}



export async function GetAllProduct(axios: AxiosInstance): Promise<ApiResponseType<ProductType>> {
    const response = await axios.get("/Product");
    return response.data;
}


export async function GetProducteById(axios: AxiosInstance, id: string): Promise<SingleApiResponse<ProductType>> {

    const response = await axios.get(`/Product/${id}`);
    response.data.Data = response.data;
    return response.data;
}

export async function Save(product: ProductType, axios: AxiosInstance) {
    const {
        id,
        name,
        description,
        careInstructions,
        categoryId,
        brandId,
        images,
    } = product;

    if (!name || name.trim() === "") throw new Error("Product name is required");
    if (!description || description.trim() === "")
        throw new Error("Product description is required");
    if (!categoryId) throw new Error("Category is required");
    if (!brandId) throw new Error("Brand is required");

    const formData = new FormData();
    if (id) formData.append("Id", id);

    formData.append("Name", name.trim());
    formData.append("Description", description.trim());
    formData.append("CareInstructions", careInstructions || "");
    formData.append("CategoryId", categoryId);
    formData.append("BrandId", brandId);
    formData.append("WebRootPath", "Path");

    if (images && images.length > 0) {
        (images as (ProductImageType | File)[])
            .filter((img): img is File => img instanceof File)
            .forEach((file) => {
                formData.append("ImageFiles", file);
            });

        const existingImages = (images as (ProductImageType | File)[])
            .filter((img): img is ProductImageType => !(img instanceof File));

        if (existingImages.length > 0) {
            formData.append("ExistingImages", JSON.stringify(existingImages));
        }
    }

    const response = await axios.post(`/Product`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    if (!response || response.status !== 200) {
        throw new Error("Failed to save the product.");
    }

    return response.data;
}



export async function Update(product: ProductType, axios: AxiosInstance) {
    const { id, name, description, categoryId, brandId } = product;

    if (!id) {
        throw new Error("Product ID is required for updating.");
    }
    if (!name || name.trim().length < 2) {
        throw new Error("Product name must be at least 2 characters.");
    }
    if (!description || description.trim().length < 2) {
        throw new Error("Product description must be at least 2 characters.");
    }
    if (!categoryId) {
        throw new Error("Category is required.");
    }
    if (!brandId) {
        throw new Error("Brand is required.");
    }

    try {
        const response = await axios.put(`/api/Product/${id}`, product, {
            headers: { "Content-Type": "application/json" },
        });

        if (!response || response.status !== 200) {
            throw new Error("Failed to update the product.");
        }

        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error(error.message || "An unexpected error occurred.");
    }
}


export async function Delete(id: string, axios: AxiosInstance) {
    if (id === null || id === undefined) {
        throw new Error("Color not selected.");
    }

    await axios.delete("/Product/" + id);
}
