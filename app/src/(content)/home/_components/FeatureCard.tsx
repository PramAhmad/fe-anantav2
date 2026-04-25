import Link from "next/link";

type FeatureCardProps = {
    href: string;
    title: string;
    subtitle: string;
    tone: string;
    icon: React.ReactNode;
};

export default function FeatureCard({ href, title, subtitle, tone, icon }: FeatureCardProps) {
    return (
        <Link
            href={href}
            className="group relative w-full rounded-2xl border border-emerald-300/80 bg-[#fcfffc] p-5 transition-colors hover:bg-[#f5fbf6]"
        >
            <div className={`mb-4 inline-flex rounded-xl p-3 ${tone}`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-emerald-950">{title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-emerald-900/80">{subtitle}</p>
            <div className="mt-4 text-sm font-semibold text-emerald-800">
                Buka fitur
                <span className="ml-1">→</span>
            </div>
        </Link>
    );
}