import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Пользовательское соглашение",
  description: "Условия использования сервиса MyFilms",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 text-zinc-300">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-6">
        <ArrowLeft className="h-3.5 w-3.5" />
        На главную
      </Link>

      <h1 className="text-3xl font-bold text-white mb-2">Пользовательское соглашение</h1>
      <p className="text-sm text-zinc-500 mb-8">Последнее обновление: 22 апреля 2026 г.</p>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">1. Принятие условий</h2>
          <p>
            Регистрируясь в сервисе MyFilms (далее — «Сервис»), вы подтверждаете,
            что прочитали, поняли и согласны соблюдать настоящее Соглашение.
            Если вы не согласны с условиями — не используйте Сервис.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">2. Описание Сервиса</h2>
          <p>
            MyFilms — это платформа для создания, хранения и обмена списками
            фильмов. Сервис предоставляется бесплатно «как есть» (as is),
            без каких-либо гарантий непрерывной работы.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">3. Учётная запись</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Вы несёте ответственность за безопасность своего пароля</li>
            <li>Не передавайте доступ к аккаунту третьим лицам</li>
            <li>Один пользователь — одна учётная запись</li>
            <li>При подозрительной активности сообщите нам по email</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">4. Правила поведения</h2>
          <p className="mb-2">Запрещено:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Публиковать нелегальный, оскорбительный или порнографический контент</li>
            <li>Нарушать авторские права третьих лиц</li>
            <li>Использовать Сервис для спама, рекламы или мошенничества</li>
            <li>Попытки взлома, сканирования уязвимостей, DDoS-атак</li>
            <li>Автоматизированный сбор данных (скрейпинг) без разрешения</li>
            <li>Создание нескольких аккаунтов с целью обхода блокировок</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">5. Контент пользователя</h2>
          <p>
            Вы сохраняете авторские права на контент, который публикуете
            (списки, комментарии, отзывы). Размещая контент, вы даёте Сервису
            право показывать его другим пользователям в рамках работы платформы.
          </p>
          <p className="mt-2">
            Мы оставляем за собой право удалить любой контент, нарушающий
            настоящее Соглашение, без предварительного уведомления.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">6. Данные о фильмах</h2>
          <p>
            Каталог фильмов предоставляется через API{" "}
            <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">
              The Movie Database (TMDB)
            </a>
            . Использование данных TMDB регулируется их собственными правилами.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">7. Ограничение ответственности</h2>
          <p>
            Сервис не несёт ответственности за:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>Временные перебои в работе или потерю данных</li>
            <li>Контент, размещаемый пользователями</li>
            <li>Точность информации о фильмах (данные TMDB)</li>
            <li>Ущерб от использования или невозможности использования Сервиса</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">8. Блокировка и удаление</h2>
          <p>
            Мы можем заблокировать или удалить аккаунт в случае нарушения
            настоящего Соглашения. Вы можете удалить свой аккаунт самостоятельно
            в любое время, написав на{" "}
            <a href="mailto:support@myfilms.app" className="text-red-400 hover:text-red-300">
              support@myfilms.app
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">9. Изменения</h2>
          <p>
            Мы можем изменять условия Соглашения. При значительных изменениях
            уведомим вас. Продолжение использования Сервиса означает согласие
            с новой редакцией.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">10. Применимое право</h2>
          <p>
            Споры разрешаются в соответствии с действующим законодательством.
            По всем вопросам:{" "}
            <a href="mailto:support@myfilms.app" className="text-red-400 hover:text-red-300">
              support@myfilms.app
            </a>
          </p>
        </section>

        <div className="pt-6 border-t border-white/5 flex gap-4 text-sm">
          <Link href="/privacy" className="text-red-400 hover:text-red-300">Политика конфиденциальности →</Link>
        </div>
      </div>
    </div>
  );
}
