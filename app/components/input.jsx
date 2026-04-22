import React, { forwardRef } from "react";

const Input = forwardRef(function Input({ label, ...props }, ref) {
    return (
        <label className="block">
            <span className="font-mono-tag block mb-1">{label}</span>
            <input
                ref={ref}
                {...props}
                className="w-full border-thick bg-background px-3 py-2 outline-none focus:bg-white transition-colors"
            />
        </label>
    );
});

export default Input;