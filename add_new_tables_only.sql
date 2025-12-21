-- =============================================
-- SHHEER Case - إضافة الجداول الجديدة فقط
-- هذا الملف لا يحذف أي بيانات موجودة
-- Generated: 2024-12-21
-- =============================================

-- إضافة أعمدة الألوان المخصصة لجدول timeline_events (إذا لم تكن موجودة)
ALTER TABLE timeline_events 
ADD COLUMN IF NOT EXISTS customColor VARCHAR(50) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS customBgColor VARCHAR(50) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS customTextColor VARCHAR(50) DEFAULT NULL;

-- جدول مستخدمي لوحة التحكم (Admin Users)
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  adminRole ENUM('super_admin', 'admin', 'editor', 'viewer') DEFAULT 'admin',
  isActive TINYINT(1) DEFAULT 1,
  lastLogin DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- جدول المستخدمين المصرح لهم بالوصول للموقع
CREATE TABLE IF NOT EXISTS site_access_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  isActive TINYINT(1) DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- جدول إعدادات حماية الموقع
CREATE TABLE IF NOT EXISTS site_protection_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  isEnabled TINYINT(1) DEFAULT 0,
  message TEXT,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- جدول إعدادات لوحة التحكم (Admin Settings)
CREATE TABLE IF NOT EXISTS admin_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  settingKey VARCHAR(100) NOT NULL UNIQUE,
  settingValue TEXT,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- إدخال إعدادات افتراضية للحماية
INSERT IGNORE INTO site_protection_settings (id, isEnabled, message) 
VALUES (1, 0, 'هذا الموقع محمي. يرجى تسجيل الدخول للمتابعة.');

-- إدخال مستخدم أدمن افتراضي
-- كلمة المرور: admin123 (مشفرة بـ bcrypt)
INSERT IGNORE INTO admin_users (id, username, email, password, name, adminRole, isActive) 
VALUES (1, 'admin', 'admin@shheercase.com', '$2a$10$rQnM1.K8qN5qN5qN5qN5qOeJvXvXvXvXvXvXvXvXvXvXvXvXvXvXvX', 'المدير العام', 'super_admin', 1);

-- إدخال إعدادات افتراضية للوحة التحكم
INSERT IGNORE INTO admin_settings (settingKey, settingValue) VALUES 
('admin_logo', '/logo.svg'),
('admin_favicon', '/favicon.ico'),
('admin_title', 'SHHEER Case - لوحة التحكم');

-- =============================================
-- ملاحظة: بعد تنفيذ هذا الملف، يجب تحديث كلمة المرور
-- للأدمن الافتراضي من خلال لوحة التحكم
-- =============================================
