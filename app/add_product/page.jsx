"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import Input from "../components/input";
import { requestJSON } from "../../lib/api-client";
import { useUserStore } from "../../lib/stores/user-store";

function buildProductPayload(values) {
  const tags = (values.tags || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const attributes = (values.attributePairs || []).reduce((accumulator, pair) => {
    const key = pair?.key?.trim();
    const value = pair?.value?.trim();

    if (key && value) {
      accumulator[key] = value;
    }

    return accumulator;
  }, {});

  const imageUrl = values.imageUrl?.trim();

  return {
    name: values.name?.trim() || "",
    description: values.description?.trim() || "",
    price: Number.isFinite(values.price) ? values.price : Number(values.price) || 0,
    images: imageUrl ? [imageUrl] : [],
    category: values.category || "",
    stock: Number.isFinite(values.stock) ? values.stock : Number(values.stock) || 0,
    isActive: values.isActive ?? true,
    tags,
    attributes,
  };
}

export default function AddProductPage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      imageUrl: "",
      category: "",
      stock: 0,
      tags: "",
      isActive: true,
      attributePairs: [{ key: "", value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributePairs",
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        setIsLoadingCategories(true);
        const data = await requestJSON("/api/categories", { method: "GET" });
        setCategories(data.categories || []);
      } catch (error) {
        setErrorMessage(error.message || "Failed to load categories.");
      } finally {
        setIsLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    if (user && !["seller", "admin"].includes(user.role)) {
      router.replace("/");
    }
  }, [router, user]);

  const watchedValues = useWatch({ control });
  const payloadPreview = buildProductPayload(watchedValues);

  async function handleCreateCategory() {
    if (!newCategoryName.trim()) {
      alert("Category name is required");
      return;
    }

    try {
      setIsCreatingCategory(true);
      const newCategory = await requestJSON("/api/categories", {
        method: "POST",
        body: JSON.stringify({
          name: newCategoryName.trim(),
          description: newCategoryDescription.trim(),
        }),
      });

      setCategories([...categories, newCategory.category]);
      setValue("category", newCategory.category._id);
      setNewCategoryName("");
      setNewCategoryDescription("");
      setShowCreateCategory(false);
      setSuccessMessage("Category created successfully!");
    } catch (error) {
      alert(error.message || "Failed to create category");
    } finally {
      setIsCreatingCategory(false);
    }
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-8">
        <div className="border-thicker border-ink bg-paper p-6 font-mono-tag shadow-block-sm">
          Loading product dashboard...
        </div>
      </div>
    );
  }

  const dashboardHref = user.role === "admin" ? "/admin" : "/seller";

  async function onSubmit(values) {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      const payload = buildProductPayload(values);

      await requestJSON("/api/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setSuccessMessage("Product created successfully.");
      reset({
        name: "",
        description: "",
        price: 0,
        imageUrl: "",
        category: "",
        stock: 0,
        tags: "",
        isActive: true,
        attributePairs: [{ key: "", value: "" }],
      });
      router.refresh();
    } catch (error) {
      setErrorMessage(error.message || "Failed to create product.");
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-thicker border-ink bg-paper p-8 shadow-block-sm">
        <div>
          <div className="font-mono-tag opacity-70">Product dashboard</div>
          <h1 className="mt-2 font-display text-5xl uppercase tracking-tighter md:text-6xl">
            Add listing
          </h1>
          <p className="mt-4 max-w-2xl text-sm md:text-base">
            Create a product using the same object structure expected by the
            product model. For now the listing uses a direct image URL.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="border-thick bg-pop-lime px-4 py-2 font-mono-tag shadow-block-sm">
            {user.role} access
          </span>
          <Link
            href={dashboardHref}
            className="border-thick bg-pop-yellow px-4 py-2 font-mono-tag shadow-block-sm hover-pop"
          >
            Back to dashboard
          </Link>
        </div>
      </header>

      {(errorMessage || successMessage) && (
        <div
          className={`mt-8 border-thick p-4 font-mono-tag shadow-block-sm ${errorMessage ? "bg-pop-pink" : "bg-pop-lime"
            }`}
        >
          {errorMessage || successMessage}
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <section className="space-y-6 lg:col-span-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="border-thicker border-ink bg-paper p-6 shadow-block-sm md:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-display text-2xl uppercase">
                  Listing details
                </div>
                <div className="mt-1 font-mono-tag opacity-70">
                  Required fields match the create-product payload
                </div>
              </div>
              <label className="inline-flex items-center gap-3 border-thick bg-pop-yellow px-4 py-3 font-mono-tag shadow-block-sm">
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="size-4 accent-black"
                />
                Active listing
              </label>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Input
                  label="Product name"
                  type="text"
                  {...register("name", { required: "Product name is required" })}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-pop-pink">{errors.name.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block">
                  <span className="mb-1 block font-mono-tag">Description</span>
                  <textarea
                    rows={6}
                    {...register("description", {
                      required: "Description is required",
                    })}
                    className="w-full border-thick bg-background px-3 py-2 outline-none transition-colors focus:bg-white"
                  />
                </label>
                {errors.description && (
                  <p className="mt-1 text-xs text-pop-pink">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <Input
                label="Price"
                type="number"
                step="0.01"
                min="0"
                {...register("price", {
                  required: "Price is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Price cannot be negative" },
                })}
              />
              <div>
                <label className="block">
                  <span className="mb-1 block font-mono-tag">Category</span>
                  <div className="flex gap-2">
                    <select
                      {...register("category")}
                      className="flex-1 border-thick bg-background px-3 py-2 outline-none transition-colors focus:bg-white"
                      disabled={isLoadingCategories}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowCreateCategory(true)}
                      className="border-thick bg-pop-blue px-4 py-2 font-mono-tag text-paper shadow-block-sm hover-pop"
                    >
                      +New
                    </button>
                  </div>
                </label>
                {errors.category && (
                  <p className="mt-1 text-xs text-pop-pink">
                    {errors.category.message}
                  </p>
                )}
                {categories.length === 0 && !isLoadingCategories && (
                  <p className="mt-1 text-xs text-pop-pink">
                    No categories available. Click &quot;+New&quot; to create one.
                  </p>
                )}
              </div>

              <Input
                label="Image URL"
                type="url"
                placeholder="https://example.com/product.jpg (Optional)"
                {...register("imageUrl", {
                  pattern: {
                    value: /^https?:\/\/.+/i,
                    message: "Enter a valid image URL (or leave blank)",
                  },
                })}
              />
              <Input
                label="Stock"
                type="number"
                min="0"
                step="1"
                {...register("stock", {
                  required: "Stock is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Stock cannot be negative" },
                })}
              />

              <div className="md:col-span-2">
                <Input
                  label="Tags"
                  type="text"
                  placeholder="streetwear, limited, summer"
                  {...register("tags")}
                />
                <p className="mt-2 text-xs opacity-70">
                  Separate tags with commas. They will be sent as an array of strings.
                </p>
              </div>
            </div>

            <div className="mt-8 border-thick bg-pop-beige p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-display text-xl uppercase">Attributes</div>
                  <div className="mt-1 font-mono-tag opacity-70">
                    Sent as a string-to-string object
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => append({ key: "", value: "" })}
                  className="border-thick bg-pop-blue px-4 py-2 font-mono-tag text-paper shadow-block-sm hover-pop"
                >
                  Add attribute
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid gap-3 border-thick bg-paper p-4 md:grid-cols-[1fr_1fr_auto]"
                  >
                    <Input
                      label="Key"
                      type="text"
                      {...register(`attributePairs.${index}.key`)}
                    />
                    <Input
                      label="Value"
                      type="text"
                      {...register(`attributePairs.${index}.value`)}
                    />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      className="self-end border-thick bg-pop-pink px-4 py-2 font-mono-tag shadow-block-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="border-thick bg-ink px-6 py-3 font-display text-lg uppercase text-paper shadow-block-sm hover-press disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Creating..." : "Create product"}
              </button>
              <Link
                href={dashboardHref}
                className="border-thick bg-paper px-6 py-3 font-mono-tag shadow-block-sm hover-pop"
              >
                Cancel
              </Link>
            </div>
          </form>
        </section>

        <aside className="space-y-6 lg:col-span-4">
          <div className="border-thicker border-ink bg-pop-blue p-6 text-paper shadow-block-sm">
            <div className="font-display text-2xl uppercase">Model preview</div>
            <p className="mt-3 text-sm">
              This is the exact object shape sent to `POST /api/products`.
            </p>
            <pre className="mt-4 overflow-x-auto border-thick border-ink bg-ink p-4 font-mono text-xs text-pop-lime">
              {JSON.stringify(payloadPreview, null, 2)}
            </pre>
          </div>

          <div className="border-thicker border-ink bg-paper p-6 shadow-block-sm">
            <div className="font-display text-2xl uppercase">Field notes</div>
            <div className="mt-4 space-y-3 text-sm">
              <p>
                `images` comes from a single image URL input and is stored as an array.
              </p>
              <p>
                `seller` is attached on the server from the logged-in user token.
              </p>
              <p>
                `averageRating` and `reviewCount` stay model-managed and are not part of
                the create form.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {showCreateCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md border-thick border-ink bg-paper p-6 shadow-block-lg">
            <h2 className="font-display text-2xl uppercase">Create Category</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block">
                  <span className="mb-1 block font-mono-tag">Category Name *</span>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full border-thick bg-background px-3 py-2 outline-none transition-colors focus:bg-white"
                    placeholder="e.g., Electronics, Fashion"
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="mb-1 block font-mono-tag">Description</span>
                  <textarea
                    value={newCategoryDescription}
                    onChange={(e) => setNewCategoryDescription(e.target.value)}
                    rows={3}
                    className="w-full border-thick bg-background px-3 py-2 outline-none transition-colors focus:bg-white"
                    placeholder="Optional description for this category"
                  />
                </label>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleCreateCategory}
                disabled={isCreatingCategory || !newCategoryName.trim()}
                className="flex-1 border-thick bg-ink px-4 py-2 font-mono-tag text-paper shadow-block-sm hover-press disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCreatingCategory ? "Creating..." : "Create"}
              </button>
              <button
                onClick={() => {
                  setShowCreateCategory(false);
                  setNewCategoryName("");
                  setNewCategoryDescription("");
                }}
                className="flex-1 border-thick bg-paper px-4 py-2 font-mono-tag shadow-block-sm hover-pop"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
