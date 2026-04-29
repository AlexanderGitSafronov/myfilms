export type Locale = "ru" | "uk" | "en";

export const translations = {
  ru: {
    // Nav
    home: "Главная",
    feed: "Лента",
    myLists: "Мои списки",
    addMovie: "Добавить",
    profile: "Профиль",
    signIn: "Войти",
    signOut: "Выйти",
    search: "Поиск",

    // Home (logged in)
    welcomeBack: "С возвращением,",
    movieCollectionOverview: "Ваша коллекция фильмов",
    addAMovie: "Добавить фильм",
    myProfile: "Мой профиль",
    yourLists: "Ваши списки",
    viewAll: "Смотреть все",
    noListsYet: "Списков ещё нет",
    startByAdding: "Начните с добавления фильмов в коллекцию",
    addFirstMovie: "Добавить первый фильм",
    films: "фильмов",
    film: "фильм",

    // Home (landing)
    tagline: "Рекомендации фильмов — просто",
    heroTitle1: "Делитесь любимыми фильмами",
    heroTitle2: "с друзьями",
    heroDesc: "Создавайте подборки фильмов, следите за тем, что смотрят друзья, и никогда не забывайте рекомендации.",
    getStarted: "Начать бесплатно",
    trendingThisWeek: "Популярно на этой неделе",
    featureOrganize: "Организация",
    featureOrganizeDesc: "Создавайте списки: «Хочу посмотреть», «Любимые», «Советую друзьям».",
    featureDiscover: "Поиск",
    featureDiscoverDesc: "Ищите фильмы через TMDB — автоматически получайте название, постер, рейтинг и жанры.",
    featureShare: "Поделиться",
    featureShareDesc: "Отправьте публичную ссылку на любой список. Друзья увидят всё, что вы рекомендуете.",

    // Login
    welcomeBackTitle: "С возвращением",
    signInToAccount: "Войдите в свой аккаунт MyFilms",
    continueWithGoogle: "Войти через Google",
    orContinueWithEmail: "или через email",
    email: "Email",
    password: "Пароль",
    invalidCredentials: "Неверный email или пароль",
    noAccount: "Нет аккаунта?",
    createOne: "Создать",

    // Register
    createAccount: "Создайте аккаунт",
    startSharing: "Начните делиться рекомендациями",
    continueWithGoogleReg: "Зарегистрироваться через Google",
    orRegisterWithEmail: "или через email",
    fullName: "Полное имя",
    username: "Имя пользователя",
    atLeast6Chars: "Минимум 6 символов",
    createAccountBtn: "Создать аккаунт",
    alreadyHaveAccount: "Уже есть аккаунт?",
    nameRequired: "Укажите имя",
    usernameRequired: "Укажите имя пользователя",
    usernameInvalid: "Только строчные буквы, цифры и подчёркивания",
    usernameShort: "Минимум 3 символа",
    emailRequired: "Укажите email",
    passwordRequired: "Укажите пароль",
    passwordShort: "Минимум 6 символов",
    somethingWentWrong: "Что-то пошло не так. Попробуйте снова.",

    // Search
    searchMovies: "Поиск фильмов",
    searchPlaceholder: "Поиск любого фильма...",
    add: "Добавить",
    noResults: "Нет результатов для",
    startTyping: "Начните вводить, чтобы найти фильмы",

    // Lists
    newList: "Новый список",
    noListsEmptyTitle: "Списков ещё нет",
    noListsEmptyDesc: "Создайте первый список для своей коллекции",
    createList: "Создать список",
    createNewList: "Создать новый список",
    listName: "Название списка",
    listNamePlaceholder: "например, Мои любимые",
    descriptionOptional: "Описание (необязательно)",
    listDescPlaceholder: "О чём этот список?",
    publicList: "Публичный список",
    publicListDesc: "Любой со ссылкой может просматривать",
    cancel: "Отмена",
    createListBtn: "Создать список",
    listCreated: "Список создан!",
    listDeleted: "Список удалён",
    failedToCreateList: "Не удалось создать список",
    failedToDeleteList: "Не удалось удалить список",
    deleteListConfirm: "Удалить этот список? Это действие необратимо.",
    list: "список",
    lists: "списков",
    public: "Публичный",
    private: "Приватный",

    // Profile
    myProfileTitle: "Мой профиль",
    viewPublicProfile: "Открыть публичный профиль",
    editProfile: "Редактировать профиль",
    saveChanges: "Сохранить",
    displayName: "Отображаемое имя",
    bio: "О себе",
    profileUpdated: "Профиль обновлён!",
    failedToUpdateProfile: "Не удалось обновить профиль",
    myListsSection: "Мои списки",
    likesLabel: "лайков",
    listsLabel: "списков",

    // Add movie
    addAMovieTitle: "Добавить фильм",
    addMovieDesc: "Найдите по названию или вставьте ссылку с любого сайта",
    searchTab: "Поиск",
    pasteLink: "Вставить ссылку",
    searchForMovie: "Поиск фильма...",
    pasteImdbLink: "Вставьте ссылку на фильм с любого сайта...",
    fetch: "Найти",
    changeMovie: "Сменить фильм",
    editDetails: "Редактировать",
    doneEditing: "Готово",
    addToList: "Добавить в список",
    addToListLabel: "Добавить в список",
    yourNote: "Ваша заметка (необязательно)",
    whyRecommend: "Почему вы советуете этот фильм?",
    addToListBtn: "Добавить в список",
    movieAdded: "Фильм добавлен в список!",
    couldNotFindMovie: "Не удалось найти фильм по этой ссылке",
    failedToFetch: "Не удалось загрузить фильм",
    failedToAdd: "Не удалось добавить фильм",
    searchOrPaste: "Найдите фильм или вставьте ссылку",
    supportsLinks: "Multiplex, Megogo, IMDB, TMDB и другие сайты",

    // List detail
    backToLists: "Мои списки",
    listNotFound: "Список не найден",
    movieRemoved: "Фильм удалён",
    failedToRemove: "Не удалось удалить фильм",
    linkCopied: "Ссылка скопирована!",
    copied: "Скопировано!",
    share: "Поделиться",
    noMoviesInList: "В этом списке пока нет фильмов",
    addAMovieBtn: "Добавить фильм",

    // Movie card
    remove: "Удалить",
    viewDetails: "Подробнее",

    // Share button
    shareList: "Поделиться",

    // Offline
    youreOffline: "Вы не в сети",
    offlineDesc: "Некоторый контент недоступен. Подключитесь к интернету.",
    backToApp: "Вернуться в MyFilms",

    // User page
    noPublicLists: "Нет публичных списков",
    editProfileBtn: "Редактировать профиль",

    // Movie page
    back: "Назад",
    movieNotFound: "Фильм не найден",
    movieOverview: "Описание",
    comments: "Комментарии",
    commentPlaceholder: "Поделитесь мнением...",
    commentAdded: "Комментарий добавлен!",
    noComments: "Комментариев пока нет. Будьте первым!",
    loginToLike: "Войдите, чтобы ставить лайки",
    source: "Источник",

    // Language
    language: "Язык",
    langRu: "Русский",
    langUk: "Українська",
    langEn: "English",

    // Nav extra
    explore: "Обзор",

    // Cookie banner
    cookieTitle: "Мы используем cookies",
    cookieDesc: "Мы используем cookies для работы авторизации и сохранения ваших настроек. Подробнее — в",
    cookiePrivacyLink: "политике конфиденциальности",
    cookieDecline: "Только необходимые",
    cookieAccept: "Принять все",
    closeAria: "Закрыть",

    // Splash / loader
    splashTagline: "Коллекция фильмов",

    // Legal footer
    allRightsReserved: "Все права защищены.",
    footerPrivacy: "Конфиденциальность",
    footerTerms: "Условия",
    footerContact: "Контакты",

    // Notifications
    notifications: "Уведомления",
    noNotificationsTitle: "Уведомлений пока нет",
    noNotificationsDesc: "Они появятся когда кто-то подпишется или лайкнет фильм",
    notifFollow: "подписался на вас",
    notifLike: "лайкнул ваш фильм",
    notifComment: "прокомментировал фильм",

    // Feed extra
    feedEmptyTitle: "Лента пуста",
    feedEmptyDesc: "Пока никто не добавил фильмы в публичные списки",
    loadMore: "Загрузить ещё",
    allFilters: "Все",
    addedTo: "добавил в",

    // Follow
    youAreFollowing: "Вы подписаны",
    follow: "Подписаться",

    // Watch status
    wantToWatch: "Хочу посмотреть",
    statusWatching: "Смотрю",
    statusWatched: "Посмотрел",
    addStatus: "Добавить статус",
    removeStatus: "Удалить статус",
    statusRemoved: "Статус удалён",
    myRating: "Моя оценка:",

    // Lists edit
    editListTitle: "Редактировать список",
    backToList: "Назад к списку",
    listNameLabel: "Название",
    descLabel: "Описание",
    descListPlaceholder: "Короткое описание списка...",
    listNamePlaceholderEdit: "Мои любимые фильмы",
    visibility: "Видимость",
    publicDesc: "Виден всем",
    privateDesc: "Только вам",
    listUpdated: "Список обновлён",
    saveError: "Ошибка сохранения",
    saving: "Сохранение...",
    saveBtn: "Сохранить",

    // User pages
    statListsLabel: "Списков",
    statFollowers: "Подписчиков",
    statFollowing: "Подписок",
    userListsHeading: "Списки",
    noPublicListsYet: "Публичных списков ещё нет",
    listEmpty: "Список пуст",

    // Movie page extra
    trailer: "Трейлер",
    similarMovies: "Похожие фильмы",
    cancelReply: "Отмена",
    reply: "Ответить",
    replyTo: "Ответить",

    // Profile achievements
    favoriteGenres: "Любимые жанры",
    achievements: "Достижения",
    statTotalMovies: "Всего фильмов",
    statWatched: "Посмотрел",
    statFollowersShort: "Подписчиков",
    statLikes: "Лайков",
    achFirstMovie: "Первый фильм",
    achFirstMovieDesc: "Добавил первый фильм",
    achCollector: "Коллекционер",
    achCollectorDesc: "10+ фильмов в коллекции",
    achCinephile: "Киноман",
    achCinephileDesc: "50+ фильмов",
    achWatcher: "Смотритель",
    achWatcherDesc: "Посмотрел 10 фильмов",
    achSocial: "Социальный",
    achSocialDesc: "10+ подписчиков",
    achCurator: "Куратор",
    achCuratorDesc: "Создал 3+ списка",
  },

  uk: {
    // Nav
    home: "Головна",
    feed: "Стрічка",
    myLists: "Мої списки",
    addMovie: "Додати",
    profile: "Профіль",
    signIn: "Увійти",
    signOut: "Вийти",
    search: "Пошук",

    // Home (logged in)
    welcomeBack: "З поверненням,",
    movieCollectionOverview: "Ваша колекція фільмів",
    addAMovie: "Додати фільм",
    myProfile: "Мій профіль",
    yourLists: "Ваші списки",
    viewAll: "Переглянути всі",
    noListsYet: "Списків ще немає",
    startByAdding: "Починайте з додавання фільмів до колекції",
    addFirstMovie: "Додати перший фільм",
    films: "фільмів",
    film: "фільм",

    // Home (landing)
    tagline: "Рекомендації фільмів — просто",
    heroTitle1: "Діліться улюбленими фільмами",
    heroTitle2: "з друзями",
    heroDesc: "Створюйте підбірки фільмів, стежте за тим, що дивляться друзі, і ніколи не забувайте рекомендації.",
    getStarted: "Почати безкоштовно",
    trendingThisWeek: "Популярне цього тижня",
    featureOrganize: "Організація",
    featureOrganizeDesc: "Створюйте списки: «Хочу подивитись», «Улюблені», «Раджу друзям».",
    featureDiscover: "Пошук",
    featureDiscoverDesc: "Шукайте фільми через TMDB — автоматично отримуйте назву, постер, рейтинг і жанри.",
    featureShare: "Поділитися",
    featureShareDesc: "Надішліть публічне посилання на будь-який список. Друзі побачать усе, що ви рекомендуєте.",

    // Login
    welcomeBackTitle: "З поверненням",
    signInToAccount: "Увійдіть до свого акаунта MyFilms",
    continueWithGoogle: "Увійти через Google",
    orContinueWithEmail: "або через email",
    email: "Email",
    password: "Пароль",
    invalidCredentials: "Невірний email або пароль",
    noAccount: "Немає акаунта?",
    createOne: "Створити",

    // Register
    createAccount: "Створіть акаунт",
    startSharing: "Почніть ділитися рекомендаціями",
    continueWithGoogleReg: "Зареєструватися через Google",
    orRegisterWithEmail: "або через email",
    fullName: "Повне ім'я",
    username: "Ім'я користувача",
    atLeast6Chars: "Мінімум 6 символів",
    createAccountBtn: "Створити акаунт",
    alreadyHaveAccount: "Вже є акаунт?",
    nameRequired: "Вкажіть ім'я",
    usernameRequired: "Вкажіть ім'я користувача",
    usernameInvalid: "Тільки малі літери, цифри та підкреслення",
    usernameShort: "Мінімум 3 символи",
    emailRequired: "Вкажіть email",
    passwordRequired: "Вкажіть пароль",
    passwordShort: "Мінімум 6 символів",
    somethingWentWrong: "Щось пішло не так. Спробуйте знову.",

    // Search
    searchMovies: "Пошук фільмів",
    searchPlaceholder: "Пошук будь-якого фільму...",
    add: "Додати",
    noResults: "Немає результатів для",
    startTyping: "Починайте вводити, щоб знайти фільми",

    // Lists
    newList: "Новий список",
    noListsEmptyTitle: "Списків ще немає",
    noListsEmptyDesc: "Створіть перший список для своєї колекції",
    createList: "Створити список",
    createNewList: "Створити новий список",
    listName: "Назва списку",
    listNamePlaceholder: "наприклад, Мої улюблені",
    descriptionOptional: "Опис (необов'язково)",
    listDescPlaceholder: "Про що цей список?",
    publicList: "Публічний список",
    publicListDesc: "Будь-хто з посиланням може переглядати",
    cancel: "Скасувати",
    createListBtn: "Створити список",
    listCreated: "Список створено!",
    listDeleted: "Список видалено",
    failedToCreateList: "Не вдалося створити список",
    failedToDeleteList: "Не вдалося видалити список",
    deleteListConfirm: "Видалити цей список? Дія незворотна.",
    list: "список",
    lists: "списків",
    public: "Публічний",
    private: "Приватний",

    // Profile
    myProfileTitle: "Мій профіль",
    viewPublicProfile: "Відкрити публічний профіль",
    editProfile: "Редагувати профіль",
    saveChanges: "Зберегти",
    displayName: "Ім'я для відображення",
    bio: "Про себе",
    profileUpdated: "Профіль оновлено!",
    failedToUpdateProfile: "Не вдалося оновити профіль",
    myListsSection: "Мої списки",
    likesLabel: "вподобань",
    listsLabel: "списків",

    // Add movie
    addAMovieTitle: "Додати фільм",
    addMovieDesc: "Знайдіть або вставте посилання для додавання фільму до списку",
    searchTab: "Пошук",
    pasteLink: "Вставити посилання",
    searchForMovie: "Пошук фільму...",
    pasteImdbLink: "Вставте посилання на фільм з будь-якого сайту...",
    fetch: "Знайти",
    changeMovie: "Змінити фільм",
    editDetails: "Редагувати",
    doneEditing: "Готово",
    addToList: "Додати до списку",
    addToListLabel: "Додати до списку",
    yourNote: "Ваша нотатка (необов'язково)",
    whyRecommend: "Чому ви радите цей фільм?",
    addToListBtn: "Додати до списку",
    movieAdded: "Фільм додано до списку!",
    couldNotFindMovie: "Не вдалося знайти фільм за цим посиланням",
    failedToFetch: "Не вдалося завантажити фільм",
    failedToAdd: "Не вдалося додати фільм",
    searchOrPaste: "Знайдіть фільм або вставте посилання",
    supportsLinks: "Multiplex, Megogo, IMDB, TMDB та інші сайти",

    // List detail
    backToLists: "Мої списки",
    listNotFound: "Список не знайдено",
    movieRemoved: "Фільм видалено",
    failedToRemove: "Не вдалося видалити фільм",
    linkCopied: "Посилання скопійовано!",
    copied: "Скопійовано!",
    share: "Поділитися",
    noMoviesInList: "У цьому списку поки немає фільмів",
    addAMovieBtn: "Додати фільм",

    // Movie card
    remove: "Видалити",
    viewDetails: "Детальніше",

    // Share button
    shareList: "Поділитися",

    // Offline
    youreOffline: "Ви не в мережі",
    offlineDesc: "Деякий контент недоступний. Підключіться до інтернету.",
    backToApp: "Повернутися до MyFilms",

    // User page
    noPublicLists: "Немає публічних списків",
    editProfileBtn: "Редагувати профіль",

    // Movie page
    back: "Назад",
    movieNotFound: "Фільм не знайдено",
    movieOverview: "Опис",
    comments: "Коментарі",
    commentPlaceholder: "Поділіться думкою...",
    commentAdded: "Коментар додано!",
    noComments: "Коментарів ще немає. Будьте першим!",
    loginToLike: "Увійдіть, щоб ставити вподобання",
    source: "Джерело",

    // Language
    language: "Мова",
    langRu: "Русский",
    langUk: "Українська",
    langEn: "English",

    // Nav extra
    explore: "Огляд",

    // Cookie banner
    cookieTitle: "Ми використовуємо cookies",
    cookieDesc: "Ми використовуємо cookies для авторизації та збереження ваших налаштувань. Докладніше — у",
    cookiePrivacyLink: "політиці конфіденційності",
    cookieDecline: "Тільки необхідні",
    cookieAccept: "Прийняти всі",
    closeAria: "Закрити",

    // Splash / loader
    splashTagline: "Колекція фільмів",

    // Legal footer
    allRightsReserved: "Усі права захищені.",
    footerPrivacy: "Конфіденційність",
    footerTerms: "Умови",
    footerContact: "Контакти",

    // Notifications
    notifications: "Сповіщення",
    noNotificationsTitle: "Сповіщень ще немає",
    noNotificationsDesc: "Вони з'являться, коли хтось підпишеться або вподобає фільм",
    notifFollow: "підписався на вас",
    notifLike: "вподобав ваш фільм",
    notifComment: "прокоментував фільм",

    // Feed extra
    feedEmptyTitle: "Стрічка порожня",
    feedEmptyDesc: "Поки ніхто не додав фільми до публічних списків",
    loadMore: "Завантажити ще",
    allFilters: "Усі",
    addedTo: "додав до",

    // Follow
    youAreFollowing: "Ви підписані",
    follow: "Підписатися",

    // Watch status
    wantToWatch: "Хочу подивитися",
    statusWatching: "Дивлюся",
    statusWatched: "Подивився",
    addStatus: "Додати статус",
    removeStatus: "Видалити статус",
    statusRemoved: "Статус видалено",
    myRating: "Моя оцінка:",

    // Lists edit
    editListTitle: "Редагувати список",
    backToList: "Назад до списку",
    listNameLabel: "Назва",
    descLabel: "Опис",
    descListPlaceholder: "Короткий опис списку...",
    listNamePlaceholderEdit: "Мої улюблені фільми",
    visibility: "Видимість",
    publicDesc: "Видно всім",
    privateDesc: "Тільки вам",
    listUpdated: "Список оновлено",
    saveError: "Помилка збереження",
    saving: "Збереження...",
    saveBtn: "Зберегти",

    // User pages
    statListsLabel: "Списків",
    statFollowers: "Підписників",
    statFollowing: "Підписок",
    userListsHeading: "Списки",
    noPublicListsYet: "Публічних списків ще немає",
    listEmpty: "Список порожній",

    // Movie page extra
    trailer: "Трейлер",
    similarMovies: "Схожі фільми",
    cancelReply: "Скасувати",
    reply: "Відповісти",
    replyTo: "Відповісти",

    // Profile achievements
    favoriteGenres: "Улюблені жанри",
    achievements: "Досягнення",
    statTotalMovies: "Усього фільмів",
    statWatched: "Подивився",
    statFollowersShort: "Підписників",
    statLikes: "Вподобань",
    achFirstMovie: "Перший фільм",
    achFirstMovieDesc: "Додав перший фільм",
    achCollector: "Колекціонер",
    achCollectorDesc: "10+ фільмів у колекції",
    achCinephile: "Кіноман",
    achCinephileDesc: "50+ фільмів",
    achWatcher: "Глядач",
    achWatcherDesc: "Подивився 10 фільмів",
    achSocial: "Соціальний",
    achSocialDesc: "10+ підписників",
    achCurator: "Куратор",
    achCuratorDesc: "Створив 3+ списки",
  },

  en: {
    // Nav
    home: "Home",
    feed: "Feed",
    myLists: "My Lists",
    addMovie: "Add",
    profile: "Profile",
    signIn: "Sign in",
    signOut: "Sign out",
    search: "Search",

    // Home (logged in)
    welcomeBack: "Welcome back,",
    movieCollectionOverview: "Your movie collection at a glance",
    addAMovie: "Add a Movie",
    myProfile: "My Profile",
    yourLists: "Your Lists",
    viewAll: "View all",
    noListsYet: "No lists yet",
    startByAdding: "Start by adding some movies to your collection",
    addFirstMovie: "Add your first movie",
    films: "films",
    film: "film",

    // Home (landing)
    tagline: "Movie recommendations, simplified",
    heroTitle1: "Share films you love",
    heroTitle2: "with friends",
    heroDesc: "Build curated movie lists, discover what your friends are watching, and never forget a recommendation again.",
    getStarted: "Get started for free",
    trendingThisWeek: "Trending this week",
    featureOrganize: "Organize",
    featureOrganizeDesc: "Create custom lists like Watch Later, Favorites, or Recommended for Friends.",
    featureDiscover: "Discover",
    featureDiscoverDesc: "Search movies via TMDB — auto-fetch title, poster, ratings and genres.",
    featureShare: "Share",
    featureShareDesc: "Send a public link to any list. Friends see exactly what you recommend.",

    // Login
    welcomeBackTitle: "Welcome back",
    signInToAccount: "Sign in to your MyFilms account",
    continueWithGoogle: "Continue with Google",
    orContinueWithEmail: "or continue with email",
    email: "Email",
    password: "Password",
    invalidCredentials: "Invalid email or password",
    noAccount: "Don't have an account?",
    createOne: "Create one",

    // Register
    createAccount: "Create your account",
    startSharing: "Start sharing movie recommendations",
    continueWithGoogleReg: "Continue with Google",
    orRegisterWithEmail: "or register with email",
    fullName: "Full name",
    username: "Username",
    atLeast6Chars: "At least 6 characters",
    createAccountBtn: "Create account",
    alreadyHaveAccount: "Already have an account?",
    nameRequired: "Name is required",
    usernameRequired: "Username is required",
    usernameInvalid: "Only lowercase letters, numbers, and underscores",
    usernameShort: "At least 3 characters",
    emailRequired: "Email is required",
    passwordRequired: "Password is required",
    passwordShort: "At least 6 characters",
    somethingWentWrong: "Something went wrong. Please try again.",

    // Search
    searchMovies: "Search Movies",
    searchPlaceholder: "Search for any movie...",
    add: "Add",
    noResults: "No results for",
    startTyping: "Start typing to search for movies",

    // Lists
    newList: "New List",
    noListsEmptyTitle: "No lists yet",
    noListsEmptyDesc: "Create your first list to start collecting movies",
    createList: "Create a list",
    createNewList: "Create a new list",
    listName: "List name",
    listNamePlaceholder: "e.g. My Favorites",
    descriptionOptional: "Description (optional)",
    listDescPlaceholder: "What's this list about?",
    publicList: "Public list",
    publicListDesc: "Anyone with the link can view",
    cancel: "Cancel",
    createListBtn: "Create List",
    listCreated: "List created!",
    listDeleted: "List deleted",
    failedToCreateList: "Failed to create list",
    failedToDeleteList: "Failed to delete list",
    deleteListConfirm: "Delete this list? This cannot be undone.",
    list: "list",
    lists: "lists",
    public: "Public",
    private: "Private",

    // Profile
    myProfileTitle: "My Profile",
    viewPublicProfile: "View public profile",
    editProfile: "Edit profile",
    saveChanges: "Save changes",
    displayName: "Display name",
    bio: "Bio",
    profileUpdated: "Profile updated!",
    failedToUpdateProfile: "Failed to update profile",
    myListsSection: "My Lists",
    likesLabel: "likes",
    listsLabel: "lists",

    // Add movie
    addAMovieTitle: "Add a Movie",
    addMovieDesc: "Search or paste a link to add a movie to your list",
    searchTab: "Search",
    pasteLink: "Paste Link",
    searchForMovie: "Search for a movie...",
    pasteImdbLink: "Paste a link from any movie site...",
    fetch: "Fetch",
    changeMovie: "Change movie",
    editDetails: "Edit details",
    doneEditing: "Done editing",
    addToList: "Add to list",
    addToListLabel: "Add to list",
    yourNote: "Your note (optional)",
    whyRecommend: "Why do you recommend this movie?",
    addToListBtn: "Add to List",
    movieAdded: "Movie added to list!",
    couldNotFindMovie: "Could not find movie from that URL",
    failedToFetch: "Failed to fetch movie",
    failedToAdd: "Failed to add movie",
    searchOrPaste: "Search for a movie or paste a link",
    supportsLinks: "Multiplex, Megogo, IMDB, TMDB and more",

    // List detail
    backToLists: "My Lists",
    listNotFound: "List not found",
    movieRemoved: "Movie removed",
    failedToRemove: "Failed to remove movie",
    linkCopied: "Link copied to clipboard!",
    copied: "Copied!",
    share: "Share",
    noMoviesInList: "No movies in this list yet",
    addAMovieBtn: "Add a movie",

    // Movie card
    remove: "Remove",
    viewDetails: "View details",

    // Share button
    shareList: "Share",

    // Offline
    youreOffline: "You're offline",
    offlineDesc: "Some content may not be available. Connect to the internet to continue using MyFilms.",
    backToApp: "Back to MyFilms",

    // User page
    noPublicLists: "No public lists",
    editProfileBtn: "Edit profile",

    // Movie page
    back: "Back",
    movieNotFound: "Movie not found",
    movieOverview: "Overview",
    comments: "Comments",
    commentPlaceholder: "Share your thoughts...",
    commentAdded: "Comment added!",
    noComments: "No comments yet. Be the first!",
    loginToLike: "Sign in to like movies",
    source: "Source",

    // Language
    language: "Language",
    langRu: "Русский",
    langUk: "Українська",
    langEn: "English",

    // Nav extra
    explore: "Explore",

    // Cookie banner
    cookieTitle: "We use cookies",
    cookieDesc: "We use cookies for authentication and to remember your preferences. Read more in the",
    cookiePrivacyLink: "privacy policy",
    cookieDecline: "Only essential",
    cookieAccept: "Accept all",
    closeAria: "Close",

    // Splash / loader
    splashTagline: "Movie collection",

    // Legal footer
    allRightsReserved: "All rights reserved.",
    footerPrivacy: "Privacy",
    footerTerms: "Terms",
    footerContact: "Contact",

    // Notifications
    notifications: "Notifications",
    noNotificationsTitle: "No notifications yet",
    noNotificationsDesc: "They will appear when someone follows you or likes a movie",
    notifFollow: "started following you",
    notifLike: "liked your movie",
    notifComment: "commented on a movie",

    // Feed extra
    feedEmptyTitle: "Feed is empty",
    feedEmptyDesc: "No one has added movies to public lists yet",
    loadMore: "Load more",
    allFilters: "All",
    addedTo: "added to",

    // Follow
    youAreFollowing: "Following",
    follow: "Follow",

    // Watch status
    wantToWatch: "Want to watch",
    statusWatching: "Watching",
    statusWatched: "Watched",
    addStatus: "Add status",
    removeStatus: "Remove status",
    statusRemoved: "Status removed",
    myRating: "My rating:",

    // Lists edit
    editListTitle: "Edit list",
    backToList: "Back to list",
    listNameLabel: "Name",
    descLabel: "Description",
    descListPlaceholder: "Short description of the list...",
    listNamePlaceholderEdit: "My favorite movies",
    visibility: "Visibility",
    publicDesc: "Visible to everyone",
    privateDesc: "Only you",
    listUpdated: "List updated",
    saveError: "Save error",
    saving: "Saving...",
    saveBtn: "Save",

    // User pages
    statListsLabel: "Lists",
    statFollowers: "Followers",
    statFollowing: "Following",
    userListsHeading: "Lists",
    noPublicListsYet: "No public lists yet",
    listEmpty: "List is empty",

    // Movie page extra
    trailer: "Trailer",
    similarMovies: "Similar movies",
    cancelReply: "Cancel",
    reply: "Reply",
    replyTo: "Reply to",

    // Profile achievements
    favoriteGenres: "Favorite genres",
    achievements: "Achievements",
    statTotalMovies: "Total movies",
    statWatched: "Watched",
    statFollowersShort: "Followers",
    statLikes: "Likes",
    achFirstMovie: "First movie",
    achFirstMovieDesc: "Added your first movie",
    achCollector: "Collector",
    achCollectorDesc: "10+ movies in collection",
    achCinephile: "Cinephile",
    achCinephileDesc: "50+ movies",
    achWatcher: "Watcher",
    achWatcherDesc: "Watched 10 movies",
    achSocial: "Social",
    achSocialDesc: "10+ followers",
    achCurator: "Curator",
    achCuratorDesc: "Created 3+ lists",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
