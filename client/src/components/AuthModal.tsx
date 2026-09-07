import React, { useState } from "react";
import { useAppContext } from "../context/AppContext.tsx";
import { X, Mail, Lock, User, Phone } from "lucide-react";

export default function AuthModal() {
  const { isAuthModalOpen, setAuthModalOpen, login, register } =
    useAppContext();
  const [isLoginTab, setIsLoginTab] = useState<boolean>(true);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [phone, setPhone] = useState("");
  const [isOwner, setIsOwner] = useState<boolean>(false);

  const [formLoading, setFormLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setPhone("");
    setIsOwner(false);
  };

  const handleClose = () => {
    resetForm();
    setAuthModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    let success: boolean;

    if (isLoginTab) {
      success = await login(email, password);
    } else {
      success = await register(
        name,
        email,
        password,
        phone,
        isOwner ? "owner" : "user",
      );
    }

    setFormLoading(false);
    if (success) {
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={handleClose}></div>

      {/* Modal Container */}
      <div className="border-outline-variant/30 ambient-shadow transition-soft relative z-10 flex w-full max-w-md scale-100 transform flex-col overflow-hidden rounded-lg border bg-white">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="hover:text-primary absolute top-4 right-4 cursor-pointer text-black/55 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Header Tabs */}
        <div className="border-outline-variant/20 flex border-b">
          <button
            onClick={() => setIsLoginTab(true)}
            className={`transition-soft flex-1 cursor-pointer py-5 text-center text-xs font-medium tracking-widest ${
              isLoginTab
                ? "text-primary border-primary bg-surface-container-lowest border-b-2"
                : "hover:text-primary bg-surface-container-low/50 text-black/55"
            }`}
          >
            SIGN IN
          </button>
          <button
            onClick={() => setIsLoginTab(false)}
            className={`transition-soft flex-1 cursor-pointer py-5 text-center text-xs font-medium tracking-widest ${
              !isLoginTab
                ? "text-primary border-primary bg-surface-container-lowest border-b-2"
                : "hover:text-primary bg-surface-container-low/50 text-black/55"
            }`}
          >
            SIGN UP
          </button>
        </div>

        {/* Form Content */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col justify-between space-y-6 p-8"
        >
          <div>
            <div className="mb-8 text-center">
              <h2 className="font-display text-primary text-2xl font-medium tracking-tight">
                Welcome to QuickDine
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-black/55">
                Access your exclusive reservations and curated dining profile.
              </p>
            </div>

            <div className="space-y-5">
              {/* Name Field (Register Only) */}
              {!isLoginTab && (
                <div className="space-y-1">
                  <label className="block text-left text-[10px] font-medium tracking-wider text-black/55 uppercase">
                    FULL NAME
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pr-3 text-black/55">
                      <User size={16} />
                    </span>
                    <input
                      type="text"
                      required={!isLoginTab}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Sarah Jenkins"
                      className="border-outline-variant/60 focus:border-secondary w-full border-b bg-transparent pt-1 pb-2 pl-7 text-sm transition-colors focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-1">
                <label className="block text-left text-[10px] font-medium tracking-wider text-black/55 uppercase">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pr-3 text-black/55">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="border-outline-variant/60 focus:border-secondary w-full border-b bg-transparent pt-1 pb-2 pl-7 text-sm transition-colors focus:outline-none"
                  />
                </div>
              </div>

              {/* Phone Field (Register Only) */}
              {!isLoginTab && (
                <div className="space-y-1">
                  <label className="block text-left text-[10px] font-medium tracking-wider text-black/55 uppercase">
                    PHONE NUMBER (OPTIONAL)
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pr-3 text-black/55">
                      <Phone size={16} />
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="border-outline-variant/60 focus:border-secondary w-full border-b bg-transparent pt-1 pb-2 pl-7 text-sm transition-colors focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Password Field */}
              <div className="space-y-1">
                <label className="block text-left text-[10px] font-medium tracking-wider text-black/55 uppercase">
                  PASSWORD
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pr-3 text-black/55">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="border-outline-variant/60 focus:border-secondary w-full border-b bg-transparent pt-1 pb-2 pl-7 text-sm transition-colors focus:outline-none"
                  />
                </div>
              </div>

              {/* Owner Checkbox (Register Only) */}
              {!isLoginTab && (
                <div className="flex items-center gap-2.5 pt-2">
                  <input
                    type="checkbox"
                    id="isOwner"
                    checked={isOwner}
                    onChange={(e) => setIsOwner(e.target.checked)}
                    className="accent-secondary border-outline-variant/60 h-4 w-4 cursor-pointer rounded"
                  />
                  <label
                    htmlFor="isOwner"
                    className="cursor-pointer text-xs text-black/55 select-none"
                  >
                    I am a Restaurant Owner / Manager
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={formLoading}
              className="bg-primary hover:bg-secondary w-full cursor-pointer px-4 py-3.5 text-xs font-medium tracking-widest text-white uppercase transition-colors focus:outline-none disabled:opacity-75"
            >
              {formLoading
                ? "PROCESSING..."
                : isLoginTab
                  ? "LOGIN"
                  : "CREATE ACCOUNT"}
            </button>

            <p className="text-black/55/80 mt-4 text-center text-[11px] leading-relaxed">
              By signing in, you agree to our{" "}
              <a href="#" className="hover:text-primary underline">
                Terms of Service
              </a>
              .
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
