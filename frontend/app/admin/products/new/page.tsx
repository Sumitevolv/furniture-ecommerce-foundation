import { AdminProductForm } from "@/components/admin/admin-product-form";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal">Add product</h1>
      <p className="mt-1 text-sm text-text-secondary">Create a new piece for the catalog.</p>
      <div className="mt-8">
        <AdminProductForm />
      </div>
    </div>
  );
}
