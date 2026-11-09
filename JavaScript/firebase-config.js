/**
 * Sharaf DG Knowledge Base - Firebase Configuration & Realtime Sync
 * ====================================================================
 * متصل بمشروع: sharaf-dg-487ee
 * قاعدة البيانات: Firebase Realtime Database
 * ====================================================================
 */

window.FIREBASE_SDG_CONFIG = {
    apiKey: "AIzaSyC0UYocpnb2xxFwjt8Q8gaRw9U-q9PiEKI",
    authDomain: "sharaf-dg-487ee.firebaseapp.com",
    databaseURL: "https://sharaf-dg-487ee-default-rtdb.firebaseio.com",
    projectId: "sharaf-dg-487ee",
    storageBucket: "sharaf-dg-487ee.firebasestorage.app",
    messagingSenderId: "745336537473",
    appId: "1:745336537473:web:ed5f89a42cf90ece81a880",
    measurementId: "G-2MNH57HYX5"
};

/**
 * دالة مساعدة لجلب الإعدادات (تعطي الأولوية للإعدادات المخزنة محلياً إن وُجدت، وإلا تستخدم الإعدادات الافتراضية أعلاه)
 */
window.getFirebaseConfig = function () {
    try {
        var localCustom = localStorage.getItem('kb_sdg_firebase_config_v1');
        if (localCustom) {
            var parsed = JSON.parse(localCustom);
            if (parsed && parsed.apiKey && parsed.apiKey.length > 20 && parsed.databaseURL) {
                return parsed;
            }
        }
    } catch (e) {
        console.warn('Error reading local firebase config:', e);
    }
    return window.FIREBASE_SDG_CONFIG;
};
