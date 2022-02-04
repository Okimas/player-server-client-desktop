const path = require("path");

const CHANNELS = {
  WINDOW_MINIMIZE: "window:minimize",
  WINDOW_MAXIMIZE: "window:maximize",
  WINDOW_CLOSE: "window:close",
  WINDOW_HIDE: "window:hide",
  WINDOW_IS_MAXIMIZED: "window:ismaximized",
  INTERFACE_IS_READY: "interface:ready",
  INIT: "data:init",
  SCANNER_UPDATE: "scanner:update",
  DATA: "data:all",
  DIALOG: "alert:dialog",
  FOLDER_SELECT: "folder:select",
  THEME_SET: "theme:set",
  LANGUAGE_SET: "language:set",
  PREFS_SET: "prefs:set",
  SERVER_SET: "server:set",
  LOAD_PROFILE: "load:profile",
  PLAY_PROFILE: "play:profile",
  OPEN_FILE: "open:file",
  OPEN_LINK: "open:link",
};

module.exports = {
  paths: {
    root: process.cwd(),
    log: path.join(process.cwd(), "log"),
    db: path.join(process.cwd(), "database"),
    filePrefs: path.join(process.cwd(), "database", "prefs.json"),
  },
  prefsDefault: {
    theme: "light",
    language: "en",
    server: {
      protocol: "http",
      https: {
        certificateKey: "",
        certificateFile: "",
      },
      ip: "0.0.0.0",
      port: 8081,
      url: "",
      enabled: false,
    },
    source: {
      remote: {
        url: "",
        enabled: false,
      },
      local: {
        music: [],
        series: [],
        movies: [],
        books: [],
        courses: [],
      },
    },
  },
  config: {
    categories: [
      {
        code: "music",
      },
      {
        code: "series",
      },
      {
        code: "movies",
      },
      {
        code: "books",
      },
      {
        code: "courses",
      },
    ],
    languages: [
      {
        code: "en",
        name: "english",
      },
      {
        code: "pt-BR",
        name: "português",
      },
    ],
    texts: {
      global: {
        en: [
          {
            code: "music",
            value: "Music",
          },
          {
            code: "series",
            value: "Series",
          },
          {
            code: "movies",
            value: "Movies",
          },
          {
            code: "books",
            value: "Books",
          },
          {
            code: "courses",
            value: "Courses",
          },
          {
            code: "music-collections",
            value: "albums",
          },
          {
            code: "music-items",
            value: "tracks",
          },
          {
            code: "series-collections",
            value: "seasons",
          },
          {
            code: "series-items",
            value: "episodes",
          },
          {
            code: "movies-collections",
            value: "collections",
          },
          {
            code: "movies-items",
            value: "parts",
          },
          {
            code: "books-collections",
            value: "books",
          },
          {
            code: "books-items",
            value: "files",
          },
          {
            code: "courses-collections",
            value: "topics",
          },
          {
            code: "courses-items",
            value: "lessons",
          },
          {
            code: "albums",
            value: "albums",
          },
          {
            code: "seasons",
            value: "seasons",
          },
          {
            code: "books",
            value: "books",
          },
          {
            code: "topics",
            value: "topics",
          },
          {
            code: "episodes",
            value: "episodes",
          },
          {
            code: "medias",
            value: "medias",
          },
          {
            code: "files",
            value: "files",
          },
          {
            code: "loading",
            value: "loading",
          },
          {
            code: "download",
            value: "download",
          },
        ],
        pt_BR: [
          {
            code: "music",
            value: "Música",
          },
          {
            code: "series",
            value: "Séries",
          },
          {
            code: "movies",
            value: "Filmes",
          },
          {
            code: "books",
            value: "Livros",
          },
          {
            code: "courses",
            value: "Cursos",
          },
          {
            code: "music-collections",
            value: "álbuns",
          },
          {
            code: "music-items",
            value: "faixas",
          },
          {
            code: "series-collections",
            value: "temporadas",
          },
          {
            code: "series-items",
            value: "episódios",
          },
          {
            code: "movies-collections",
            value: "coleções",
          },
          {
            code: "movies-items",
            value: "partes",
          },
          {
            code: "books-collections",
            value: "livros",
          },
          {
            code: "books-items",
            value: "arquivos",
          },
          {
            code: "courses-collections",
            value: "tópicos",
          },
          {
            code: "courses-items",
            value: "lições",
          },
          {
            code: "albums",
            value: "álbuns",
          },
          {
            code: "seasons",
            value: "temporadas",
          },
          {
            code: "books",
            value: "livros",
          },
          {
            code: "topics",
            value: "tópicos",
          },
          {
            code: "episodes",
            value: "episódios",
          },
          {
            code: "medias",
            value: "mídias",
          },
          {
            code: "files",
            value: "arquivos",
          },
          {
            code: "loading",
            value: "carregando",
          },
          {
            code: "download",
            value: "baixar",
          },
        ],
      },
      main: {
        en: [
          {
            code: "menu-preferences",
            value: "preferences",
          },
          {
            code: "menu-media-server",
            value: "media server",
          },
          {
            code: "menu-contact",
            value: "contact",
          },
          {
            code: "menu-about",
            value: "about",
          },
          {
            code: "music-placeholder",
            value: "artist, playlist",
          },
          {
            code: "series-placeholder",
            value: "serie",
          },
          {
            code: "movies-placeholder",
            value: "movie",
          },
          {
            code: "books-placeholder",
            value: "book, author",
          },
          {
            code: "courses-placeholder",
            value: "course",
          },
        ],
        pt_BR: [
          {
            code: "menu-preferences",
            value: "preferências",
          },
          {
            code: "menu-media-server",
            value: "servidor de mídias",
          },
          {
            code: "menu-contact",
            value: "contato",
          },
          {
            code: "menu-about",
            value: "sobre",
          },
          {
            code: "music-placeholder",
            value: "artista, playlist",
          },
          {
            code: "series-placeholder",
            value: "série",
          },
          {
            code: "movies-placeholder",
            value: "filme",
          },
          {
            code: "books-placeholder",
            value: "livro, autor",
          },
          {
            code: "courses-placeholder",
            value: "curso",
          },
        ],
      },
      scanner: {
        en: [
          {
            code: "title",
            value: "Media Scanner",
          },
          {
            code: "subtitle",
            value:
              "Lokjnc ndc nsdkncdj cnkd cnskdc nkdnc ksnc nskdnjcn dnc ncksdn cksncknskdcs ndckns dcnskdc nksd",
          },
          {
            code: "go-background",
            value: "send app to background",
          },
          {
            code: "stop-exit",
            value: "stop an exit",
          },
        ],
        pt_BR: [
          {
            code: "title",
            value: "Scanner de Mídias",
          },
          {
            code: "subtitle",
            value:
              "Lokjnc ndc nsdkncdj cnkd cnskdc nkdnc ksnc nskdnjcn dnc ncksdn cksncknskdcs ndckns dcnskdc nksd",
          },
          {
            code: "go-background",
            value: "trabalhar em background",
          },
          {
            code: "stop-exit",
            value: "parar e sair",
          },
        ],
      },
      preferences: {
        en: [
          {
            code: "prefs-title",
            value: "Preferences",
          },
          {
            code: "prefs-subtitle",
            value: "Subtitle",
          },
          {
            code: "prefs-theme",
            value: "theme",
          },
          {
            code: "prefs-theme-light",
            value: "Light",
          },
          {
            code: "prefs-theme-dark",
            value: "dark",
          },
          {
            code: "prefs-theme-system",
            value: "defined by system",
          },
          {
            code: "prefs-language",
            value: "Idiome",
          },
          {
            code: "prefs-language-en",
            value: "English",
          },
          {
            code: "prefs-language-pt-BR",
            value: "Português",
          },
          {
            code: "prefs-remote",
            value: "Remote server",
          },
          {
            code: "prefs-remote-explanation",
            value:
              "URL do dispositivo rodando o LyTiX com o servidor de mídias habilitado",
          },
          {
            code: "prefs-remote-protocol",
            value: "protocol",
          },
          {
            code: "prefs-remote-port",
            value: "port",
          },
          {
            code: "prefs-serving",
            value: "Local server",
          },
          {
            code: "prefs-serving-explanation",
            value: "Dados para servir suas mídias",
          },
          {
            code: "prefs-serving-port",
            value: "port",
          },
          {
            code: "prefs-reset",
            value: "Database reset",
          },
          {
            code: "prefs-reset-explanation",
            value:
              "Ao resetar uma categoria de mídias, todas as informações da mesma serão excluídos e uma nova varredura nas mídias será realizada",
          },
          {
            code: "prefs-local",
            value: "Local medias (folders)",
          },
          {
            code: "prefs-local-explanation",
            value:
              "Pastas deste dispositvo com os arquivos de mídias e dados para cada categoria",
          },
          {
            code: "prefs-btn-save",
            value: "save",
          },
          {
            code: "prefs-btn-cancel",
            value: "cancel",
          },
          {
            code: "prefs-atert-url-invalid",
            value: "Invalid URL",
          },
          {
            code: "prefs-atert-url-invalid-message",
            value: 'Insert a vaild URL and click on "check button"',
          },
          {
            code: "prefs-atert-url-error-response",
            value: "Invalid URL",
          },
          {
            code: "prefs-atert-url-error-response-message",
            value: "The URL is not working or does not have a valid server",
          },
          {
            code: "prefs-atert-url-success",
            value: "Success",
          },
          {
            code: "prefs-atert-url-success-message",
            value: "The URL has a valid server",
          },
        ],
        pt_BR: [
          {
            code: "prefs-title",
            value: "Preferências",
          },
          {
            code: "prefs-subtitle",
            value: "Subtitle",
          },
          {
            code: "prefs-theme",
            value: "Tema",
          },
          {
            code: "prefs-theme-light",
            value: "Claro",
          },
          {
            code: "prefs-theme-dark",
            value: "Escuro",
          },
          {
            code: "prefs-theme-system",
            value: "Definido pelo sistema",
          },
          {
            code: "prefs-language",
            value: "Idioma",
          },
          {
            code: "prefs-language-en",
            value: "English",
          },
          {
            code: "prefs-language-pt-BR",
            value: "Português",
          },
          {
            code: "prefs-remote",
            value: "Servidor remoto",
          },
          {
            code: "prefs-remote-explanation",
            value:
              "URL do dispositivo rodando o LyTiX com o servidor de mídias habilitado",
          },
          {
            code: "prefs-remote-protocol",
            value: "protocolo",
          },
          {
            code: "prefs-remote-port",
            value: "porta",
          },
          {
            code: "prefs-serving",
            value: "Servindo mídias",
          },
          {
            code: "prefs-serving-explanation",
            value: "Dados para servir suas mídias",
          },
          {
            code: "prefs-serving-port",
            value: "porta",
          },
          {
            code: "prefs-reset",
            value: "Resete do Banco de Dados",
          },
          {
            code: "prefs-reset-explanation",
            value:
              "Ao resetar uma categoria de mídias, todas as informações da mesma serão excluídos e uma nova varredura nas mídias será realizada",
          },
          {
            code: "prefs-local",
            value: "Mídias Locais (pastas)",
          },
          {
            code: "prefs-local-explanation",
            value:
              "Pastas deste dispositvo com os arquivos de mídias e dados para cada categoria",
          },
          {
            code: "prefs-btn-save",
            value: "salvar",
          },
          {
            code: "prefs-btn-cancel",
            value: "cancelar",
          },
          {
            code: "prefs-atert-url-invalid",
            value: "URL inválida",
          },
          {
            code: "prefs-atert-url-invalid-message",
            value: 'Insira uma URL válida e clique no "botão de checagen"',
          },
          {
            code: "prefs-atert-url-error-response",
            value: "URL inválida",
          },
          {
            code: "prefs-atert-url-error-response-message",
            value:
              "A URL não está funcionando ou não direciona para um servidor válido",
          },
          {
            code: "prefs-atert-url-success",
            value: "Sucesso",
          },
          {
            code: "prefs-atert-url-success-message",
            value: "A URL direciona para um servidor válido",
          },
        ],
      },
      system: {
        en: [
          {
            code: "dialog-about",
            title: "About",
            message:
              "Kjncndnck snck dnck snkdn\n\nckscn d<strong>XXXX</strong><br/>XXXXX",
            buttons: ["OK"],
          },
          {
            code: "error-filesystem",
            title: "Alert",
            message: "Invalid folder structure",
            buttons: ["OK"],
          },
          {
            code: "error-server-invlaid",
            title: "Alert",
            message:
              "Invalid server!\nCheck your connection or try another port",
            buttons: ["OK"],
          },
          {
            code: "error-scanner-undefined",
            title: "Alert",
            message: "Undefined error",
            buttons: ["OK"],
          },
          {
            code: "error-remote-undefined",
            title: "Alert",
            message: "Undefined error",
            buttons: ["OK"],
          },
          {
            code: "error-remote-response",
            title: "Alert",
            message: "Invalid response from remote server",
            buttons: ["OK"],
          },
          {
            code: "no-folders",
            title: "Alert",
            message: "No selected media folder yet",
            buttons: ["OK", "select now"],
          },
          {
            code: "error-theme-set",
            title: "Alert",
            message: "Setting theme error",
            buttons: ["OK"],
          },
          {
            code: "error-language-set",
            title: "Alert",
            message: "Setting language error",
            buttons: ["OK"],
          },
          {
            code: "error-prefs-set",
            title: "Alert",
            message: "Setting preferences error",
            buttons: ["OK"],
          },
          {
            code: "error-expired",
            title: "Alert",
            message: "Time was expired",
            buttons: ["OK"],
          },
        ],
        pt_BR: [
          {
            code: "dialog-about",
            title: "Sobre",
            message: "Kjncndnck snck dnck snk\n\ndnckscn d<b>XXXX</b>\nXXXXX",
            buttons: ["OK"],
          },
          {
            code: "error-filesystem",
            title: "Alerta",
            message: "Estrutura de pastas inválido",
            buttons: ["OK"],
          },
          {
            code: "error-server-invlaid",
            title: "Alerta",
            message:
              "Não foi possível iniciar o servidor!\nVerifique sua conexão ou tente outra porta",
            buttons: ["OK"],
          },
          {
            code: "error-scanner-undefined",
            title: "Alerta",
            message: "Erro indefinido",
            buttons: ["OK"],
          },
          {
            code: "error-remote-undefined",
            title: "Alerta",
            message: "Erro indefinido",
            buttons: ["OK"],
          },
          {
            code: "error-remote-response",
            title: "Alerta",
            message: "Resposta inválida do servidor remoto",
            buttons: ["OK"],
          },
          {
            code: "no-folders",
            title: "Alerta",
            message: "Nenhuma pasta local de mídia foi selecionada ainda",
            buttons: ["OK", "selecionar agora"],
          },
          {
            code: "error-theme-set",
            title: "Alerta",
            message: "Erro ao configurar o tema",
            buttons: ["OK"],
          },
          {
            code: "error-language-set",
            title: "Alerta",
            message: "Erro ao configurar o idioma",
            buttons: ["OK"],
          },
          {
            code: "error-prefs-set",
            title: "Alerta",
            message: "Erro ao configurar as preferências",
            buttons: ["OK"],
          },
          {
            code: "error-expired",
            title: "Alerta",
            message: "O tempo de uso expirou!",
            buttons: ["OK"],
          },
        ],
      },
      scannerCore: {
        en: [
          {
            code: "scanner-core-files",
            value: "Files",
          },
          {
            code: "scanner-core-idiome",
            value: "idiome",
          },
          {
            code: "scanner-core-publisher",
            value: "publisher",
          },
          {
            code: "scanner-core-first-date",
            value: "first publication",
          },
          {
            code: "scanner-core-date",
            value: "date",
          },
          {
            code: "scanner-core-lists-creating",
            value: "creating lists",
          },
          {
            code: "scanner-core-lists-creating-done",
            value: "lists was created",
          },
          {
            code: "error-expired",
            title: "Alert",
            message: "Time was expired",
            buttons: ["OK"],
          },
          {
            code: "alert-connection",
            title: "Alert",
            message: "No connectivity! Enable your internet and try again",
            buttons: ["OK"],
          },
          {
            code: "alert-expired",
            title: "Alert",
            message: "Time will expires in XXXXX day(s)",
            buttons: ["OK"],
          },
        ],
        pt_BR: [
          {
            code: "scanner-core-files",
            value: "Arquivos",
          },
          {
            code: "scanner-core-idiome",
            value: "idioma",
          },
          {
            code: "scanner-core-publisher",
            value: "editora",
          },
          {
            code: "scanner-core-first-date",
            value: "primeira publicação",
          },
          {
            code: "scanner-core-date",
            value: "data",
          },
          {
            code: "scanner-core-lists-creating",
            value: "criando listas",
          },
          {
            code: "scanner-core-lists-creating-done",
            value: "listas criadas",
          },
          {
            code: "error-expired",
            title: "Alerta",
            message: "O tempo de uso expirou!",
            buttons: ["OK"],
          },
          {
            code: "alert-connection",
            title: "Alert",
            message:
              "Sem conectividade! Habilite sua conexão e tente novamente",
            buttons: ["OK"],
          },
          {
            code: "alert-expired",
            title: "Alerta",
            message: "O tempo de utilização vai expirar em XXXXX dia(s)",
            buttons: ["OK"],
          },
        ],
      },
      lists: {
        en: [
          {
            code: "lists-music-items-label",
            value: "Artists",
          },
          {
            code: "lists-music-playlists-label",
            value: "Playlists",
          },
          {
            code: "lists-music-updates-label",
            value: "Updates",
          },
          {
            code: "lists-series-items-label",
            value: "Series",
          },
          {
            code: "lists-series-updates-label",
            value: "Updates",
          },
          {
            code: "lists-movies-items-label",
            value: "Movies",
          },
          {
            code: "lists-movies-updates-label",
            value: "Updates",
          },
          {
            code: "lists-books-items-label",
            value: "Books",
          },
          {
            code: "lists-books-authors-label",
            value: "Authors",
          },
          {
            code: "lists-books-updates-label",
            value: "Updates",
          },
          {
            code: "lists-courses-items-label",
            value: "Courses",
          },
          {
            code: "lists-courses-updates-label",
            value: "Atualizações",
          },
          {
            code: "lists-button-details",
            value: "Details",
          },
          {
            code: "lists-button-listen",
            value: "Listen",
          },
          {
            code: "lists-button-read",
            value: "Read",
          },
          {
            code: "lists-button-watch",
            value: "Watch",
          },
          {
            code: "lists-button-study",
            value: "Study",
          },
          {
            code: "lists-music-collections",
            value: "albums",
          },
          {
            code: "lists-music-tracks",
            value: "tracks",
          },
          {
            code: "lists-series-collections",
            value: "seasons",
          },
          {
            code: "lists-series-tracks",
            value: "episodes",
          },
          {
            code: "lists-movies-collections",
            value: "XXX",
          },
          {
            code: "lists-movies-tracks",
            value: "medias",
          },
          {
            code: "lists-authors-collections",
            value: "books",
          },
          {
            code: "lists-courses-collections",
            value: "topics",
          },
          {
            code: "lists-courses-tracks",
            value: "medias",
          },
          {
            code: "lists-books-tracks",
            value: "files",
          },
          {
            code: "lists-music-none",
            value: "no artists",
          },
          {
            code: "lists-playlists-none",
            value: "no playlists",
          },
          {
            code: "lists-series-none",
            value: "nenhuma série",
          },
          {
            code: "lists-movies-none",
            value: "nenhuma filme",
          },
          {
            code: "lists-books-none",
            value: "no books",
          },
          {
            code: "lists-authors-none",
            value: "no authors",
          },
          {
            code: "lists-courses-none",
            value: "no courses",
          },
          {
            code: "lists-none-message",
            value: "Check your filter options",
          },
          {
            code: "lists-playlist-create-btn",
            value: "Create",
          },
          {
            code: "lists-playlist-new",
            value: "New",
          },
          {
            code: "lists-playlist-create",
            value: "Create a new playlist",
          },
        ],
        pt_BR: [
          {
            code: "lists-music-items-label",
            value: "Artistas",
          },
          {
            code: "lists-music-playlists-label",
            value: "Playlists",
          },
          {
            code: "lists-music-updates-label",
            value: "Atualizações",
          },
          {
            code: "lists-series-items-label",
            value: "Séries",
          },
          {
            code: "lists-series-updates-label",
            value: "Atualizações",
          },
          {
            code: "lists-movies-items-label",
            value: "Filmes",
          },
          {
            code: "lists-movies-updates-label",
            value: "Atualizações",
          },
          {
            code: "lists-books-items-label",
            value: "Livros",
          },
          {
            code: "lists-books-authors-label",
            value: "Autores",
          },
          {
            code: "lists-books-updates-label",
            value: "Atualizações",
          },
          {
            code: "lists-courses-items-label",
            value: "Cursos",
          },
          {
            code: "lists-courses-updates-label",
            value: "Atualizações",
          },
          {
            code: "lists-button-details",
            value: "Detalhes",
          },
          {
            code: "lists-button-listen",
            value: "Ouvir",
          },
          {
            code: "lists-button-read",
            value: "Ler",
          },
          {
            code: "lists-button-watch",
            value: "Assistir",
          },
          {
            code: "lists-button-study",
            value: "estudar",
          },
          {
            code: "lists-music-collections",
            value: "álbuns",
          },
          {
            code: "lists-music-tracks",
            value: "faixas",
          },
          {
            code: "lists-series-collections",
            value: "temporadas",
          },
          {
            code: "lists-series-tracks",
            value: "episódios",
          },
          {
            code: "lists-movies-collections",
            value: "XXX",
          },
          {
            code: "lists-movies-tracks",
            value: "mídias",
          },
          {
            code: "lists-authors-collections",
            value: "títulos",
          },
          {
            code: "lists-courses-collections",
            value: "tópicos",
          },
          {
            code: "lists-courses-tracks",
            value: "mídias",
          },
          {
            code: "lists-books-tracks",
            value: "arquivos",
          },
          {
            code: "lists-music-none",
            value: "nenhum artista",
          },
          {
            code: "lists-playlists-none",
            value: "nenhuma playlist",
          },
          {
            code: "lists-series-none",
            value: "nenhuma série",
          },
          {
            code: "lists-movies-none",
            value: "nenhuma filme",
          },
          {
            code: "lists-books-none",
            value: "nenhum livro",
          },
          {
            code: "lists-authors-none",
            value: "nenhum autor",
          },
          {
            code: "lists-courses-none",
            value: "nenhum curso",
          },
          {
            code: "lists-none-message",
            value: "Verifique suas opções de filtro",
          },
          {
            code: "lists-playlist-create-btn",
            value: "Criar",
          },
          {
            code: "lists-playlist-new",
            value: "Nova",
          },
          {
            code: "lists-playlist-create",
            value: "Criar nova playlist",
          },
        ],
      },
      about: {
        en: [
          {
            code: "about-title",
            value: "About",
          },
        ],
        pt_BR: [
          {
            code: "about-title",
            value: "Sobre",
          },
        ],
      },
    },
  },
  listsEmpty: {
    music: {
      tags: [],
      items: [],
      playlists: [],
      updates: [],
    },
    series: {
      tags: [],
      items: [],
      updates: [],
    },
    movies: {
      tags: [],
      items: [],
      updates: [],
    },
    books: {
      tags: [],
      items: [],
      authors: [],
      updates: [],
    },
    courses: {
      tags: [],
      items: [],
      updates: [],
    },
  },
  scanner: {
    music: {
      scanning: "",
      numbers: [0, 0, 0],
    },
    series: {
      scanning: "",
      numbers: [0, 0, 0],
    },
    movies: {
      scanning: "",
      numbers: [0, 0, 0],
    },
    books: {
      scanning: "",
      numbers: [0, 0, 0],
    },
    courses: {
      scanning: "",
      numbers: [0, 0, 0],
    },
  },
  CHANNELS,
  isChannelValid: (channel) => {
    const keys = Object.keys(CHANNELS);
    for (let i = 0; i < keys.length; i++) {
      if (channel === CHANNELS[keys[i]]) return true;
    }
    return false;
  },
  TEXTS_EXTENSIONS: [".lrc", ".srt", ".ass", ".ssa", ".vtt", ".txt"],
  ACCEPTED_LANGUAGES: ["pt", "en", "ja"],
  LANGUAGES: [
    "af-ZA",
    "am-ET",
    "ar-AE",
    "ar-BH",
    "ar-DZ",
    "ar-EG",
    "ar-IQ",
    "ar-JO",
    "ar-KW",
    "ar-LB",
    "ar-LY",
    "ar-MA",
    "arn-CL",
    "ar-OM",
    "ar-QA",
    "ar-SA",
    "ar-SD",
    "ar-SY",
    "ar-TN",
    "ar-YE",
    "as-IN",
    "az-az",
    "az-Cyrl-AZ",
    "az-Latn-AZ",
    "ba-RU",
    "be-BY",
    "bg-BG",
    "bn-BD",
    "bn-IN",
    "bo-CN",
    "br-FR",
    "bs-Cyrl-BA",
    "bs-Latn-BA",
    "ca-ES",
    "co-FR",
    "cs-CZ",
    "cy-GB",
    "da-DK",
    "de-AT",
    "de-CH",
    "de-DE",
    "de-LI",
    "de-LU",
    "dsb-DE",
    "dv-MV",
    "el-CY",
    "el-GR",
    "en-029",
    "en-AU",
    "en-BZ",
    "en-CA",
    "en-cb",
    "en-GB",
    "en-IE",
    "en-IN",
    "en-JM",
    "en-MT",
    "en-MY",
    "en-NZ",
    "en-PH",
    "en-SG",
    "en-TT",
    "en-US",
    "en-ZA",
    "en-ZW",
    "es-AR",
    "es-BO",
    "es-CL",
    "es-CO",
    "es-CR",
    "es-DO",
    "es-EC",
    "es-ES",
    "es-GT",
    "es-HN",
    "es-MX",
    "es-NI",
    "es-PA",
    "es-PE",
    "es-PR",
    "es-PY",
    "es-SV",
    "es-US",
    "es-UY",
    "es-VE",
    "et-EE",
    "eu-ES",
    "fa-IR",
    "fi-FI",
    "fil-PH",
    "fo-FO",
    "fr-BE",
    "fr-CA",
    "fr-CH",
    "fr-FR",
    "fr-LU",
    "fr-MC",
    "fy-NL",
    "ga-IE",
    "gd-GB",
    "gd-ie",
    "gl-ES",
    "gsw-FR",
    "gu-IN",
    "ha-Latn-NG",
    "he-IL",
    "hi-IN",
    "hr-BA",
    "hr-HR",
    "hsb-DE",
    "hu-HU",
    "hy-AM",
    "id-ID",
    "ig-NG",
    "ii-CN",
    "in-ID",
    "is-IS",
    "it-CH",
    "it-IT",
    "iu-Cans-CA",
    "iu-Latn-CA",
    "iw-IL",
    "ja-JP",
    "ka-GE",
    "kk-KZ",
    "kl-GL",
    "km-KH",
    "kn-IN",
    "kok-IN",
    "ko-KR",
    "ky-KG",
    "lb-LU",
    "lo-LA",
    "lt-LT",
    "lv-LV",
    "mi-NZ",
    "mk-MK",
    "ml-IN",
    "mn-MN",
    "mn-Mong-CN",
    "moh-CA",
    "mr-IN",
    "ms-BN",
    "ms-MY",
    "mt-MT",
    "nb-NO",
    "ne-NP",
    "nl-BE",
    "nl-NL",
    "nn-NO",
    "no-no",
    "nso-ZA",
    "oc-FR",
    "or-IN",
    "pa-IN",
    "pl-PL",
    "prs-AF",
    "ps-AF",
    "pt-BR",
    "pt-PT",
    "qut-GT",
    "quz-BO",
    "quz-EC",
    "quz-PE",
    "rm-CH",
    "ro-mo",
    "ro-RO",
    "ru-mo",
    "ru-RU",
    "rw-RW",
    "sah-RU",
    "sa-IN",
    "se-FI",
    "se-NO",
    "se-SE",
    "si-LK",
    "sk-SK",
    "sl-SI",
    "sma-NO",
    "sma-SE",
    "smj-NO",
    "smj-SE",
    "smn-FI",
    "sms-FI",
    "sq-AL",
    "sr-BA",
    "sr-CS",
    "sr-Cyrl-BA",
    "sr-Cyrl-CS",
    "sr-Cyrl-ME",
    "sr-Cyrl-RS",
    "sr-Latn-BA",
    "sr-Latn-CS",
    "sr-Latn-ME",
    "sr-Latn-RS",
    "sr-ME",
    "sr-RS",
    "sr-sp",
    "sv-FI",
    "sv-SE",
    "sw-KE",
    "syr-SY",
    "ta-IN",
    "te-IN",
    "tg-Cyrl-TJ",
    "th-TH",
    "tk-TM",
    "tn-ZA",
    "tr-TR",
    "tt-RU",
    "tzm-Latn-DZ",
    "ug-CN",
    "uk-UA",
    "ur-PK",
    "uz-Cyrl-UZ",
    "uz-Latn-UZ",
    "uz-uz",
    "vi-VN",
    "wo-SN",
    "xh-ZA",
    "yo-NG",
    "zh-CN",
    "zh-HK",
    "zh-MO",
    "zh-SG",
    "zh-TW",
    "zu-ZA",
  ],
};
