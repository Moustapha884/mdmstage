import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {

  apiUrl = 'http://localhost:8080/api';

  username = '';
  password = '';
  message = '';
  isLoggedIn = false;
  activeSection = 'dashboard';
  isSidebarOpen = false;

  alertMessage = '';
  alertType = 'success';

  adminToken = '';

  autoLogoutEnabled = true;

  currentTheme: 'light' | 'dark' = 'light';
  currentLanguage: 'fr' | 'ar' = 'fr';

  private autoLogoutKey = 'mdm_auto_logout_enabled';
  private loggedInKey = 'mdm_admin_logged_in';
  private tokenKey = 'mdm_admin_token';
  private themeKey = 'mdm_theme';
  private languageKey = 'mdm_language';

  devices: any[] = [];
  profiles: any[] = [];
  apps: any[] = [];
  profileApps: any[] = [];
  deviceProfiles: any[] = [];
  alerts: any[] = [];

  selectedProfileForAppsView: any = null;
  selectedProfileApps: any[] = [];

  deviceSearch = '';
  profileSearch = '';
  appSearch = '';
  profileAppSearch = '';
  alertSearch = '';

  listLimit = 5;

  showAllDevices = false;
  showAllProfiles = false;
  showAllProfileApps = false;
  showAllApps = false;
  showAllAlerts = false;

  editingDeviceId: number | null = null;
  editingProfileId: number | null = null;
  editingAppId: number | null = null;

  selectedProfileForDeviceForm = '';
  selectedAppIdsForProfile: string[] = [];

  selectedApkFile: File | null = null;
  selectedApkFileName = '';

  newDevice = {
    deviceIdentifier: '',
    imei: '',
    brand: '',
    model: '',
    os: '',
    status: 'ACTIVE'
  };

  newProfile = {
    name: '',
    description: '',
    status: 'ACTIVE'
  };

  newApp = {
    name: '',
    packageName: '',
    version: '',
    type: 'REQUIRED',
    status: 'ACTIVE'
  };

  translations: any = {
    fr: {
      dashboard: 'Tableau de bord',
      devices: 'Appareils',
      profiles: 'Profils MDM',
      apps: 'Applications',
      alerts: 'Problèmes',
      logout: 'Déconnexion',
      admin: 'ADMINISTRATEUR',
      pageTitle: 'Tableau de bord MDM',
      welcomeAdmin: 'Bienvenue administrateur',
      systemStatus: 'État du système',
      online: 'En ligne',
      adminSpace: 'Espace administrateur',
      adminDescription: 'L’administrateur crée des profils MDM, affecte les profils aux appareils et traite les problèmes signalés par les utilisateurs anonymes.',
      assignedProfiles: 'Profils affectés',
      addDevice: 'Ajouter appareil',
      createProfile: 'Créer profil',
      manageApps: 'Gérer applications',
      treatProblems: 'Traiter problèmes',
      darkMode: 'Mode sombre',
      lightMode: 'Mode clair',
      autoLogoutOn: 'Déconnexion auto : ACTIVÉE',
      autoLogoutOff: 'Déconnexion auto : DÉSACTIVÉE',
      recentDevices: 'Derniers appareils',
      recentProblems: 'Derniers problèmes',
      seeAll: 'Voir tout',
      loginTitle: 'Connexion administrateur',
      loginSubtitle: 'Accès réservé uniquement à l’administrateur',
      loginButton: 'Se connecter',
      username: 'Nom d’utilisateur',
      password: 'Mot de passe',
      appTitle: 'Plateforme MDM',
      appDescription: 'Plateforme de gestion centralisée des appareils anonymes, profils MDM, applications et problèmes signalés.',
      number: 'N°',
      identifier: 'Identifiant',
      profile: 'Profil',
      status: 'État',
      brand: 'Marque',
      model: 'Modèle',
      os: 'Système',
      profileMdm: 'Profil MDM',
      actions: 'Actions',
      edit: 'Modifier',
      delete: 'Supprimer',
      update: 'Mettre à jour',
      cancel: 'Annuler',
      refresh: 'Actualiser',
      searchDevice: 'Rechercher un appareil...',
      searchProfile: 'Rechercher un profil...',
      searchApp: 'Rechercher une application...',
      searchAlert: 'Rechercher par appareil, problème, état, réponse...',
      noDevice: 'Aucun appareil trouvé.',
      noProfile: 'Aucun profil trouvé.',
      noApp: 'Aucune application trouvée.',
      noAlert: 'Aucun problème reçu.',
      noRegisteredDevice: 'Aucun appareil enregistré.',
      noRegisteredProblem: 'Aucun problème enregistré.',
      addDeviceTitle: 'Ajouter un appareil',
      editDeviceTitle: 'Modifier un appareil',
      deviceSubtitle: 'Lors de l’ajout d’un appareil anonyme, l’administrateur choisit directement le profil MDM associé.',
      deviceIdentifierPlaceholder: 'Identifiant appareil',
      imeiPlaceholder: 'IMEI du téléphone',
      imei: 'IMEI',
      brandPlaceholder: 'Marque',
      modelPlaceholder: 'Modèle',
      osPlaceholder: 'Système d’exploitation',
      chooseProfile: 'Choisir le profil MDM',
      addDeviceBtn: 'Ajouter appareil',
      updateDeviceBtn: 'Mettre à jour',
      profileTitleAdd: 'Ajouter un profil MDM',
      profileTitleEdit: 'Modifier un profil MDM',
      profileSubtitle: 'Créez un profil MDM prêt à être affecté à un appareil. Chaque profil contient une ou plusieurs applications.',
      profileName: 'Nom du profil',
      description: 'Description',
      profileAppsTitle: 'Applications du profil',
      profileAppsSubtitle: 'Cochez une ou plusieurs applications pour ce profil.',
      availableApk: 'APK disponible',
      noApkDefined: 'APK non défini',
      addProfileBtn: 'Ajouter profil',
      updateProfileBtn: 'Mettre à jour profil',
      profilesList: 'Liste des profils MDM',
      appsCount: 'Nombre d’applications',
      viewApps: 'Voir les applications',
      modalAppsTitle: 'Applications du profil',
      noProfileApps: 'Aucune application associée à ce profil.',
      appTitleAdd: 'Ajouter une application',
      appTitleEdit: 'Modifier une application',
      appName: 'Nom de l’application',
      packageName: 'Nom du paquet',
      version: 'Version',
      apk: 'APK',
      apkLink: 'Fichier APK',
      type: 'Type',
      appList: 'Liste des applications',
      seeApk: 'Télécharger APK',
      undefined: 'Non défini',
      addAppBtn: 'Ajouter application',
      updateAppBtn: 'Mettre à jour',
      problemsTitle: 'Problèmes signalés par les utilisateurs anonymes',
      problemsSubtitle: 'Cette page permet à l’administrateur de consulter les problèmes, répondre à l’utilisateur anonyme et marquer les problèmes comme résolus.',
      device: 'Appareil',
      severity: 'Gravité',
      problemType: 'Type',
      problemFromUser: 'Problème envoyé par l’utilisateur',
      sentAt: 'Envoyé le',
      adminResponse: 'Réponse de l’administrateur',
      responsePlaceholder: 'Écrire une réponse à l’utilisateur anonyme...',
      problemStatus: 'État du problème',
      currentResponse: 'Réponse actuelle',
      resolvedAt: 'Résolu le',
      sendResponse: 'Envoyer réponse',
      markResolved: 'Marquer comme résolu',
      showMore: 'Afficher plus',
      showLess: 'Afficher moins',
      active: 'Actif',
      inactive: 'Inactif',
      lost: 'Perdu',
      required: 'Obligatoire',
      optional: 'Optionnelle',
      blocked: 'Bloquée',
      appActive: 'Active',
      appInactive: 'Inactive',
      new: 'Nouveau',
      inProgress: 'En cours',
      resolved: 'Résolu',
      low: 'Faible',
      medium: 'Moyenne',
      high: 'Élevée',
      critical: 'Critique',
      chooseApkFile: 'Choisir le fichier APK',
      replaceApkFile: 'Remplacer le fichier APK',
      selectedFile: 'Fichier sélectionné',
      keepCurrentApk: 'APK actuel conservé si aucun nouveau fichier n’est choisi',
      downloadApk: 'Télécharger APK'
    },

    ar: {
      dashboard: 'لوحة التحكم',
      devices: 'الأجهزة',
      profiles: 'ملفات MDM',
      apps: 'التطبيقات',
      alerts: 'المشاكل',
      logout: 'تسجيل الخروج',
      admin: 'المدير',
      pageTitle: 'لوحة تحكم MDM',
      welcomeAdmin: 'مرحباً أيها المدير',
      systemStatus: 'حالة النظام',
      online: 'متصل',
      adminSpace: 'مساحة المدير',
      adminDescription: 'يقوم المدير بإنشاء ملفات MDM وربطها بالأجهزة ومعالجة المشاكل المرسلة من المستخدمين المجهولين.',
      assignedProfiles: 'الملفات المرتبطة',
      addDevice: 'إضافة جهاز',
      createProfile: 'إنشاء ملف',
      manageApps: 'إدارة التطبيقات',
      treatProblems: 'معالجة المشاكل',
      darkMode: 'الوضع الداكن',
      lightMode: 'الوضع الفاتح',
      autoLogoutOn: 'تسجيل الخروج التلقائي : مفعل',
      autoLogoutOff: 'تسجيل الخروج التلقائي : معطل',
      recentDevices: 'آخر الأجهزة',
      recentProblems: 'آخر المشاكل',
      seeAll: 'عرض الكل',
      loginTitle: 'تسجيل دخول المدير',
      loginSubtitle: 'الدخول مخصص للمدير فقط',
      loginButton: 'تسجيل الدخول',
      username: 'اسم المستخدم',
      password: 'كلمة المرور',
      appTitle: 'منصة MDM',
      appDescription: 'منصة مركزية لإدارة الأجهزة المجهولة وملفات MDM والتطبيقات والمشاكل المرسلة.',
      number: 'رقم',
      identifier: 'المعرّف',
      profile: 'الملف',
      status: 'الحالة',
      brand: 'الشركة',
      model: 'النموذج',
      os: 'النظام',
      profileMdm: 'ملف MDM',
      actions: 'الإجراءات',
      edit: 'تعديل',
      delete: 'حذف',
      update: 'تحديث',
      cancel: 'إلغاء',
      refresh: 'تحديث',
      searchDevice: 'ابحث عن جهاز...',
      searchProfile: 'ابحث عن ملف...',
      searchApp: 'ابحث عن تطبيق...',
      searchAlert: 'ابحث حسب الجهاز أو المشكلة أو الحالة أو الرد...',
      noDevice: 'لا يوجد جهاز.',
      noProfile: 'لا يوجد ملف.',
      noApp: 'لا يوجد تطبيق.',
      noAlert: 'لا توجد مشاكل.',
      noRegisteredDevice: 'لا توجد أجهزة مسجلة.',
      noRegisteredProblem: 'لا توجد مشاكل مسجلة.',
      addDeviceTitle: 'إضافة جهاز',
      editDeviceTitle: 'تعديل جهاز',
      deviceSubtitle: 'عند إضافة جهاز مجهول، يختار المدير مباشرة ملف MDM المرتبط به.',
      deviceIdentifierPlaceholder: 'معرّف الجهاز',
      imeiPlaceholder: 'IMEI الهاتف',
      imei: 'IMEI',
      brandPlaceholder: 'الشركة',
      modelPlaceholder: 'النموذج',
      osPlaceholder: 'نظام التشغيل',
      chooseProfile: 'اختر ملف MDM',
      addDeviceBtn: 'إضافة جهاز',
      updateDeviceBtn: 'تحديث',
      profileTitleAdd: 'إضافة ملف MDM',
      profileTitleEdit: 'تعديل ملف MDM',
      profileSubtitle: 'أنشئ ملف MDM جاهزاً للربط مع جهاز. كل ملف يحتوي على تطبيق واحد أو أكثر.',
      profileName: 'اسم الملف',
      description: 'الوصف',
      profileAppsTitle: 'تطبيقات الملف',
      profileAppsSubtitle: 'اختر تطبيقاً أو أكثر لهذا الملف.',
      availableApk: 'APK متوفر',
      noApkDefined: 'APK غير محدد',
      addProfileBtn: 'إضافة ملف',
      updateProfileBtn: 'تحديث الملف',
      profilesList: 'قائمة ملفات MDM',
      appsCount: 'عدد التطبيقات',
      viewApps: 'عرض التطبيقات',
      modalAppsTitle: 'تطبيقات الملف',
      noProfileApps: 'لا توجد تطبيقات مرتبطة بهذا الملف.',
      appTitleAdd: 'إضافة تطبيق',
      appTitleEdit: 'تعديل تطبيق',
      appName: 'اسم التطبيق',
      packageName: 'اسم الحزمة',
      version: 'الإصدار',
      apk: 'APK',
      apkLink: 'ملف APK',
      type: 'النوع',
      appList: 'قائمة التطبيقات',
      seeApk: 'تحميل APK',
      undefined: 'غير محدد',
      addAppBtn: 'إضافة تطبيق',
      updateAppBtn: 'تحديث',
      problemsTitle: 'المشاكل المرسلة من المستخدمين المجهولين',
      problemsSubtitle: 'هذه الصفحة تسمح للمدير بمتابعة المشاكل والرد على المستخدم المجهول ووضعها كمحلولة.',
      device: 'الجهاز',
      severity: 'الخطورة',
      problemType: 'النوع',
      problemFromUser: 'المشكلة المرسلة من المستخدم',
      sentAt: 'أُرسلت في',
      adminResponse: 'رد المدير',
      responsePlaceholder: 'اكتب رداً للمستخدم المجهول...',
      problemStatus: 'حالة المشكلة',
      currentResponse: 'الرد الحالي',
      resolvedAt: 'حُلّت في',
      sendResponse: 'إرسال الرد',
      markResolved: 'تحديد كمحلولة',
      showMore: 'عرض المزيد',
      showLess: 'عرض أقل',
      active: 'نشط',
      inactive: 'غير نشط',
      lost: 'مفقود',
      required: 'إجباري',
      optional: 'اختياري',
      blocked: 'محظور',
      appActive: 'نشط',
      appInactive: 'غير نشط',
      new: 'جديد',
      inProgress: 'قيد المعالجة',
      resolved: 'محلول',
      low: 'ضعيف',
      medium: 'متوسط',
      high: 'مرتفع',
      critical: 'حرج',
      chooseApkFile: 'اختيار ملف APK',
      replaceApkFile: 'استبدال ملف APK',
      selectedFile: 'الملف المختار',
      keepCurrentApk: 'سيتم الاحتفاظ بملف APK الحالي إذا لم تختر ملفاً جديداً',
      downloadApk: 'تحميل APK'
    }
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.restoreUiPreferences();
    this.restoreSession();
  }

  ngOnDestroy() {}

  sameId(firstId: any, secondId: any): boolean {
    return Number(firstId) === Number(secondId);
  }

  get isDarkMode(): boolean {
    return this.currentTheme === 'dark';
  }

  t(key: string): string {
    return this.translations[this.currentLanguage]?.[key] || key;
  }

  restoreUiPreferences() {
    const savedTheme = localStorage.getItem(this.themeKey);
    const savedLanguage = localStorage.getItem(this.languageKey);

    if (savedTheme === 'dark' || savedTheme === 'light') {
      this.currentTheme = savedTheme;
    }

    if (savedLanguage === 'fr' || savedLanguage === 'ar') {
      this.currentLanguage = savedLanguage;
    }

    this.applyTheme();
    this.applyLanguageDirection();
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem(this.themeKey, this.currentTheme);
    this.applyTheme();

    if (this.currentTheme === 'dark') {
      this.showSuccess(this.currentLanguage === 'ar' ? 'تم تفعيل الوضع الداكن' : 'Mode sombre activé');
    } else {
      this.showSuccess(this.currentLanguage === 'ar' ? 'تم تفعيل الوضع الفاتح' : 'Mode clair activé');
    }
  }

  applyTheme() {
    if (this.currentTheme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  toggleLanguage() {
    this.currentLanguage = this.currentLanguage === 'fr' ? 'ar' : 'fr';
    localStorage.setItem(this.languageKey, this.currentLanguage);
    this.applyLanguageDirection();

    if (this.currentLanguage === 'ar') {
      this.showSuccess('تم تغيير اللغة إلى العربية');
    } else {
      this.showSuccess('Langue changée en français');
    }
  }

  applyLanguageDirection() {
    if (this.currentLanguage === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'fr');
    }
  }

  restoreSession() {
    const autoLogoutValue = localStorage.getItem(this.autoLogoutKey);
    const loggedInValue = localStorage.getItem(this.loggedInKey);
    const savedToken = localStorage.getItem(this.tokenKey);

    if (autoLogoutValue === null) {
      this.autoLogoutEnabled = true;
      localStorage.setItem(this.autoLogoutKey, 'true');
    } else {
      this.autoLogoutEnabled = autoLogoutValue === 'true';
    }

    if (this.autoLogoutEnabled) {
      localStorage.removeItem(this.loggedInKey);
      localStorage.removeItem(this.tokenKey);
      this.adminToken = '';
      return;
    }

    if (!this.autoLogoutEnabled && loggedInValue === 'true' && savedToken) {
      this.adminToken = savedToken;
      this.isLoggedIn = true;
      this.message = this.currentLanguage === 'ar' ? 'تمت استعادة الجلسة' : 'Connexion restaurée';
      this.activeSection = 'dashboard';
      this.loadAllData();
      return;
    }

    localStorage.removeItem(this.loggedInKey);
    localStorage.removeItem(this.tokenKey);
    this.adminToken = '';
  }

  toggleAutoLogout() {
    this.autoLogoutEnabled = !this.autoLogoutEnabled;
    localStorage.setItem(this.autoLogoutKey, String(this.autoLogoutEnabled));

    if (this.autoLogoutEnabled) {
      localStorage.removeItem(this.loggedInKey);
      localStorage.removeItem(this.tokenKey);
      this.showSuccess(this.currentLanguage === 'ar' ? 'تم تفعيل تسجيل الخروج التلقائي' : 'Déconnexion automatique activée');
    } else {
      if (this.isLoggedIn) {
        localStorage.setItem(this.loggedInKey, 'true');

        if (this.adminToken) {
          localStorage.setItem(this.tokenKey, this.adminToken);
        }
      }

      this.showSuccess(this.currentLanguage === 'ar' ? 'تم تعطيل تسجيل الخروج التلقائي' : 'Déconnexion automatique désactivée');
    }
  }

  saveSessionAccordingToAutoLogoutMode() {
    localStorage.setItem(this.autoLogoutKey, String(this.autoLogoutEnabled));

    if (this.autoLogoutEnabled) {
      localStorage.removeItem(this.loggedInKey);
      localStorage.removeItem(this.tokenKey);
    } else {
      localStorage.setItem(this.loggedInKey, 'true');

      if (this.adminToken) {
        localStorage.setItem(this.tokenKey, this.adminToken);
      }
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  setSectionAndCloseSidebar(section: string) {
    this.setSection(section);
    this.closeSidebar();
  }

  scrollToForm(formId: string) {
    setTimeout(() => {
      const form = document.getElementById(formId);
      const mainContent = document.querySelector('.main-content');

      if (form && mainContent) {
        const formPosition = form.offsetTop - 20;

        mainContent.scrollTo({
          top: formPosition,
          behavior: 'smooth'
        });
      }

      if (form) {
        form.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  }

  showSuccess(message: string) {
    this.alertType = 'success';
    this.alertMessage = message;

    setTimeout(() => {
      if (this.alertMessage === message) {
        this.alertMessage = '';
      }
    }, 3000);
  }

  showError(message: string) {
    this.alertType = 'error';
    this.alertMessage = message;

    setTimeout(() => {
      if (this.alertMessage === message) {
        this.alertMessage = '';
      }
    }, 4000);
  }

  clearAlert() {
    this.alertMessage = '';
  }

  isEmpty(value: any): boolean {
    return value === null || value === undefined || String(value).trim() === '';
  }

  getAuthOptions() {
    const token = this.adminToken || localStorage.getItem(this.tokenKey) || '';

    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  saveAdminToken(token: string) {
    this.adminToken = token;

    if (this.autoLogoutEnabled) {
      localStorage.removeItem(this.tokenKey);
    } else {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  clearAdminToken() {
    this.adminToken = '';
    localStorage.removeItem(this.tokenKey);
  }

  login() {
    if (this.isEmpty(this.username) || this.isEmpty(this.password)) {
      this.message = this.currentLanguage === 'ar'
        ? 'يرجى إدخال اسم المستخدم وكلمة المرور'
        : 'Veuillez remplir le nom d’utilisateur et le mot de passe';
      return;
    }

    const data = {
      username: this.username,
      password: this.password
    };

    this.http.post<any>(`${this.apiUrl}/auth/login`, data)
      .subscribe({
        next: (response) => {
          const token = response?.token || '';

          if (this.isEmpty(token)) {
            this.showError(this.currentLanguage === 'ar'
              ? 'تم تسجيل الدخول لكن لم يتم استلام رمز الحماية'
              : 'Connexion reçue, mais aucun token de sécurité n’a été retourné');
            return;
          }

          this.saveAdminToken(token);

          this.isLoggedIn = true;
          this.message = response.message;
          this.activeSection = 'dashboard';

          this.saveSessionAccordingToAutoLogoutMode();
          this.loadAllData();

          this.showSuccess(this.currentLanguage === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Connexion réussie');
        },
        error: () => {
          this.message = this.currentLanguage === 'ar'
            ? 'اسم المستخدم أو كلمة المرور غير صحيحة'
            : 'Nom d’utilisateur ou mot de passe incorrect';
        }
      });
  }

  logout() {
    localStorage.removeItem(this.loggedInKey);
    this.clearAdminToken();

    this.isLoggedIn = false;
    this.username = '';
    this.password = '';
    this.message = '';
    this.activeSection = 'dashboard';
    this.alertMessage = '';

    this.devices = [];
    this.profiles = [];
    this.apps = [];
    this.profileApps = [];
    this.deviceProfiles = [];
    this.alerts = [];

    this.selectedProfileForAppsView = null;
    this.selectedProfileApps = [];

    this.deviceSearch = '';
    this.profileSearch = '';
    this.appSearch = '';
    this.profileAppSearch = '';
    this.alertSearch = '';

    this.resetShowMoreLists();

    this.resetDeviceForm();
    this.resetProfileForm();
    this.resetAppForm();
  }

  setSection(section: string) {
    this.activeSection = section;
    this.clearAlert();
    this.resetShowMoreLists();

    if (section === 'dashboard') {
      this.loadAllData();
    }

    if (section === 'devices') {
      this.loadDevices();
      this.loadProfiles();
      this.loadDeviceProfiles();
    }

    if (section === 'profiles') {
      this.loadProfiles();
      this.loadApps();
      this.loadProfileApps();
    }

    if (section === 'apps') {
      this.loadApps();
    }

    if (section === 'alerts') {
      this.loadAlerts();
      this.loadDeviceProfiles();
    }
  }

  loadAllData() {
    this.loadDevices();
    this.loadProfiles();
    this.loadApps();
    this.loadProfileApps();
    this.loadDeviceProfiles();
    this.loadAlerts();
  }

  resetShowMoreLists() {
    this.showAllDevices = false;
    this.showAllProfiles = false;
    this.showAllProfileApps = false;
    this.showAllApps = false;
    this.showAllAlerts = false;
  }

  get sortedApps() {
    return [...this.apps].sort((a, b) =>
      String(a.name || '').localeCompare(String(b.name || ''))
    );
  }

  get filteredDevices() {
    const search = this.deviceSearch.toLowerCase();

    return this.devices.filter(device =>
      String(device.id).includes(search) ||
      String(device.deviceIdentifier || '').toLowerCase().includes(search) ||
      String(device.imei || '').toLowerCase().includes(search) ||
      String(device.brand || '').toLowerCase().includes(search) ||
      String(device.model || '').toLowerCase().includes(search) ||
      String(device.os || '').toLowerCase().includes(search) ||
      String(device.status || '').toLowerCase().includes(search) ||
      String(this.getDeviceStatusLabel(device.status)).toLowerCase().includes(search) ||
      String(this.getProfileNameForDevice(device.id)).toLowerCase().includes(search)
    );
  }

  get visibleDevices() {
    return this.showAllDevices
      ? this.filteredDevices
      : this.filteredDevices.slice(0, this.listLimit);
  }

  get filteredProfiles() {
    const search = this.profileSearch.toLowerCase();

    return this.profiles.filter(profile =>
      String(profile.id).includes(search) ||
      String(profile.name || '').toLowerCase().includes(search) ||
      String(profile.description || '').toLowerCase().includes(search) ||
      String(profile.status || '').toLowerCase().includes(search) ||
      String(this.getProfileStatusLabel(profile.status)).toLowerCase().includes(search)
    );
  }

  get visibleProfiles() {
    return this.showAllProfiles
      ? this.filteredProfiles
      : this.filteredProfiles.slice(0, this.listLimit);
  }

  get filteredApps() {
    const search = this.appSearch.toLowerCase();

    return this.apps.filter(app =>
      String(app.id).includes(search) ||
      String(app.name || '').toLowerCase().includes(search) ||
      String(app.packageName || '').toLowerCase().includes(search) ||
      String(app.version || '').toLowerCase().includes(search) ||
      String(app.apkUrl || '').toLowerCase().includes(search) ||
      String(app.apkOriginalName || '').toLowerCase().includes(search) ||
      String(app.type || '').toLowerCase().includes(search) ||
      String(this.getAppTypeLabel(app.type)).toLowerCase().includes(search) ||
      String(app.status || '').toLowerCase().includes(search) ||
      String(this.getAppStatusLabel(app.status)).toLowerCase().includes(search)
    );
  }

  get visibleApps() {
    return this.showAllApps
      ? this.filteredApps
      : this.filteredApps.slice(0, this.listLimit);
  }

  get filteredAlerts() {
    const search = this.alertSearch.toLowerCase();

    return this.alerts.filter(alert =>
      String(alert.id).includes(search) ||
      String(alert.type || '').toLowerCase().includes(search) ||
      String(this.getAlertTypeLabel(alert.type)).toLowerCase().includes(search) ||
      String(alert.severity || '').toLowerCase().includes(search) ||
      String(this.getSeverityLabel(alert.severity)).toLowerCase().includes(search) ||
      String(alert.status || '').toLowerCase().includes(search) ||
      String(this.getAlertStatusLabel(alert.status)).toLowerCase().includes(search) ||
      String(alert.message || '').toLowerCase().includes(search) ||
      String(alert.adminResponse || '').toLowerCase().includes(search) ||
      String(alert.device?.deviceIdentifier || '').toLowerCase().includes(search) ||
      String(alert.device?.imei || '').toLowerCase().includes(search) ||
      String(alert.device?.brand || '').toLowerCase().includes(search) ||
      String(this.getProfileNameForDevice(alert.device?.id)).toLowerCase().includes(search)
    );
  }

  get visibleAlerts() {
    return this.showAllAlerts
      ? this.filteredAlerts
      : this.filteredAlerts.slice(0, this.listLimit);
  }

  getDeviceStatusLabel(status: string): string {
    const labels: any = {
      ACTIVE: this.t('active'),
      INACTIVE: this.t('inactive'),
      LOST: this.t('lost')
    };

    return labels[status] || status || '';
  }

  getProfileStatusLabel(status: string): string {
    const labels: any = {
      ACTIVE: this.t('active'),
      INACTIVE: this.t('inactive')
    };

    return labels[status] || status || '';
  }

  getAppTypeLabel(type: string): string {
    const labels: any = {
      REQUIRED: this.t('required'),
      OPTIONAL: this.t('optional'),
      BLOCKED: this.t('blocked')
    };

    return labels[type] || type || '';
  }

  getAppStatusLabel(status: string): string {
    const labels: any = {
      ACTIVE: this.t('appActive'),
      INACTIVE: this.t('appInactive')
    };

    return labels[status] || status || '';
  }

  getAlertStatusLabel(status: string): string {
    const labels: any = {
      NEW: this.t('new'),
      IN_PROGRESS: this.t('inProgress'),
      RESOLVED: this.t('resolved')
    };

    return labels[status] || status || '';
  }

  getSeverityLabel(severity: string): string {
    const labels: any = {
      LOW: this.t('low'),
      MEDIUM: this.t('medium'),
      HIGH: this.t('high'),
      CRITICAL: this.t('critical')
    };

    return labels[severity] || severity || '';
  }

  getAlertTypeLabel(type: string): string {
    const labels: any = {
      DEVICE_LOST: this.currentLanguage === 'ar' ? 'جهاز مفقود' : 'Appareil perdu',
      PROFILE_NOT_APPLIED: this.currentLanguage === 'ar' ? 'الملف غير مطبق' : 'Profil non appliqué',
      APP_MISSING: this.currentLanguage === 'ar' ? 'تطبيق مفقود' : 'Application manquante',
      COMMAND_FAILED: this.currentLanguage === 'ar' ? 'فشل الإجراء' : 'Action échouée',
      SECURITY_RISK: this.currentLanguage === 'ar' ? 'خطر أمني' : 'Risque de sécurité'
    };

    return labels[type] || type || '';
  }

  getProfileNameForDevice(deviceId: number): string {
    const item = this.deviceProfiles.find(dp =>
      this.sameId(dp.device?.id, deviceId)
    );

    return item?.profile?.name || (this.currentLanguage === 'ar' ? 'لا يوجد ملف' : 'Aucun profil');
  }

  getAppsCountForProfile(profileId: number): number {
    return this.profileApps.filter(pa =>
      this.sameId(pa.profile?.id, profileId)
    ).length;
  }

  isAppSelected(appId: number): boolean {
    return this.selectedAppIdsForProfile.includes(String(appId));
  }

  toggleAppForProfile(appId: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const id = String(appId);

    if (checked) {
      if (!this.selectedAppIdsForProfile.includes(id)) {
        this.selectedAppIdsForProfile.push(id);
      }
    } else {
      this.selectedAppIdsForProfile = this.selectedAppIdsForProfile.filter(item => item !== id);
    }
  }

  openProfileAppsModal(profile: any): void {
    this.selectedProfileForAppsView = profile;
    this.selectedProfileApps = this.getAppsForProfileView(profile.id);
  }

  closeProfileAppsModal(): void {
    this.selectedProfileForAppsView = null;
    this.selectedProfileApps = [];
  }

  getAppsForProfileView(profileId: number): any[] {
    const list = (this.profileApps || [])
      .filter((item: any) => {
        const currentProfileId =
          item.profile?.id ??
          item.mdmProfile?.id ??
          item.profileId ??
          item.mdmProfileId ??
          null;

        return Number(currentProfileId) === Number(profileId);
      })
      .map((item: any) => {
        const appData = item.app ?? item.application ?? item;

        return {
          profileAppId: item.id ?? item.profileAppId ?? null,
          appName: appData.name ?? item.appName ?? 'Application',
          packageName: appData.packageName ?? item.packageName ?? '-',
          apkUrl: appData.apkUrl ?? item.apkUrl ?? '',
          apkOriginalName: appData.apkOriginalName ?? item.apkOriginalName ?? ''
        };
      });

    return list.filter((app: any, index: number, self: any[]) =>
      index === self.findIndex((a: any) =>
        a.appName === app.appName && a.packageName === app.packageName
      )
    );
  }

  loadDevices() {
    this.http.get<any[]>(`${this.apiUrl}/devices`, this.getAuthOptions())
      .subscribe({
        next: (data) => {
          this.devices = data;
        },
        error: () => {
          this.showError(this.currentLanguage === 'ar'
            ? 'خطأ أثناء تحميل الأجهزة'
            : 'Erreur lors du chargement des appareils');
        }
      });
  }

  saveDevice() {
    if (
      this.isEmpty(this.newDevice.deviceIdentifier) ||
      this.isEmpty(this.newDevice.imei) ||
      this.isEmpty(this.newDevice.brand) ||
      this.isEmpty(this.newDevice.model) ||
      this.isEmpty(this.newDevice.os) ||
      this.isEmpty(this.newDevice.status) ||
      this.isEmpty(this.selectedProfileForDeviceForm)
    ) {
      this.showError(this.currentLanguage === 'ar'
        ? 'يرجى ملء جميع الحقول واختيار ملف'
        : 'Veuillez remplir tous les champs et choisir un profil');
      return;
    }

    if (this.editingDeviceId) {
      this.http.put<any>(`${this.apiUrl}/devices/${this.editingDeviceId}`, this.newDevice, this.getAuthOptions())
        .subscribe({
          next: (updatedDevice) => {
            const deviceId = updatedDevice?.id || this.editingDeviceId;

            this.devices = this.devices.map(device =>
              this.sameId(device.id, deviceId) ? updatedDevice : device
            );

            if (deviceId) {
              this.assignProfileToDevice(deviceId, this.selectedProfileForDeviceForm);
            }

            this.resetDeviceForm();

            this.showSuccess(this.currentLanguage === 'ar'
              ? 'تم تعديل الجهاز وتحديث الملف'
              : 'Appareil modifié et profil mis à jour');
          },
          error: () => {
            this.showError(this.currentLanguage === 'ar'
              ? 'خطأ أثناء تعديل الجهاز'
              : 'Erreur lors de la modification de l’appareil');
          }
        });
    } else {
      this.http.post<any>(`${this.apiUrl}/devices`, this.newDevice, this.getAuthOptions())
        .subscribe({
          next: (createdDevice) => {
            this.devices = [...this.devices, createdDevice];

            this.assignProfileToDevice(
              createdDevice.id,
              this.selectedProfileForDeviceForm
            );

            this.resetDeviceForm();

            this.showSuccess(this.currentLanguage === 'ar'
              ? 'تمت إضافة الجهاز مع ملفه'
              : 'Appareil ajouté avec son profil');
          },
          error: () => {
            this.showError(this.currentLanguage === 'ar'
              ? 'خطأ أثناء إضافة الجهاز'
              : 'Erreur lors de l’ajout de l’appareil');
          }
        });
    }
  }

  assignProfileToDevice(deviceId: number, profileId: string) {
    this.http.post<any>(
      `${this.apiUrl}/device-profiles?deviceId=${deviceId}&profileId=${profileId}&active=true`,
      {},
      this.getAuthOptions()
    ).subscribe({
      next: (savedDeviceProfile) => {
        this.deviceProfiles = this.deviceProfiles.filter(dp =>
          !this.sameId(dp.device?.id, deviceId)
        );

        this.deviceProfiles = [...this.deviceProfiles, savedDeviceProfile];
      },
      error: () => {
        this.showError(this.currentLanguage === 'ar'
          ? 'تم إنشاء الجهاز لكن حدث خطأ أثناء ربط الملف'
          : 'Appareil créé, mais erreur lors de l’affectation du profil');
      }
    });
  }

  editDevice(device: any) {
    this.editingDeviceId = device.id;

    this.newDevice = {
      deviceIdentifier: device.deviceIdentifier || '',
      imei: device.imei || '',
      brand: device.brand || '',
      model: device.model || '',
      os: device.os || '',
      status: device.status || 'ACTIVE'
    };

    const existingProfile = this.deviceProfiles.find(dp =>
      this.sameId(dp.device?.id, device.id)
    );

    this.selectedProfileForDeviceForm = existingProfile?.profile?.id
      ? String(existingProfile.profile.id)
      : '';

    this.showSuccess(this.currentLanguage === 'ar'
      ? 'تم تفعيل وضع تعديل الجهاز'
      : 'Mode modification appareil activé');

    this.scrollToForm('device-form');
  }

  resetDeviceForm() {
    this.editingDeviceId = null;
    this.selectedProfileForDeviceForm = '';

    this.newDevice = {
      deviceIdentifier: '',
      imei: '',
      brand: '',
      model: '',
      os: '',
      status: 'ACTIVE'
    };
  }

  cancelEditDevice() {
    this.resetDeviceForm();

    this.showSuccess(this.currentLanguage === 'ar'
      ? 'تم إلغاء تعديل الجهاز'
      : 'Modification appareil annulée');
  }

  deleteDevice(id: number) {
    const confirmed = confirm(this.currentLanguage === 'ar'
      ? 'هل تريد فعلاً حذف هذا الجهاز؟'
      : 'Voulez-vous vraiment supprimer cet appareil ?');

    if (!confirmed) {
      return;
    }

    const oldDevices = [...this.devices];
    const oldDeviceProfiles = [...this.deviceProfiles];
    const oldAlerts = [...this.alerts];

    this.devices = this.devices.filter(device => !this.sameId(device.id, id));
    this.deviceProfiles = this.deviceProfiles.filter(dp => !this.sameId(dp.device?.id, id));
    this.alerts = this.alerts.filter(alert => !this.sameId(alert.device?.id, id));

    if (this.editingDeviceId && this.sameId(this.editingDeviceId, id)) {
      this.resetDeviceForm();
    }

    this.http.delete(`${this.apiUrl}/devices/${id}`, this.getAuthOptions())
      .subscribe({
        next: () => {
          this.showSuccess(this.currentLanguage === 'ar'
            ? 'تم حذف الجهاز بنجاح'
            : 'Appareil supprimé avec succès');
        },
        error: () => {
          this.devices = oldDevices;
          this.deviceProfiles = oldDeviceProfiles;
          this.alerts = oldAlerts;

          this.showError(this.currentLanguage === 'ar'
            ? 'خطأ أثناء حذف الجهاز'
            : 'Erreur lors de la suppression de l’appareil');
        }
      });
  }

  loadProfiles() {
    this.http.get<any[]>(`${this.apiUrl}/profiles`, this.getAuthOptions())
      .subscribe({
        next: (data) => {
          this.profiles = data;
        },
        error: () => {
          this.showError(this.currentLanguage === 'ar'
            ? 'خطأ أثناء تحميل الملفات'
            : 'Erreur lors du chargement des profils');
        }
      });
  }

  saveProfile() {
    if (
      this.isEmpty(this.newProfile.name) ||
      this.isEmpty(this.newProfile.description) ||
      this.isEmpty(this.newProfile.status)
    ) {
      this.showError(this.currentLanguage === 'ar'
        ? 'يرجى ملء جميع حقول الملف'
        : 'Veuillez remplir tous les champs du profil');
      return;
    }

    if (this.selectedAppIdsForProfile.length === 0) {
      this.showError(this.currentLanguage === 'ar'
        ? 'يرجى اختيار تطبيق واحد على الأقل'
        : 'Veuillez choisir au moins une application pour ce profil');
      return;
    }

    if (this.editingProfileId) {
      this.http.put<any>(`${this.apiUrl}/profiles/${this.editingProfileId}`, this.newProfile, this.getAuthOptions())
        .subscribe({
          next: (updatedProfile) => {
            const profileId = updatedProfile?.id || this.editingProfileId;

            this.profiles = this.profiles.map(profile =>
              this.sameId(profile.id, profileId) ? updatedProfile : profile
            );

            if (profileId) {
              this.saveAppsForProfile(profileId);
            }

            this.resetProfileForm();

            this.showSuccess(this.currentLanguage === 'ar'
              ? 'تم تعديل الملف مع تطبيقاته'
              : 'Profil MDM modifié avec ses applications');
          },
          error: () => {
            this.showError(this.currentLanguage === 'ar'
              ? 'خطأ أثناء تعديل الملف'
              : 'Erreur lors de la modification du profil');
          }
        });
    } else {
      this.http.post<any>(`${this.apiUrl}/profiles`, this.newProfile, this.getAuthOptions())
        .subscribe({
          next: (createdProfile) => {
            this.profiles = [...this.profiles, createdProfile];

            this.saveAppsForProfile(createdProfile.id);
            this.resetProfileForm();

            this.showSuccess(this.currentLanguage === 'ar'
              ? 'تمت إضافة الملف مع تطبيقاته'
              : 'Profil MDM ajouté avec ses applications');
          },
          error: () => {
            this.showError(this.currentLanguage === 'ar'
              ? 'خطأ أثناء إضافة الملف'
              : 'Erreur lors de l’ajout du profil');
          }
        });
    }
  }

  saveAppsForProfile(profileId: number) {
    const body = {
      appIds: this.selectedAppIdsForProfile.map(id => Number(id))
    };

    this.http.post<any[]>(
      `${this.apiUrl}/profile-apps/profile/${profileId}/apps`,
      body,
      this.getAuthOptions()
    ).subscribe({
      next: (savedProfileApps) => {
        this.profileApps = this.profileApps.filter(pa =>
          !this.sameId(pa.profile?.id, profileId)
        );

        this.profileApps = [...this.profileApps, ...savedProfileApps];

        if (
          this.selectedProfileForAppsView &&
          this.sameId(this.selectedProfileForAppsView.id, profileId)
        ) {
          this.selectedProfileApps = this.getAppsForProfileView(profileId);
        }
      },
      error: () => {
        this.showError(this.currentLanguage === 'ar'
          ? 'تم إنشاء الملف لكن حدث خطأ في ربط التطبيقات'
          : 'Profil créé, mais erreur lors de l’association des applications');
      }
    });
  }

  editProfile(profile: any) {
    this.editingProfileId = profile.id;

    this.newProfile = {
      name: profile.name,
      description: profile.description,
      status: profile.status
    };

    this.http.get<any[]>(`${this.apiUrl}/profile-apps/profile/${profile.id}`, this.getAuthOptions())
      .subscribe({
        next: (data) => {
          this.selectedAppIdsForProfile = data.map(item => String(item.app?.id));
        },
        error: () => {
          this.selectedAppIdsForProfile = [];
        }
      });

    this.showSuccess(this.currentLanguage === 'ar'
      ? 'تم تفعيل وضع تعديل الملف'
      : 'Mode modification profil activé');

    this.scrollToForm('profile-form');
  }

  resetProfileForm() {
    this.editingProfileId = null;
    this.selectedAppIdsForProfile = [];

    this.newProfile = {
      name: '',
      description: '',
      status: 'ACTIVE'
    };
  }

  cancelEditProfile() {
    this.resetProfileForm();

    this.showSuccess(this.currentLanguage === 'ar'
      ? 'تم إلغاء تعديل الملف'
      : 'Modification profil annulée');
  }

  deleteProfile(id: number) {
    const confirmed = confirm(this.currentLanguage === 'ar'
      ? 'هل تريد فعلاً حذف هذا الملف؟'
      : 'Voulez-vous vraiment supprimer ce profil MDM ?');

    if (!confirmed) {
      return;
    }

    const oldProfiles = [...this.profiles];
    const oldProfileApps = [...this.profileApps];
    const oldDeviceProfiles = [...this.deviceProfiles];

    this.profiles = this.profiles.filter(profile => !this.sameId(profile.id, id));
    this.profileApps = this.profileApps.filter(pa => !this.sameId(pa.profile?.id, id));
    this.deviceProfiles = this.deviceProfiles.filter(dp => !this.sameId(dp.profile?.id, id));

    if (this.editingProfileId && this.sameId(this.editingProfileId, id)) {
      this.resetProfileForm();
    }

    if (this.selectedProfileForAppsView && this.sameId(this.selectedProfileForAppsView.id, id)) {
      this.closeProfileAppsModal();
    }

    this.http.delete(`${this.apiUrl}/profiles/${id}`, this.getAuthOptions())
      .subscribe({
        next: () => {
          this.showSuccess(this.currentLanguage === 'ar'
            ? 'تم حذف الملف بنجاح'
            : 'Profil MDM supprimé avec succès');
        },
        error: () => {
          this.profiles = oldProfiles;
          this.profileApps = oldProfileApps;
          this.deviceProfiles = oldDeviceProfiles;

          this.showError(this.currentLanguage === 'ar'
            ? 'خطأ أثناء حذف الملف'
            : 'Erreur lors de la suppression du profil');
        }
      });
  }

  loadApps() {
    this.http.get<any[]>(`${this.apiUrl}/apps`, this.getAuthOptions())
      .subscribe({
        next: (data) => {
          this.apps = data;
        },
        error: () => {
          this.showError(this.currentLanguage === 'ar'
            ? 'خطأ أثناء تحميل التطبيقات'
            : 'Erreur lors du chargement des applications');
        }
      });
  }

  onApkFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.selectedApkFile = null;
      this.selectedApkFileName = '';
      return;
    }

    const file = input.files[0];

    if (!file.name.toLowerCase().endsWith('.apk')) {
      this.selectedApkFile = null;
      this.selectedApkFileName = '';
      input.value = '';

      this.showError(this.currentLanguage === 'ar'
        ? 'يرجى اختيار ملف بصيغة APK فقط'
        : 'Veuillez choisir uniquement un fichier APK');

      return;
    }

    this.selectedApkFile = file;
    this.selectedApkFileName = file.name;

    this.showSuccess(this.currentLanguage === 'ar'
      ? 'تم اختيار ملف APK'
      : 'Fichier APK sélectionné');
  }

  saveApp() {
    if (
      this.isEmpty(this.newApp.name) ||
      this.isEmpty(this.newApp.packageName) ||
      this.isEmpty(this.newApp.version) ||
      this.isEmpty(this.newApp.type) ||
      this.isEmpty(this.newApp.status)
    ) {
      this.showError(this.currentLanguage === 'ar'
        ? 'يرجى ملء جميع حقول التطبيق'
        : 'Veuillez remplir tous les champs de l’application');
      return;
    }

    if (!this.editingAppId && !this.selectedApkFile) {
      this.showError(this.currentLanguage === 'ar'
        ? 'يرجى اختيار ملف APK'
        : 'Veuillez choisir un fichier APK');
      return;
    }

    const formData = new FormData();

    formData.append('name', this.newApp.name);
    formData.append('packageName', this.newApp.packageName);
    formData.append('version', this.newApp.version);
    formData.append('type', this.newApp.type);
    formData.append('status', this.newApp.status);

    if (this.selectedApkFile) {
      formData.append('apkFile', this.selectedApkFile);
    }

    if (this.editingAppId) {
      this.http.put<any>(`${this.apiUrl}/apps/${this.editingAppId}`, formData, this.getAuthOptions())
        .subscribe({
          next: (updatedApp) => {
            this.apps = this.apps.map(app =>
              this.sameId(app.id, updatedApp.id) ? updatedApp : app
            );

            this.profileApps = this.profileApps.map(profileApp => {
              if (this.sameId(profileApp.app?.id, updatedApp.id)) {
                return {
                  ...profileApp,
                  app: updatedApp
                };
              }

              return profileApp;
            });

            if (this.selectedProfileForAppsView) {
              this.selectedProfileApps = this.getAppsForProfileView(
                this.selectedProfileForAppsView.id
              );
            }

            this.resetAppForm();

            this.showSuccess(this.currentLanguage === 'ar'
              ? 'تم تعديل التطبيق وملف APK بنجاح'
              : 'Application et fichier APK modifiés avec succès');
          },
          error: () => {
            this.showError(this.currentLanguage === 'ar'
              ? 'خطأ أثناء تعديل التطبيق'
              : 'Erreur lors de la modification de l’application');
          }
        });
    } else {
      this.http.post<any>(`${this.apiUrl}/apps`, formData, this.getAuthOptions())
        .subscribe({
          next: (createdApp) => {
            this.apps = [...this.apps, createdApp];
            this.resetAppForm();

            this.showSuccess(this.currentLanguage === 'ar'
              ? 'تمت إضافة التطبيق مع ملف APK بنجاح'
              : 'Application ajoutée avec fichier APK');
          },
          error: () => {
            this.showError(this.currentLanguage === 'ar'
              ? 'خطأ أثناء إضافة التطبيق'
              : 'Erreur lors de l’ajout de l’application');
          }
        });
    }
  }

  editApp(app: any) {
    this.editingAppId = app.id;

    this.newApp = {
      name: app.name,
      packageName: app.packageName,
      version: app.version,
      type: app.type,
      status: app.status
    };

    this.selectedApkFile = null;
    this.selectedApkFileName = app.apkOriginalName || '';

    this.showSuccess(this.currentLanguage === 'ar'
      ? 'تم تفعيل وضع تعديل التطبيق'
      : 'Mode modification application activé');

    this.scrollToForm('app-form');
  }

  resetAppForm() {
    this.editingAppId = null;
    this.selectedApkFile = null;
    this.selectedApkFileName = '';

    this.newApp = {
      name: '',
      packageName: '',
      version: '',
      type: 'REQUIRED',
      status: 'ACTIVE'
    };

    const apkInput = document.getElementById('apk-file-input') as HTMLInputElement;

    if (apkInput) {
      apkInput.value = '';
    }
  }

  cancelEditApp() {
    this.resetAppForm();

    this.showSuccess(this.currentLanguage === 'ar'
      ? 'تم إلغاء تعديل التطبيق'
      : 'Modification application annulée');
  }

  deleteApp(id: number) {
    const confirmed = confirm(this.currentLanguage === 'ar'
      ? 'هل تريد فعلاً حذف هذا التطبيق؟'
      : 'Voulez-vous vraiment supprimer cette application ?');

    if (!confirmed) {
      return;
    }

    const oldApps = [...this.apps];
    const oldProfileApps = [...this.profileApps];

    this.apps = this.apps.filter(app => !this.sameId(app.id, id));
    this.profileApps = this.profileApps.filter(profileApp => !this.sameId(profileApp.app?.id, id));

    if (this.editingAppId && this.sameId(this.editingAppId, id)) {
      this.resetAppForm();
    }

    if (this.selectedProfileForAppsView) {
      this.selectedProfileApps = this.getAppsForProfileView(this.selectedProfileForAppsView.id);
    }

    this.http.delete(`${this.apiUrl}/apps/${id}`, this.getAuthOptions())
      .subscribe({
        next: () => {
          this.showSuccess(this.currentLanguage === 'ar'
            ? 'تم حذف التطبيق بنجاح'
            : 'Application supprimée avec succès');
        },
        error: () => {
          this.apps = oldApps;
          this.profileApps = oldProfileApps;

          if (this.selectedProfileForAppsView) {
            this.selectedProfileApps = this.getAppsForProfileView(this.selectedProfileForAppsView.id);
          }

          this.showError(this.currentLanguage === 'ar'
            ? 'خطأ أثناء حذف التطبيق'
            : 'Erreur lors de la suppression de l’application');
        }
      });
  }

  loadProfileApps() {
    this.http.get<any[]>(`${this.apiUrl}/profile-apps`, this.getAuthOptions())
      .subscribe({
        next: (data) => {
          this.profileApps = data;
        },
        error: () => {
          this.showError(this.currentLanguage === 'ar'
            ? 'خطأ أثناء تحميل تطبيقات الملف'
            : 'Erreur lors du chargement des applications du profil');
        }
      });
  }

  deleteProfileApp(id: number) {
    const confirmed = confirm(this.currentLanguage === 'ar'
      ? 'هل تريد فعلاً إزالة هذا التطبيق من الملف؟'
      : 'Voulez-vous vraiment retirer cette application du profil ?');

    if (!confirmed) {
      return;
    }

    const oldProfileApps = [...this.profileApps];

    this.profileApps = this.profileApps.filter(profileApp =>
      !this.sameId(profileApp.id, id)
    );

    if (this.selectedProfileForAppsView) {
      this.selectedProfileApps = this.getAppsForProfileView(this.selectedProfileForAppsView.id);
    }

    this.http.delete(`${this.apiUrl}/profile-apps/${id}`, this.getAuthOptions())
      .subscribe({
        next: () => {
          this.showSuccess(this.currentLanguage === 'ar'
            ? 'تمت إزالة التطبيق من الملف بنجاح'
            : 'Application retirée du profil avec succès');
        },
        error: () => {
          this.profileApps = oldProfileApps;

          if (this.selectedProfileForAppsView) {
            this.selectedProfileApps = this.getAppsForProfileView(this.selectedProfileForAppsView.id);
          }

          this.showError(this.currentLanguage === 'ar'
            ? 'خطأ أثناء الحذف'
            : 'Erreur lors de la suppression');
        }
      });
  }

  loadDeviceProfiles() {
    this.http.get<any[]>(`${this.apiUrl}/device-profiles`, this.getAuthOptions())
      .subscribe({
        next: (data) => {
          this.deviceProfiles = data;
        },
        error: () => {
          this.showError(this.currentLanguage === 'ar'
            ? 'خطأ أثناء تحميل الملفات المرتبطة'
            : 'Erreur lors du chargement des profils affectés');
        }
      });
  }

  loadAlerts() {
    this.http.get<any[]>(`${this.apiUrl}/alerts`, this.getAuthOptions())
      .subscribe({
        next: (data) => {
          this.alerts = data;
        },
        error: () => {
          this.showError(this.currentLanguage === 'ar'
            ? 'خطأ أثناء تحميل المشاكل'
            : 'Erreur lors du chargement des alertes');
        }
      });
  }

  saveAlertResponse(alert: any) {
    if (this.isEmpty(alert.adminResponse)) {
      this.showError(this.currentLanguage === 'ar'
        ? 'يرجى كتابة رد للمستخدم'
        : 'Veuillez écrire une réponse pour l’utilisateur');
      return;
    }

    const body = {
      adminResponse: alert.adminResponse,
      status: alert.status
    };

    this.http.put<any>(
      `${this.apiUrl}/alerts/${alert.id}/response`,
      body,
      this.getAuthOptions()
    ).subscribe({
      next: (updatedAlert) => {
        this.alerts = this.alerts.map(item =>
          this.sameId(item.id, updatedAlert.id) ? updatedAlert : item
        );

        this.showSuccess(this.currentLanguage === 'ar'
          ? 'تم إرسال الرد بنجاح'
          : 'Réponse envoyée avec succès');
      },
      error: () => {
        this.showError(this.currentLanguage === 'ar'
          ? 'خطأ أثناء إرسال الرد'
          : 'Erreur lors de l’envoi de la réponse');
      }
    });
  }

  updateAlertStatus(alert: any) {
    const body = {
      adminResponse: alert.adminResponse || '',
      status: alert.status
    };

    this.http.put<any>(
      `${this.apiUrl}/alerts/${alert.id}/response`,
      body,
      this.getAuthOptions()
    ).subscribe({
      next: (updatedAlert) => {
        this.alerts = this.alerts.map(item =>
          this.sameId(item.id, updatedAlert.id) ? updatedAlert : item
        );

        this.showSuccess(this.currentLanguage === 'ar'
          ? 'تم تعديل حالة المشكلة'
          : 'Statut du problème modifié');
      },
      error: () => {
        this.showError(this.currentLanguage === 'ar'
          ? 'خطأ أثناء تعديل الحالة'
          : 'Erreur lors de la modification du statut');
      }
    });
  }

  markAlertResolved(alert: any) {
    alert.status = 'RESOLVED';

    const body = {
      adminResponse: alert.adminResponse || (this.currentLanguage === 'ar'
        ? 'تمت معالجة المشكلة من طرف المدير.'
        : 'Problème traité par l’administrateur.'),
      status: 'RESOLVED'
    };

    this.http.put<any>(
      `${this.apiUrl}/alerts/${alert.id}/response`,
      body,
      this.getAuthOptions()
    ).subscribe({
      next: (updatedAlert) => {
        this.alerts = this.alerts.map(item =>
          this.sameId(item.id, updatedAlert.id) ? updatedAlert : item
        );

        this.showSuccess(this.currentLanguage === 'ar'
          ? 'تم تحديد المشكلة كمحلولة'
          : 'Problème marqué comme résolu');
      },
      error: () => {
        this.showError(this.currentLanguage === 'ar'
          ? 'خطأ أثناء حل المشكلة'
          : 'Erreur lors de la résolution du problème');
      }
    });
  }

  deleteAlert(id: number) {
    const confirmed = confirm(this.currentLanguage === 'ar'
      ? 'هل تريد فعلاً حذف هذه المشكلة؟'
      : 'Voulez-vous vraiment supprimer ce problème ?');

    if (!confirmed) {
      return;
    }

    const oldAlerts = [...this.alerts];

    this.alerts = this.alerts.filter(alert =>
      !this.sameId(alert.id, id)
    );

    this.http.delete(`${this.apiUrl}/alerts/${id}`, this.getAuthOptions())
      .subscribe({
        next: () => {
          this.showSuccess(this.currentLanguage === 'ar'
            ? 'تم حذف المشكلة بنجاح'
            : 'Problème supprimé avec succès');
        },
        error: () => {
          this.alerts = oldAlerts;

          this.showError(this.currentLanguage === 'ar'
            ? 'خطأ أثناء حذف المشكلة'
            : 'Erreur lors de la suppression du problème');
        }
      });
  }
}