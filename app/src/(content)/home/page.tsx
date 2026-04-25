"use client";

import Image from "next/image";
import { useRef } from "react";
import FeatureCard from "./_components/FeatureCard";
import MobileBottomNav from "@/app/src/components/MobileBottomNav";



export default function HomePage() {
    const featureRef = useRef<HTMLElement | null>(null);
    const featuresCard = [
        {
            href: "/gesture",
            title: "Translator Gestur",
            subtitle: "Terjemahkan gerakan tangan menjadi informasi yang mudah dipahami.",
            tone: "bg-emerald-100 text-emerald-800",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-8 w-8"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                    />
                </svg>
            ),
        },
        {
            href: "/voice",
            title: "Translator Suara",
            subtitle: "Ubah ucapan jadi teks agar percakapan lebih cepat dan inklusif.",
            tone: "bg-sky-100 text-sky-800",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-8 w-8"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                    />
                </svg>
            ),
        },
        {
            href: "/edu",
            title: "Edukasi Isyarat",
            subtitle: "Belajar bahasa isyarat dasar secara bertahap dengan materi praktis.",
            tone: "bg-amber-100 text-amber-800",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-8 w-8"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                    />
                </svg>
            ),
        },
    ];

    const scrollToFeature = () => {
        featureRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <main className="relative min-h-screen overflow-hidden md:pt-20">
            <div
                className="absolute inset-0 -z-20 bg-cover bg-center"
                style={{ backgroundImage: "url('/green.jpg')" }}
            />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(8,34,24,.58),rgba(8,34,24,.66),rgba(8,34,24,.72))]" />

            <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-6 py-10 text-center">
                <Image src="/LOGO.png" alt="Logo Ananta" width={160} height={160} priority />
                <h1 className="mt-6 text-5xl font-black tracking-tight text-white sm:text-6xl">
                    Ananta
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/95 sm:text-xl">
                    Hilangkan batasan komunikasi. Kami hadir untuk membantu kamu
                    berinteraksi dengan lebih mudah bersama teman, keluarga, dan siapa pun.
                </p>

                <button
                    type="button"
                    onClick={scrollToFeature}
                    className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/90 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-emerald-900 transition hover:bg-white"
                >
                    Swipe Up
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-4 w-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 14l5-5 5 5"
                        />
                    </svg>
                </button>
            </section>

            <section ref={featureRef} className="mx-auto w-full max-w-6xl px-6 pb-24 md:pb-16">
                <div className="rounded-3xl border border-white/40 bg-[#e8f2eb] p-6 sm:p-8">
                    <h2 className="text-center text-3xl font-extrabold text-emerald-900 sm:text-4xl">
                        Pilih Fitur Ananta
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-emerald-900/80 sm:text-base">
                        Fokus kami adalah membantu komunikasi tanpa batas lewat gestur,
                        suara, dan edukasi isyarat.
                    </p>

                    <div className="mt-8 rounded-2xl border border-emerald-200/60 bg-[#f3f8f4] p-3 sm:p-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            {featuresCard.map((feature) => (
                                <FeatureCard
                                    key={feature.href}
                                    href={feature.href}
                                    title={feature.title}
                                    subtitle={feature.subtitle}
                                    tone={feature.tone}
                                    icon={feature.icon}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <MobileBottomNav />
        </main>
    );
}
