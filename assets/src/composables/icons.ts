/**
 * Dictionnaire de correspondance (Mapping) entre les identifiants d'icônes
 * natifs de MediaWiki (OOUI / Codex) et les classes Material Design Icons (MDI).
 */
export const wikiIconMap: Record<string, string> = {
  // --- NOUVEAUX MAPPINGS SOUMIS (CamelCase & Variantes) ---
  'useravatar': 'mdi-account-circle-outline',   // userAvatar
  'usertalk': 'mdi-comment-account-outline',     // userTalk
  'usercontributions': 'mdi-clipboard-text-clock-outline', // userContributions
  'logout': 'mdi-logout',                        // logOut / logout
  'unstar': 'mdi-star-minus-outline',            // unStar (Retirer de la liste de suivi)
  'useradd': 'mdi-account-plus',

  // --- ACTIONS DE LA PAGE & PORTLETS ---
  'view': 'mdi-eye-outline',
  'eye': 'mdi-eye-outline',                      // eye
  'edit': 'mdi-pencil',
  'edit-source': 'mdi-code-braces',
  'history': 'mdi-history',                      // history
  'talk': 'mdi-comment-text-outline',
  'watch': 'mdi-star-outline',
  'unwatch': 'mdi-star',
  'protect': 'mdi-lock',
  'lock': 'mdi-lock',                            // lock
  'unprotect': 'mdi-lock-open',
  'delete': 'mdi-trash-can',
  'trash': 'mdi-trash-can',                      // trash
  'move': 'mdi-file-move',                       // move
  'purge': 'mdi-cached',
  'render': 'mdi-file-document-refresh-outline',

  // --- NAVIGATION ET OPTIONS UTILISATEUR ---
  'mainpage': 'mdi-home',
  'home': 'mdi-home',
  'die': 'mdi-crosshairs-question',
  'recentchanges': 'mdi-newspaper-variant-outline',
  'randompage': 'mdi-dice-multiple',
  'specialpages': 'mdi-cog-box',
  'help': 'mdi-help-circle-outline',
  'sandbox': 'mdi-test-tube',
  'contributions': 'mdi-account-edit',
  'preferences': 'mdi-account-cog',
  'settings': 'mdi-cog',                         // settings
  'watchlist': 'mdi-star-box-multiple-outline',  // watchlist
  'mycontris': 'mdi-clipboard-text-clock-outline',
  'login': 'mdi-login',
  'createaccount': 'mdi-account-plus',
  'userpage': 'mdi-account',
  'anonuserpage': 'mdi-account-outline',

  // --- RECHERCHE ET UTILITIES ---
  'search': 'mdi-magnify',
  'clear': 'mdi-close',
  'advanced': 'mdi-tune',
  'filter': 'mdi-filter-variant',
  'sort': 'mdi-sort',
  'find': 'mdi-file-find-outline',

  // --- ÉDITION ET MISE EN FORME (VisualEditor / Wikitext) ---
  'bold': 'mdi-format-bold',
  'italic': 'mdi-format-italic',
  'underline': 'mdi-format-underline',
  'strikethrough': 'mdi-format-strikethrough',
  'link': 'mdi-link-variant',
  'image': 'mdi-image-outline',
  'media': 'mdi-video-outline',
  'table': 'mdi-table',
  'list-bullet': 'mdi-format-list-bulleted',
  'list-numbered': 'mdi-format-list-numbered',
  'heading': 'mdi-format-size',
  'text-style': 'mdi-format-text',
  'signature': 'mdi-draw',
  'redirect': 'mdi-redo-variant',
  'comment': 'mdi-comment-outline',
  'indent': 'mdi-format-indent-increase',
  'outdent': 'mdi-format-indent-decrease',
  'undo': 'mdi-undo',
  'redo': 'mdi-redo',
  'save': 'mdi-content-save',
  'publish': 'mdi-cloud-upload',
  'preview': 'mdi-eye',
  'diff': 'mdi-compare',
  'template': 'mdi-puzzle-outline',
  'reference': 'mdi-bookmark-outline',
  'cite': 'mdi-format-quote-close',
  'add': 'mdi-plus',
  'remove': 'mdi-minus',
  'cancel': 'mdi-close-circle-outline',

  // --- ARCHIVES ET DOCUMENTS ---
  'upload': 'mdi-upload',
  'download': 'mdi-download',
  'file': 'mdi-file-document-outline',
  'document': 'mdi-file-outline',
  'folder': 'mdi-folder-outline',
  'gallery': 'mdi-view-grid-outline',
  'audio': 'mdi-volume-high',
  'video': 'mdi-video',
  'pdf': 'mdi-file-pdf-box',
  'code': 'mdi-code-tags',

  // --- ALERTES ET ÉTATS ---
  'info': 'mdi-information-outline',
  'success': 'mdi-check-circle-outline',
  'warning': 'mdi-alert-outline',
  'error': 'mdi-alert-circle-outline',
  'unlock': 'mdi-lock-open',
  'pin': 'mdi-pin',
  'unpin': 'mdi-pin-off',
  'flag': 'mdi-flag-outline',
  'bookmark': 'mdi-bookmark',
  'tag': 'mdi-tag-outline',

  // --- INTERFACE COMPLÉMENTAIRE ---
  'map': 'mdi-map-outline',
  'marker': 'mdi-map-marker',
  'layers': 'mdi-layers-outline',
  'chart': 'mdi-chart-bar',
  'graph': 'mdi-chart-timeline-variant',
  'calendar': 'mdi-calendar',
  'clock': 'mdi-clock-outline',
  'external-link': 'mdi-open-in-new',
  'ellipsis': 'mdi-dots-horizontal',
  'menu': 'mdi-menu',
  'expand': 'mdi-chevron-down',
  'collapse': 'mdi-chevron-up',
  'next': 'mdi-chevron-right',
  'previous': 'mdi-chevron-left',
  'user': 'mdi-account',
  'group': 'mdi-account-group-outline',
  'check': 'mdi-check',
  'close': 'mdi-close',
  'alert': 'mdi-alert',
  'notice': 'mdi-bell-outline',
  'message': 'mdi-email-outline',
  'speechBubble': 'mdi-comment-text-outline',
  'share': 'mdi-share-variant-outline',
  'heart': 'mdi-heart-outline',
  'thumbs-up': 'mdi-thumb-up-outline',
  'thumbs-down': 'mdi-thumb-down-outline',
  'refresh': 'mdi-refresh',
  'search-history': 'mdi-magnify-scan',
  'tools': 'mdi-tools',
  'database': 'mdi-database',
  'network': 'mdi-lan',
  'terminal': 'mdi-console',
  'translation': 'mdi-translate',
  'globe': 'mdi-earth',
  'bright': 'mdi-brightness-7',
  'moon': 'mdi-brightness-3',
  'star': 'mdi-star',
  'star-outline': 'mdi-star-outline',
  'copy': 'mdi-content-copy',
  'paste': 'mdi-content-paste',
  'cut': 'mdi-content-cut',
  'export': 'mdi-export',
  'import': 'mdi-import',
  'print': 'mdi-printer',
  'invisible': 'mdi-eye-off-outline',
  'visible': 'mdi-eye-outline',
};

export function getMdiIcon(wikiIconName: string | null | undefined): string|null {
  if (!wikiIconName) return null;
  
  // Normalisation (retrait des préfixes éventuels comme 'oo-ui-icon-' ou 'mw-ui-icon-')
  const cleanName = wikiIconName
    .replace('oo-ui-icon-', '')
    .replace('mw-ui-icon-', '');

  return wikiIconMap[cleanName.toLowerCase()] || null;
}

