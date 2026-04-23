"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../components/input";
import { useUserStore } from "../../lib/stores/user-store";

export default function RegisterPage() {
    const router = useRouter();
    const registerUser = useUserStore((state) => state.register);
    const [errorMessage, setErrorMessage] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            password: "",
            address: "",
            storeName: "",
            role: "customer",
        },
    });

    // Watch the role , help styling the buttons corectly
    const selectedRole = watch("role");

    const onSubmit = async (data) => {
        try {
            setErrorMessage("");
            await registerUser(data);
            router.replace("/");
            router.refresh();
            window.location.assign("/");
        } catch (error) {
            console.log(error.message);
            setErrorMessage("Unable to register, Please try Again");
        }
    };

    return (

        <div className="mx-auto w-full max-w-screen-sm lg:max-w-2xl px-0 sm:px-6 py-10 md:py-20">

            <div className="bg-paper border-thicker border-ink p-8 shadow-block">
                <div className="inline-block bg-pop-pink border-thick px-3 py-1 font-mono-tag shadow-block-sm">
                    New here
                </div>

                <h1 className="mt-4 font-display text-5xl uppercase tracking-tighter">
                    Create account
                </h1>

                <form className="mt-8 space-y-4" method="post" onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        label="Full name"
                        {...register("fullName", { required: "Name is required" })}
                    />
                    {errors.fullName && <p className="text-pop-pink text-xs">{errors.fullName.message}</p>}

                    <Input
                        label="Email"
                        type="email"
                        {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && <p className="text-pop-pink text-xs">{errors.email.message}</p>}

                    <Input
                        label="Phone"
                        type="text"
                        {...register("phone", { required: "Phone is required" })}
                    />
                    {errors.phone && <p className="text-pop-pink text-xs">{errors.phone.message}</p>}

                    <Input
                        label="Password"
                        type="password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Too short!" },
                        })}
                    />
                    {errors.password && <p className="text-pop-pink text-xs">{errors.password.message}</p>}

                    <Input
                        label="Address"
                        {...register("address")}
                    />

                    {selectedRole === "seller" && (
                        <Input
                            label="Store name"
                            {...register("storeName", { required: "Store name is required for sellers" })}
                        />
                    )}
                    {errors.storeName && <p className="text-pop-pink text-xs">{errors.storeName.message}</p>}
                    {errorMessage && <p className="text-pop-pink text-xs">{errorMessage}</p>}


                    <div>
                        <span className="font-mono-tag block mb-2">I want to join as {selectedRole}</span>
                        <div className="grid grid-cols-2 gap-2">
                            {["customer", "seller"].map((r) => (
                                <button
                                    type="button"
                                    key={r}

                                    onClick={() => setValue("role", r)}
                                    className={`border-thick py-2 font-mono-tag shadow-block-sm hover-pop transition-all ${selectedRole === r
                                        ? "bg-ink text-paper"
                                        : r === "seller"
                                            ? "bg-pop-blue text-paper"
                                            : "bg-pop-yellow"
                                        }`}
                                >
                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-ink text-paper border-thick py-3 font-display text-lg uppercase tracking-wider shadow-block hover-press active:translate-y-1 transition-all"
                    >
                        Create account →
                    </button>
                </form>

                <div className="mt-6 text-sm">
                    Have an account?{" "}
                    <Link href="/signin" className="underline font-bold">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
