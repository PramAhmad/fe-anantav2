import Image from "next/image";
import MobileBottomNav from "@/app/src/components/MobileBottomNav";

type EduItem = {
  id: number;
  title: string;
  embedUrl: string;
  youtubeUrl: string;
};

const dummyEdukasi: EduItem[] = [
  {
    id: 1,
    title: "Belajar Isyarat Dasar - Salam dan Sapaan",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 2,
    title: "Belajar Isyarat Dasar - Angka dan Huruf",
    embedUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
    youtubeUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
  },
  {
    id: 3,
    title: "Belajar Isyarat Dasar - Percakapan Harian",
    embedUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ",
    youtubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
  },
  {
    id: 4,
    title: "Belajar Isyarat Dasar - Ekspresi dan Emosi",
    embedUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
    youtubeUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
  },
];

export default function EduPage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 sm:py-8 md:pt-20">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/green.jpg')" }}
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(8,34,24,.58),rgba(8,34,24,.66),rgba(8,34,24,.72))]" />

      <div className="mx-auto w-full max-w-6xl">
        <section className="px-1 py-12 pb-24 sm:px-2 sm:py-16 md:pb-16">
          <div className="rounded-2xl border border-white/30 bg-[#fffdf8] p-4 sm:p-5">
            <div className="flex items-center gap-3 sm:gap-4">
              <Image
                src="/p.png"
                alt="Maskot Edukasi Ananta"
                width={72}
                height={72}
                priority
                className="h-16 w-16 shrink-0 object-contain opacity-95 sm:h-18 sm:w-18"
              />
              <div>
                <h1 className="text-2xl font-extrabold text-emerald-900 sm:text-3xl">Edukasi Ananta</h1>
                <p className="mt-1 max-w-3xl text-sm leading-relaxed text-emerald-900/80 sm:text-base">
                  Konten pembelajaran bahasa isyarat untuk membantu interaksi yang
                  inklusif antara teman tuli dan non-tuli.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {dummyEdukasi.map((item) => (
              <article
                key={item.id}
                className="flex h-full flex-col gap-3 rounded-xl border border-white/30 bg-[#fffdf8] p-3"
              >
                <h2 className="min-h-14 text-lg font-bold leading-tight text-emerald-950">{item.title}</h2>
                <iframe
                  width="100%"
                  height="200"
                  className="rounded-xl border border-emerald-100"
                  src={item.embedUrl}
                  title={item.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
                <a
                  href={item.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex w-fit items-center rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100"
                >
                  Lihat
                </a>
              </article>
            ))}
          </div>
        </section>
      </div>

      <MobileBottomNav />
    </main>
  );
}
