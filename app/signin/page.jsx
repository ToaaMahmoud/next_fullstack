"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Input from "../components/input";

export default function LoginPage() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
            role: "customer",
        },
    });
    const selectedRole = watch("role");

    const onSubmit = (data) => {
        console.log("Logging in with:", data);
    };

    return (

        <div className="mx-auto w-full max-w-screen-sm lg:max-w-2xl px-0 sm:px-6 py-10 md:py-20">
            <div className="bg-paper border-thicker border-ink p-8 shadow-block">
                <div className="inline-block bg-pop-lime border-thick px-3 py-1 font-mono-tag shadow-block-sm">
                    Have An Account
                </div>
                <h1 className="mt-4 font-display text-5xl uppercase tracking-tighter">Sign in</h1>

                <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        label="Email"
                        type="email"
                        {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && <p className="text-pop-pink text-xs mt-1">{errors.email.message}</p>}

                    <Input
                        label="Password"
                        type="password"
                        {...register("password", { required: true })}
                    />
                    {errors.password && <p className="text-pop-pink text-xs">{errors.password.message}</p>}


                    <div>
                        <span className="font-mono-tag block mb-2">Sign in as {selectedRole}</span>
                        <div className="grid grid-cols-3 gap-2">
                            {["customer", "seller", "admin"].map((r) => (
                                <button
                                    type="button"
                                    key={r}
                                    onClick={() => setValue("role", r)}
                                    className={`border-thick py-2 font-mono-tag shadow-block-sm hover-pop transition-all ${selectedRole === r
                                        ? "bg-ink text-paper"
                                        : r === "admin"
                                            ? "bg-pop-pink"
                                            : r === "seller"
                                                ? "bg-pop-blue text-paper"
                                                : "bg-pop-yellow"
                                        }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-ink text-paper border-thick py-3 font-display text-lg uppercase tracking-wider shadow-block hover-press transition-all"
                    >
                        Sign in →
                    </button>
                </form>

                <div className="my-6 flex items-center gap-3 font-mono-tag text-xs">
                    <span className="flex-1 border-t-thick" />
                    OR
                    <span className="flex-1 border-t-thick" />
                </div>

                <div className="space-y-3">
                    <button className="w-full border-thick bg-pop-yellow py-3 font-mono-tag shadow-block-sm hover-pop">
                        Continue with Google
                    </button>
                </div>

                <div className="mt-6 text-sm">
                    New here?{" "}
                    <Link href="/signup" className="underline font-bold">
                        Create an account
                    </Link>
                </div>
            </div>
        </div>
    );
}

