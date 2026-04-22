"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import Input from "../components/input";
import { useUserStore } from "../../lib/stores/user-store";

export default function LoginPage() {
  const router = useRouter();
  const login = useUserStore((state) => state.login);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setErrorMessage("");
      await login(data);
      router.replace("/");
      router.refresh();
      window.location.assign("/");
    } catch (error) {
      setErrorMessage(error.message || "Unable to sign in");
    }
  };

  return (
    <div className="mx-auto w-full max-w-screen-sm lg:max-w-2xl px-0 sm:px-6 py-10 md:py-20">
      <div className="bg-paper border-thicker border-ink p-8 shadow-block">
        <div className="inline-block bg-pop-lime border-thick px-3 py-1 font-mono-tag shadow-block-sm">
          Have An Account
        </div>
        <h1 className="mt-4 font-display text-5xl uppercase tracking-tighter">
          Sign in
        </h1>

        <form
          className="mt-8 space-y-4"
          method="post"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label="Email or phone"
            type="text"
            {...register("emailOrPhone", {
              required: "Email or phone is required",
            })}
          />
          {errors.emailOrPhone && (
            <p className="text-pop-pink text-xs mt-1">
              {errors.emailOrPhone.message}
            </p>
          )}

          <Input
            label="Password"
            type="password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p className="text-pop-pink text-xs">{errors.password.message}</p>
          )}
          {errorMessage && (
            <p className="text-pop-pink text-xs">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="w-full bg-ink text-paper border-thick py-3 font-display text-lg uppercase tracking-wider shadow-block hover-press transition-all"
          >
            Sign in →
          </button>
        </form>

        <p className="mt-4 text-sm opacity-70">
          Use the email or phone and password you registered with.
        </p>

        <div className="my-6 flex items-center gap-3 font-mono-tag text-xs">
          <span className="flex-1 border-t-thick" />
          OR
          <span className="flex-1 border-t-thick" />
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => signIn("google")}
            className="w-full border-thick bg-pop-yellow py-3 font-mono-tag shadow-block-sm hover-pop"
          >
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
