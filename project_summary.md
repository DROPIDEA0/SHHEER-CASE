# ملخص مشروع SHHEER Case - Bank Guarantee Dispute

## حالة المشروع: ✅ يعمل بنجاح

### معلومات المشروع
- **الاسم:** SHHEER Case - Bank Guarantee Dispute
- **المؤلف:** DROPIDEA
- **GitHub:** https://github.com/DROPIDEA0/SHHEER-CASE
- **الدومين الأصلي:** https://shheercase.com

### التقنيات المستخدمة
| التقنية | الإصدار |
|---------|---------|
| React | 19 |
| Vite | 5.4 |
| Tailwind CSS | 4 |
| Express | 4.x |
| tRPC | 11.x |
| Drizzle ORM | 0.44.x |
| MySQL | 8.0 |
| TypeScript | 5.9 |

### هيكل المشروع
```
SHHEER-CASE/
├── client/           # Frontend React
│   ├── src/
│   │   ├── pages/    # صفحات الموقع
│   │   ├── components/ # المكونات
│   │   └── App.tsx
│   └── index.html
├── server/           # Backend Express + tRPC
│   ├── _core/        # Core server files
│   ├── routers.ts    # API routes
│   └── db.ts         # Database functions
├── drizzle/          # Database schema
│   └── schema.ts
├── database/         # SQL files
└── package.json
```

### الجداول في قاعدة البيانات (14 جدول)
1. users - المستخدمين
2. header_content - محتوى الهيدر
3. hero_section - قسم البطل
4. overview_parties - الأطراف
5. case_elements - عناصر القضية
6. case_structure - هيكل القضية
7. timeline_events - أحداث الجدول الزمني (17 حدث)
8. timeline_categories - تصنيفات الجدول الزمني
9. evidence_items - عناصر الأدلة
10. evidence_categories - تصنيفات الأدلة
11. timeline_event_evidence - ربط الأحداث بالأدلة
12. videos - الفيديوهات
13. footer_content - محتوى الفوتر
14. site_settings - إعدادات الموقع

### ميزات الموقع
- **الصفحة الرئيسية:** Hero Section مع إحصائيات القضية
- **Case Overview:** عرض الأطراف (المدعي، المدعى عليه، الأطراف الدولية)
- **Timeline:** جدول زمني تفاعلي مع 17 حدث وفلترة حسب السنة والتصنيف
- **Evidence Archive:** أرشيف الأدلة مع إمكانية العرض والتحميل
- **Videos:** قسم الفيديوهات
- **لوحة الإدارة:** /admin لإدارة جميع المحتوى

### الإصلاحات المطبقة
1. إصلاح مشكلة `__dirname` في ES modules
2. إعداد قاعدة بيانات MySQL محلية
3. استيراد البيانات من ملف SQL المرفق

### رابط المشروع المحلي
- **URL:** https://3000-icwj9f5au43kjkxxwgp9g-a7dd2a96.manusvm.computer

### ملاحظات من التقرير المرفق
- المشروع يعمل 100% محلياً
- المشكلة الموثقة في التقرير تتعلق بالاتصال بقاعدة البيانات على Hostinger
- قاعدة البيانات على Hostinger تحتوي على البيانات لكن الـ runtime لا يتصل بها

---
*تم إنشاء هذا الملخص بتاريخ: 20 ديسمبر 2025*
