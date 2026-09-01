"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { productService } from "@/services/product-service";
import { adminService, type AdminProductInput } from "@/services/admin-service";
import { ApiError } from "@/types/api";
import type { Category, Product } from "@/types/product";

const productFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  description: z.string().trim().min(1, "Description is required"),
  shortDescription: z.string().trim().optional(),
  price: z
    .string()
    .trim()
    .min(1, "Price is required")
    .refine((v) => Number(v) > 0, "Price must be greater than 0"),
  compareAtPrice: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || Number(v) > 0, "Compare-at price must be greater than 0"),
  categoryId: z.string().min(1, "Choose a category"),
  material: z.string().trim().optional(),
  stockQuantity: z
    .string()
    .trim()
    .min(1, "Stock quantity is required")
    .refine((v) => Number.isInteger(Number(v)) && Number(v) >= 0, "Stock can't be negative"),
  tags: z.string().trim().optional(),
  isFeatured: z.boolean(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export function AdminProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEditing = !!product;

  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    productService
      .listCategories()
      .then(setCategories)
      .catch(() => {
        // Non-critical — the category select just renders empty and the
        // user sees the validation error if they try to submit without one.
      });
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          shortDescription: product.shortDescription ?? "",
          price: String(product.price),
          compareAtPrice: product.compareAtPrice != null ? String(product.compareAtPrice) : "",
          categoryId: product.category.id,
          material: product.material ?? "",
          stockQuantity: String(product.stockQuantity),
          tags: product.tags.join(", "),
          isFeatured: product.isFeatured,
        }
      : {
          name: "",
          description: "",
          shortDescription: "",
          price: "",
          compareAtPrice: "",
          categoryId: "",
          material: "",
          stockQuantity: "0",
          tags: "",
          isFeatured: false,
        },
  });

  const onSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true);

    const payload: AdminProductInput = {
      name: values.name,
      description: values.description,
      shortDescription: values.shortDescription || undefined,
      price: Number(values.price),
      compareAtPrice: values.compareAtPrice ? Number(values.compareAtPrice) : null,
      categoryId: values.categoryId,
      material: values.material || undefined,
      stockQuantity: Number(values.stockQuantity),
      tags: values.tags ? values.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      isFeatured: values.isFeatured,
    };

    try {
      if (isEditing) {
        await adminService.updateProduct(product.id, { ...payload, isActive: true });
        toast.success("Product updated.");
      } else {
        await adminService.createProduct(payload);
        toast.success("Product created.");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6" noValidate>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} error={errors.name?.message} />
        {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortDescription">Short description</Label>
        <Input id="shortDescription" {...register("shortDescription")} placeholder="Shown on listing cards" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Full description</Label>
        <textarea
          id="description"
          {...register("description")}
          rows={5}
          className="w-full rounded-sm border border-border-subtle bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {errors.description && <p className="text-xs text-danger">{errors.description.message}</p>}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹)</Label>
          <Input id="price" type="number" step="0.01" {...register("price")} error={errors.price?.message} />
          {errors.price && <p className="text-xs text-danger">{errors.price.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="compareAtPrice">Compare-at price (₹)</Label>
          <Input id="compareAtPrice" type="number" step="0.01" {...register("compareAtPrice")} />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="categoryId">
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.categoryId && <p className="text-xs text-danger">{errors.categoryId.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="stockQuantity">Stock quantity</Label>
          <Input id="stockQuantity" type="number" {...register("stockQuantity")} error={errors.stockQuantity?.message} />
          {errors.stockQuantity && <p className="text-xs text-danger">{errors.stockQuantity.message}</p>}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="material">Material</Label>
          <Input id="material" {...register("material")} placeholder="e.g. Solid walnut" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input id="tags" {...register("tags")} placeholder="e.g. walnut, mid-century" />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-text-primary">
        <input type="checkbox" {...register("isFeatured")} className="h-4 w-4 rounded border-border-strong" />
        Feature this product on the homepage
      </label>

      <div className="flex gap-3 border-t border-border-subtle pt-6">
        <Button type="submit" isLoading={isSubmitting}>
          {isEditing ? "Save changes" : "Create product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
