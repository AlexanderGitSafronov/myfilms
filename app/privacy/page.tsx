import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Политика конфиденциальности",
  description: "Как MyFilms собирает, использует и защищает ваши данные",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 text-zinc-300">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-6">
        <ArrowLeft className="h-3.5 w-3.5" />
        На главную
      </Link>

      <h1 className="text-3xl font-bold text-white mb-2">Политика конфиденциальности</h1>
      <p className="text-sm text-zinc-500 mb-8">Последнее обновление: 22 апреля 2026 г.</p>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">1. Общие положения</h2>
          <p>
            Настоящая Политика конфиденциальности описывает, как сервис MyFilms
            (далее — «Сервис») собирает, обрабатывает и защищает персональные данные
            пользователей. Используя Сервис, вы соглашаетесь с условиями данной Политики.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">2. Какие данные мы собираем</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Имя, имя пользователя и email — при регистрации</li>
            <li>Пароль — хранится в зашифрованном виде (bcrypt)</li>
            <li>Фото профиля, био — добавляются вами по желанию</li>
            <li>Списки фильмов, оценки, комментарии, лайки</li>
            <li>IP-адрес и технические данные браузера — для безопасности</li>
            <li>Данные авторизации через Google (если используете) — имя, email, аватар</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">3. Как мы используем данные</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Обеспечение работы Сервиса: авторизация, сохранение списков</li>
            <li>Показ персонализированного контента (лента, рекомендации)</li>
            <li>Связь с вами по важным вопросам (безопасность, изменения условий)</li>
            <li>Предотвращение мошенничества и нарушений правил</li>
          </ul>
          <p className="mt-3">
            Мы не продаём ваши данные третьим лицам и не используем их
            для рекламных целей.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">4. Хранение данных</h2>
          <p>
            Данные хранятся на защищённых серверах с использованием современных
            средств шифрования. Пароли хешируются и не хранятся в открытом виде.
            Для хранения изображений используется Cloudinary. Данные о фильмах
            получаем из открытого API TMDB.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">5. Cookies</h2>
          <p>
            Сервис использует cookies для поддержания сессии авторизации и
            сохранения ваших настроек (язык интерфейса, выбор согласия).
            Подробнее — в разделе «Cookies» ниже. Продолжая использовать Сервис,
            вы соглашаетесь на использование cookies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">6. Ваши права</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Получить доступ к вашим данным через страницу профиля</li>
            <li>Изменить или удалить данные профиля в любое время</li>
            <li>Удалить аккаунт вместе со всем содержимым (списки, комментарии)</li>
            <li>Отозвать согласие на обработку данных</li>
          </ul>
          <p className="mt-3">
            Для удаления аккаунта или других запросов свяжитесь с нами:{" "}
            <a href="mailto:support@myfilms.app" className="text-red-400 hover:text-red-300">
              support@myfilms.app
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">7. Сторонние сервисы</h2>
          <p>
            Мы используем следующие сервисы: Google (OAuth авторизация),
            TMDB (каталог фильмов), Cloudinary (изображения), Railway
            (хостинг и база данных). Каждый из них имеет собственную
            политику конфиденциальности.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">8. Дети</h2>
          <p>
            Сервис не предназначен для лиц младше 13 лет. Мы сознательно
            не собираем данные несовершеннолетних.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">9. Изменения политики</h2>
          <p>
            Мы можем обновлять эту Политику. При значительных изменениях
            уведомим вас по email или через сам Сервис. Продолжение использования
            после обновления означает согласие с новой редакцией.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">10. Контакты</h2>
          <p>
            По вопросам о конфиденциальности:{" "}
            <a href="mailto:support@myfilms.app" className="text-red-400 hover:text-red-300">
              support@myfilms.app
            </a>
          </p>
        </section>

        <div className="pt-6 border-t border-white/5 flex gap-4 text-sm">
          <Link href="/terms" className="text-red-400 hover:text-red-300">Пользовательское соглашение →</Link>
        </div>
      </div>
    </div>
  );
}
