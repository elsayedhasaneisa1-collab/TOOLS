import { DEVELOPER_SIGNATURE, getBotConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

const FEATURES = [
  { title: "✨ الزخرفة الاحترافية", desc: "أكثر من 35 شكلاً للعربية والإنجليزية والأرقام والجمل مع الرموز والفواصل." },
  { title: "🤍 البايوهات والنبذات", desc: "مكتبة ثابتة شاملة لبايوهات إنستجرام وتليجرام، الحب، الكبرياء، والغموض." },
  { title: "🎂 العمر والأبراج", desc: "حساب دقيق للعمر والأيام المتبقية لعيد الميلاد ومعرفة البرج محلياً." },
  { title: "🎭 الملصقات والفويزات", desc: "ملصقات WebP ومقاطع صوتية MP3 مضمّنة محلياً بدون أي تخزين خارجي." },
  { title: "🔮 الخيرة الترفيهية", desc: "رسائل إيجابية وحكم للتسلية فقط مع تنبيه واضح في كل رسالة." },
  { title: "📥 مركز التحميل والأدوات", desc: "تحليل الروابط العامة بأمان SSRF وتكامل 8 خدمات APIs مجانية." },
];

export default function HomePage() {
  const config = getBotConfig();
  const botLink = config.botUsername ? `https://t.me/${config.botUsername}` : null;

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-between px-6 py-12">
      <div className="space-y-10">
        <header className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-zinc-900 via-black to-purple-950/60 p-8 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-500/15 px-4 py-1.5 text-xs font-medium text-purple-200">
              ⚡ Next.js App Router • Telegram Webhook • Stateless
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-zinc-300">
              {config.maintenanceMode ? "🟠 وضع الصيانة مُفعّل" : "🟢 الخدمة جاهزة"}
            </span>
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            🤍 بوت تليجرام العربي الشامل
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-300">
            منظومة خدمات تليجرام عربية متكاملة تعتمد على لوحة مفاتيح ReplyKeyboardMarkup أسفل المحادثة،
            وتعمل ببنية Stateless كاملة على Vercel Serverless دون أي قواعد بيانات أو تخزين لبيانات المستخدمين.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {botLink ? (
              <a
                href={botLink}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500"
              >
                فتح البوت على تليجرام ↗
              </a>
            ) : null}
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-200">
              مسار Webhook: <code className="text-purple-300">/api/telegram</code>
            </div>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 transition hover:border-purple-500/40"
            >
              <h2 className="text-base font-semibold text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <h2 className="text-lg font-semibold text-white">🛡️ جاهزية متغيرات البيئة</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-zinc-800 bg-black/50 p-3 text-sm">
              <div className="text-zinc-400">BOT_TOKEN</div>
              <div className="mt-1 font-semibold text-white">{config.botToken ? "مضبوط ✅" : "غير مضبوط ⚠️"}</div>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-black/50 p-3 text-sm">
              <div className="text-zinc-400">WEBHOOK_SECRET</div>
              <div className="mt-1 font-semibold text-white">{config.webhookSecret ? "مضبوط ✅" : "غير مضبوط ⚠️"}</div>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-black/50 p-3 text-sm">
              <div className="text-zinc-400">ADMIN_IDS</div>
              <div className="mt-1 font-semibold text-white">
                {config.adminIds.size > 0 ? `${config.adminIds.size} معرّف ✅` : "غير مضبوط ⚠️"}
              </div>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-black/50 p-3 text-sm">
              <div className="text-zinc-400">BOT_USERNAME</div>
              <div className="mt-1 font-semibold text-white">{config.botUsername ? "مضبوط ✅" : "اختياري ℹ️"}</div>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-10 border-t border-zinc-800/80 pt-6 text-center text-sm text-zinc-400">
        <span className="font-medium text-purple-300">{DEVELOPER_SIGNATURE}</span>
      </footer>
    </main>
  );
}
