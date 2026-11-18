# UrbanPlus

מערכת קהילתית לדיווח, הצגה וניהול של מפגעים במרחב הציבורי. UrbanPlus מאפשרת לתושבים לשתף מידע על מפגעים, לצפות באירועים על גבי מפה, לעקוב אחר עדכונים ולקבל התראות רלוונטיות. לצד הממשק לתושבים, המערכת כוללת אזור ניהול לטיפול בדיווחים, ניהול משתמשים ואירועים, וארגון עבודת ספקי השירות.

**Repository:** https://github.com/hadasashmuel/UrbanPlus  
**Live application:** https://urbanplus.premiumasp.net

---

## תוכן עניינים

- [סקירה כללית](#סקירה-כללית)
- [יכולות מרכזיות](#יכולות-מרכזיות)
- [טכנולוגיות](#טכנולוגיות)
- [ארכיטקטורת המערכת](#ארכיטקטורת-המערכת)
- [מבנה הפרויקט](#מבנה-הפרויקט)
- [התקנה והרצה מקומית](#התקנה-והרצה-מקומית)
- [הגדרות וסודות](#הגדרות-וסודות)
- [API ותקשורת בזמן אמת](#api-ותקשורת-בזמן-אמת)
- [אבטחה והרשאות](#אבטחה-והרשאות)
- [פריסה](#פריסה)
- [הערות פיתוח](#הערות-פיתוח)

---

## סקירה כללית

UrbanPlus נועדה לחבר בין תושבים, מידע עירוני וגורמי טיפול במפגעים. המערכת מרכזת מידע על אירועים ומפגעים, ומספקת ממשק להצגת המידע, דיווח, מעקב, תגובות וניהול תהליכי טיפול.

הפתרון בנוי משני חלקים עיקריים:

1. **Frontend** – יישום Single Page Application המבוסס React ו-TypeScript.
2. **Backend** – API המבוסס ASP.NET Core, המחולק לשכבות DTO, BLL ו-DAL.

התקשורת בין הממשק לשרת מתבצעת באמצעות REST API. עבור יכולות בזמן אמת נעשה שימוש ב-SignalR, ובצד השרת משולב שירות AI המבוסס על Google Gemini.

## יכולות מרכזיות

### ממשק לתושבים

- **מפת אירועים:** הצגת אירועים על גבי מפה אינטראקטיבית באמצעות Leaflet ו-React Leaflet.
- **מידע על אירועים:** צפייה בפרטי אירועים, בסטטוס ובחומרה שלהם.
- **דיווח על מפגעים:** יצירת דיווחים ושליחת תמונות באמצעות בקשות multipart/form-data.
- **התחברות והרשמה:** פתיחת חשבון והתחברות באמצעות פרטי משתמש.
- **התחברות Google:** תמיכה בתהליך Google Login.
- **פרופיל אישי:** הצגת פרטי המשתמש ועדכונם.
- **שמירת אירועים:** שמירת אירועים למעקב אישי.
- **הצבעות:** יצירה, שליפה ומחיקה של הצבעות משתמשים.
- **התראות:** קבלת התראות אישיות, לרבות התראות בזמן אמת והתראות המבוססות על מיקום.
- **צ'אט AI:** שליחת שאלות וקבלת תשובות משירות AI, כולל תמיכה בהזרמת תשובה (Streaming).

### אזור ניהול

אזור הניהול כולל מסכים ייעודיים לניהול משאבי המערכת:

- לוח בקרה.
- ניהול משתמשים.
- ניהול אירועים.
- ניהול קטגוריות.
- ניהול תגי משתמש (Badges).
- צפייה וניהול דיווחים.
- סטטיסטיקות.
- ניהול התראות.
- ניהול ספקי שירות.
- ניהול סוגי עבודה.
- שיוך סוגי עבודה לספקים.
- הקצאת ספקי שירות לטיפול בדיווחים.

### ניהול טיפול בדיווחים

המערכת כוללת ישויות ושירותים המאפשרים לנהל ספקי שירות, סוגי עבודה והקצאות של ספקים לדיווחים. ניתן לשלוף הקצאה נוכחית לדיווח וכן היסטוריית הקצאות. פעולת הקצאת ספק מוגבלת למנהל.

## טכנולוגיות

### צד לקוח

| טכנולוגיה / ספרייה | שימוש |
|---|---|
| React 19 | בניית ממשק המשתמש |
| TypeScript | פיתוח עם טיפוסים סטטיים |
| Vite | סביבת פיתוח ובניית הפרויקט |
| React Router | ניהול ניווט ונתיבים |
| Redux Toolkit | ניהול State מרכזי |
| React Redux | חיבור רכיבי React ל-Redux |
| Leaflet | מנוע מפות |
| React Leaflet | שילוב מפות Leaflet ברכיבי React |
| Microsoft SignalR | תקשורת ועדכונים בזמן אמת |
| Google OAuth | התחברות באמצעות Google |
| Recharts | הצגת נתונים וגרפים |
| oxlint | בדיקות Lint |

### צד שרת

| טכנולוגיה / ספרייה | שימוש |
|---|---|
| C# / ASP.NET Core | שרת Web ו-Web API |
| .NET 10 | סביבת הריצה ויעד הבנייה |
| Entity Framework Core | גישה לנתונים ומיפוי אובייקטים |
| SQL Server | מסד הנתונים |
| AutoMapper | מיפוי בין מודלים ל-DTO |
| JWT Bearer | אימות באמצעות JSON Web Tokens |
| ASP.NET Core Identity PasswordHasher | גיבוב סיסמאות |
| SignalR | תקשורת בזמן אמת |
| Swashbuckle / Swagger | תיעוד ובדיקת API |
| Google GenAI SDK | חיבור למודל Gemini |
| Microsoft.Extensions.AI | ממשק אחיד לעבודה עם יכולות AI |

## ארכיטקטורת המערכת

השרת בנוי בארכיטקטורה שכבתית, המפרידה בין נקודות הכניסה למערכת, הלוגיקה העסקית והגישה לנתונים.

```text
React + TypeScript (Vite)
          |
          | HTTP / REST API
          | SignalR
          v
ASP.NET Core Web API
          |
          +----------------------+
          |                      |
          v                      v
         BLL                 SignalR Hubs
  Business Logic             Real-time
          |
          v
         DAL
 Repositories + Entities
          |
          v
      SQL Server
```

### שכבת המציג – UrbanPlusServer

פרויקט השרת מכיל את ה-Controllers, הגדרות האפליקציה, אימות והרשאות, נקודות החיבור ל-SignalR, שירותי תשתית והגדרות Dependency Injection.

ה-Controllers מקבלים בקשות HTTP, מפעילים את השירות המתאים ומחזירים תגובת HTTP.

### שכבת הלוגיקה העסקית – BLL

שכבת BLL מרכזת את הלוגיקה העסקית של המערכת. היא מכילה Services, ממשקים, שירותי תמיכה וטיפול בחריגות.

השכבה משתמשת בממשקי ה-Repositories של DAL ואינה אמורה להחזיק את פרטי הגישה הישירה למסד הנתונים.

### שכבת הגישה לנתונים – DAL

שכבת DAL מכילה את הישויות ואת רכיבי הגישה לנתונים. היא מבוססת Entity Framework Core ומשמשת את שכבת BLL לעבודה מול SQL Server.

### שכבת DTO

פרויקט DTO מרכז את אובייקטי העברת הנתונים בין הלקוח לשרת ובין שכבות המערכת. בין היתר קיימים DTO ליצירה, עדכון והצגת נתונים.

### Dependency Injection

רכיבי Repositories ושירותי BLL נרשמים ב-container של ASP.NET Core באמצעות Dependency Injection. רוב השירותים וה-Repositories נרשמים במחזור החיים Scoped.

## מבנה הפרויקט

המבנה המרכזי של המאגר:

```text
UrbanPlus/
├── UrbanPlusClient/
│   └── urban-plus/
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   └── store/
│       │       ├── users/
│       │       ├── categories/
│       │       ├── reports/
│       │       ├── AIChat/
│       │       ├── events/
│       │       ├── badges/
│       │       ├── notifications/
│       │       ├── serviceProviders/
│       │       ├── workTypes/
│       │       ├── providerWorkTypes/
│       │       ├── reportAssignments/
│       │       └── location/
│       └── package.json
│
└── UrbanPlusServer/
    ├── UrbanPlusServer.slnx
    ├── UrbanPlusServer/
    │   ├── Controllers/
    │   ├── Hubs/
    │   ├── Filters/
    │   ├── Services/
    │   ├── Images/
    │   ├── Program.cs
    │   └── UrbanPlusServer.csproj
    ├── BLL/
    │   ├── Exceptions/
    │   └── Services/
    ├── DAL/
    │   ├── Entities/
    │   ├── Repositories/
    │   └── Migrations/
    └── DTO/
```

### מבנה ה-Frontend

- `components/` – רכיבי הממשק והעמודים, לרבות עמודי משתמש ואזור הניהול.
- `store/` – ניהול המצב הגלובלי באמצעות Redux Toolkit.
- בכל תחום ב-Store מרוכזים רכיבי State ופעולות הקשורות לאותו תחום.

הנתיבים הראשיים מוגדרים ב-`src/App.tsx`. אתחול React, Redux ו-Google OAuth מתבצע ב-`src/main.tsx`.

### מבנה ה-Backend

- `UrbanPlusServer/Controllers/` – נקודות הקצה של ה-API.
- `UrbanPlusServer/Hubs/` – רכיבי SignalR.
- `UrbanPlusServer/Filters/` – מסנני בקשות, לרבות טיפול גלובלי בחריגות.
- `UrbanPlusServer/Services/` – שירותי תשתית של פרויקט השרת.
- `BLL/Services/` – לוגיקה עסקית ושירותי תמיכה.
- `DAL/Entities/` – ישויות הנתונים.
- `DAL/Repositories/` – מימושי הגישה לנתונים.
- `DTO/` – אובייקטי העברת נתונים.

## התקנה והרצה מקומית

### דרישות מקדימות

יש להתקין ולהגדיר:

- Git.
- Node.js ו-npm.
- .NET 10 SDK.
- SQL Server מקומי או שרת SQL נגיש.
- פרטי גישה ל-Google OAuth.
- מפתח API של Google Gemini.

### 1. שכפול המאגר

```bash
git clone https://github.com/hadasashmuel/UrbanPlus.git
cd UrbanPlus
```

### 2. הגדרת השרת

יש להגדיר את ערכי התצורה הנדרשים לפני הפעלת השרת. פירוט מלא מופיע בפרק [הגדרות וסודות](#הגדרות-וסודות).

מתיקיית המאגר:

```bash
cd UrbanPlusServer
dotnet restore UrbanPlusServer.slnx
dotnet build UrbanPlusServer.slnx
dotnet run --project UrbanPlusServer/UrbanPlusServer.csproj
```

השרת יעלה בכתובת המקומית שתוצג בחלון ההרצה. ממשק Swagger מופעל בקוד האפליקציה וניתן להשתמש בו לבדיקת נקודות הקצה.

### 3. הגדרת הלקוח

בחלון טרמינל נוסף, מתיקיית המאגר:

```bash
cd UrbanPlusClient/urban-plus
npm install
```

יש להגדיר את משתנה הסביבה של Google OAuth בקובץ `.env` בתיקיית `urban-plus`:

```env
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

הפעלת סביבת הפיתוח:

```bash
npm run dev
```

Vite יציג את כתובת הפיתוח המקומית, שבדרך כלל תהיה `http://localhost:5173`.

### 4. פקודות Frontend נוספות

בניית גרסת Production:

```bash
npm run build
```

בדיקת Lint:

```bash
npm run lint
```

תצוגה מקומית של תוצר הבנייה:

```bash
npm run preview
```

## הגדרות וסודות

השרת קורא את ההגדרות דרך מנגנון Configuration של ASP.NET Core. אין לשמור מפתחות אמיתיים, סיסמאות או מחרוזות חיבור רגישות בקוד המקור או ב-Git.

ההגדרות הבאות נדרשות לפי `Program.cs`:

| מפתח הגדרה | תיאור |
|---|---|
| `ConnectionStrings:SqlServer` | מחרוזת חיבור למסד הנתונים SQL Server |
| `Gemini:ApiKey` | מפתח API לשירות Google Gemini |
| `GoogleClientId` | מזהה לקוח Google |
| `GoogleClientSecret` | סוד לקוח Google |
| `Jwt:Key` | מפתח חתימה של JWT |
| `Jwt:Issuer` | מנפיק ה-JWT |
| `Jwt:Audience` | קהל היעד של ה-JWT |

ב-Environment Variables של .NET ניתן לכתוב את המפתחות עם מפריד כפול-קו-תחתון, לדוגמה:

```text
ConnectionStrings__SqlServer
Gemini__ApiKey
GoogleClientId
GoogleClientSecret
Jwt__Key
Jwt__Issuer
Jwt__Audience
```

לסביבת פיתוח מקומית מומלץ להשתמש ב-.NET User Secrets או במשתני סביבה, ולא בקובץ הגדרות שמועלה למאגר.

**חשוב:** השרת בודק בעת האתחול שחלק מההגדרות האלו קיימות, ועוצר את ההפעלה אם ערך חובה חסר.

### מסד הנתונים

השרת משתמש ב-SQL Server דרך Entity Framework Core. יש לוודא שמסד הנתונים זמין ושמחרוזת החיבור מצביעה למסד הנתונים המתאים.

פרטי מבנה הנתונים והישויות נמצאים בפרויקט DAL. יש לוודא שסכמת מסד הנתונים תואמת למודל הנוכחי לפני הרצה מול מסד נתונים חדש או קיים. הוראות יצירת/עדכון סכימה תלויות במצב ה-Migrations ובסביבת הנתונים שבה משתמשים.

## API ותקשורת בזמן אמת

### REST API

ה-Controllers מוגדרים תחת הנתיב `api/[controller]`. בין תחומי ה-API הקיימים:

| Controller | תחום אחריות |
|---|---|
| `UserController` | הרשמה, התחברות, Google Login ופרופיל משתמש |
| `ReportController` | יצירה, שליפה ומחיקה של דיווחים |
| `MainEventController` | שליפה ועדכון של אירועים |
| `VoteController` | הצבעות משתמשים |
| `MessageController` | הודעות וצ'אט אירועים |
| `NotificationController` | התראות אישיות, קריאה והתראות לפי מיקום |
| `AIChatController` | שיחה עם שירות AI והזרמת תשובות |
| `ServiceProviderController` | ניהול ושליפת ספקי שירות |
| `WorkTypeController` | סוגי עבודה |
| `ProviderWorkTypeController` | שיוך סוגי עבודה לספקים |
| `ReportAssignmentController` | הקצאות ספקים לדיווחים |
| `CategoryController` | קטגוריות |
| `BadgeController` | תגי משתמש |
| `UserBadgeController` | תגיות המשויכות למשתמשים |

### SignalR

השרת חושף שני Hubs:

| Hub | כתובת | שימוש |
|---|---|---|
| Notifications | `/hubs/notifications` | שליחת התראות בזמן אמת |
| Event Chat | `/hubs/event-chat` | עדכונים בזמן אמת בצ'אט של אירוע |

בצד הלקוח נעשה שימוש בספריית `@microsoft/signalr`. חיבור ההתראות משתמש ב-JWT באמצעות access token ומוגדר עם Automatic Reconnect.

### AI Chat

השרת משתמש ב-Google GenAI וב-Microsoft.Extensions.AI. שירות ה-AI רשום ב-Dependency Injection, ותומך בהפעלת פונקציות (Function Invocation).

נקודות הקצה של הצ'אט:

- `POST /api/AIChat/send` – שליחת הודעה וקבלת תשובה.
- `POST /api/AIChat/stream` – קבלת תשובה בהזרמה בפורמט Server-Sent Events.

## אבטחה והרשאות

- אימות משתמשים באמצעות JWT Bearer.
- אימות תוקף, Issuer, Audience וחתימת הטוקן.
- מדיניות ברירת מחדל בשרת דורשת משתמש מאומת, למעט נקודות קצה שסומנו במפורש כ-Anonymous.
- פעולות ניהול מוגבלות באמצעות Role Authorization.
- סיסמאות מטופלות באמצעות `PasswordHasher` של ASP.NET Core Identity.
- חיבורי SignalR יכולים לקבל את ה-JWT דרך פרמטר `access_token` בנתיבי ה-Hubs המוגדרים.
- מדיניות CORS בשם `ReactClient` מאפשרת את כתובת הפיתוח `http://localhost:5173` ואת כתובת הלקוח `https://urbanplus.premiumasp.net`.

יש להגדיר ערכי סודות ייחודיים וחזקים לכל סביבת הרצה, ולוודא שהגדרות CORS וכתובות השירות מתאימות לסביבת הפריסה.

## פריסה

היישום זמין בכתובת:

https://urbanplus.premiumasp.net

בקוד המאגר קיימים קובצי GitHub Actions תחת `.github/workflows/` הקשורים לפרסום השרת. תהליך הפריסה בפועל תלוי בהגדרות ה-Repository Secrets ובסביבת האחסון.

לפני פרסום גרסה מומלץ לוודא:

1. שהשרת נבנה בהצלחה.
2. שהלקוח נבנה בהצלחה באמצעות `npm run build`.
3. שכל משתני הסביבה והסודות מוגדרים בסביבת היעד.
4. שמסד הנתונים זמין ותואם לגרסת המודל.
5. שהגדרות CORS, כתובות ה-API וכתובות ה-SignalR מתאימות לדומיין הפרודקשן.

## הערות פיתוח

- קובץ ה-Solution של צד השרת הוא `UrbanPlusServer/UrbanPlusServer.slnx`.
- נקודת הכניסה של השרת והגדרות השירותים נמצאות ב-`UrbanPlusServer/Program.cs`.
- הגדרת נתיבי הלקוח נמצאת ב-`UrbanPlusClient/urban-plus/src/App.tsx`.
- הגדרת Redux נמצאת ב-`UrbanPlusClient/urban-plus/src/store/store.ts`.
- הגדרות המפה ורכיב המפה נמצאים ב-`UrbanPlusClient/urban-plus/src/components/Map.tsx`.
- כתובות השרת בחלק מרכיבי הלקוח מוגדרות בקוד. בעת הרצה מקומית יש לוודא שהן תואמות לסביבת השרת הזמינה.
- אין להעלות למאגר קובצי `.env`, מפתחות API, סיסמאות או מחרוזות חיבור הכוללות פרטי גישה.

---

**UrbanPlus – מידע קהילתי, דיווחים וטיפול במפגעים במרחב הציבורי.**
