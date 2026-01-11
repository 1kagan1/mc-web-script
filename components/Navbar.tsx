"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ id: string; username: string; email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();
  const [branding, setBranding] = useState({
    logoUrl: "/logo.png",
    title: "SkyBlock",
    subtitle: "KALİTELİ SUNUCU",
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Fetch current user
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          setUser(null);
          return;
        }
        const data = await res.json();
        setUser(data);
      } catch (error) {
        setUser(null);
      }
    };

    // Check admin status
    const checkAdmin = async () => {
      try {
        const res = await fetch("/api/admin/check");
        if (!res.ok) {
          setIsAdmin(false);
          return;
        }
        const data = await res.json();
        setIsAdmin(data.isAdmin);
      } catch (error) {
        setIsAdmin(false);
      }
    };

    fetchUser();
    checkAdmin();
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/public/settings");
        if (!res.ok) return;
        const data = await res.json();
        setBranding({
          logoUrl: data.logo_url || "/logo.png",
          title: data.site_name || "SkyBlock",
          subtitle: data.site_subtitle || "KALİTELİ SUNUCU",
        });
      } catch (error) {
        // fallback to defaults
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-user-menu]')) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-black/90 shadow-lg shadow-black/20 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <a href="/" className="group flex flex-shrink-0 items-center gap-3">
            <div className="relative">
              <img
                src={branding.logoUrl || "/logo.png"}
                alt="Logo"
                className="h-10 w-10 transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute -inset-1 rounded-full bg-orange-500/20 opacity-0 blur transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="hidden flex-col sm:flex">
              <span className="text-lg font-bold tracking-tight text-white">
                {branding.title}
              </span>
              <span className="text-[10px] font-medium text-orange-400">
                {branding.subtitle}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            <a
              href="/"
              className="group relative px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
            >
              Ana Sayfa
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300 group-hover:w-full" />
            </a>
            <a
              href="/market"
              className="group relative px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
            >
              Market
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300 group-hover:w-full" />
            </a>
            <a
              href="/news"
              className="group relative px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
            >
              Haberler
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300 group-hover:w-full" />
            </a>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden items-center gap-3 md:flex">
            {user && isAdmin && (
              <a
                href="/admin"
                className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
              >
                👨‍💼 Admin Panel
              </a>
            )}
            {user ? (
              <div className="relative" data-user-menu>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-300 transition-all hover:border-orange-500/50 hover:bg-orange-500/20"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{user.username}</span>
                  {isAdmin && <span className="text-xs ml-1 px-2 py-0.5 rounded bg-white/20 text-white">Admin</span>}
                  <svg className={`h-4 w-4 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-white/10 bg-zinc-900/95 backdrop-blur-xl shadow-lg">
                    <div className="border-b border-white/10 p-4">
                      <p className="text-xs text-zinc-400">Giriş yapan hesap</p>
                      <p className="mt-1 font-semibold text-white">{user.username}</p>
                      <p className="mt-1 text-sm text-zinc-400">{user.email}</p>
                      {isAdmin && <p className="mt-2 text-xs px-2 py-1 rounded bg-white/20 text-white inline-block">👨‍💼 Admin Erişimi Aktif</p>}
                    </div>
                    <div className="space-y-1 p-2">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <a
                  href="/auth/login"
                  className="group relative overflow-hidden rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all hover:text-orange-100"
                >
                  <span className="relative z-10">Giriş Yap</span>
                  <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </a>
                <a
                  href="/auth/register"
                  className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-orange-500/25 transition-all hover:shadow-orange-500/40"
                >
                  <span className="relative z-10">Kayıt Ol</span>
                  <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="group relative h-10 w-10 md:hidden"
            aria-label="Toggle menu"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="space-y-1.5">
                <span
                  className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                    isOpen ? "translate-y-2 rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                    isOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                    isOpen ? "-translate-y-2 -rotate-45" : ""
                  }`}
                />
              </div>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-white/10 py-4">
            <div className="flex flex-col gap-2">
              <a
                href="/"
                className="group relative overflow-hidden rounded-lg px-4 py-3 text-sm font-medium text-zinc-300 transition-all hover:text-white"
              >
                <span className="relative z-10">Ana Sayfa</span>
                <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </a>
              <a
                href="/market"
                className="group relative overflow-hidden rounded-lg px-4 py-3 text-sm font-medium text-zinc-300 transition-all hover:text-white"
              >
                <span className="relative z-10">Market</span>
                <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </a>
              <a
                href="/news"
                className="group relative overflow-hidden rounded-lg px-4 py-3 text-sm font-medium text-zinc-300 transition-all hover:text-white"
              >
                <span className="relative z-10">Haberler</span>
                <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </a>
              <div className="mt-3 flex flex-col gap-2">
                {user ? (
                  <>
                    <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-4 py-3">
                      <p className="text-xs text-zinc-400">Giriş yapan hesap</p>
                      <p className="mt-1 font-semibold text-white">{user.username}</p>
                      <p className="mt-1 text-xs text-zinc-400">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="group relative overflow-hidden rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm font-semibold text-red-400 transition-all hover:border-red-500/50 hover:bg-red-500/20"
                    >
                      <span className="relative z-10">Çıkış Yap</span>
                      <div className="absolute inset-0 opacity-0 transition-opacity duration-300" />
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="/auth/login"
                      className="group relative overflow-hidden rounded-lg border border-white/10 px-4 py-3 text-center text-sm font-semibold text-white transition-all hover:border-white/20"
                    >
                      <span className="relative z-10">Giriş Yap</span>
                      <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </a>
                    <a
                      href="/auth/register"
                      className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 text-center text-sm font-semibold text-black shadow-lg shadow-orange-500/25 transition-all hover:shadow-orange-500/40"
                    >
                      <span className="relative z-10">Kayıt Ol</span>
                      <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
