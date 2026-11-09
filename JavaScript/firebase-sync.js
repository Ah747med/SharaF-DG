/**
 * Sharaf DG Knowledge Base - Real-time Multi-Device Sync via Firebase
 * ====================================================================
 * Enables instant synchronization across all devices for index.html only.
 */

(function () {
    // Unique Client ID for this browser tab/session to prevent echo loops
    var CLIENT_ID = 'sdg_cli_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    window.SDG_CLIENT_ID = CLIENT_ID;

    var dbRef = null;
    var firebaseApp = null;
    var isInitialized = false;
    var lastAppliedTimestamp = 0;

    // Helper: update badge in UI
    window.updateSyncBadge = function (status, text) {
        var badges = document.querySelectorAll('.cloud-sync-badge, #cloud-sync-status-badge');
        badges.forEach(function (badge) {
            badge.className = 'cloud-sync-badge ' + status;
            var textEl = badge.querySelector('.sync-text');
            if (textEl && text) textEl.textContent = text;
        });

        var pill = document.getElementById('firebase-sync-pill');
        if (pill && text) pill.textContent = text;
    };

    // Helper: Parse Firebase config from string or object
    window.parseFirebaseConfig = function (input) {
        if (!input) return null;
        if (typeof input === 'object') return input;
        var str = String(input).trim();
        // Try direct JSON.parse
        try {
            return JSON.parse(str);
        } catch (e) {}

        // Try extracting keys from JS object format (apiKey: "...", etc.)
        try {
            var obj = {};
            var keys = ['apiKey', 'authDomain', 'databaseURL', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
            keys.forEach(function (k) {
                var regex = new RegExp(k + '\\s*:\\s*["\']([^"\']+)["\']', 'i');
                var match = str.match(regex);
                if (match && match[1]) {
                    obj[k] = match[1].trim();
                }
            });
            if (obj.apiKey || obj.projectId || obj.databaseURL) {
                return obj;
            }
        } catch (e) {}
        return null;
    };

    // Initialize Firebase
    window.initFirebaseSync = function () {
        if (typeof firebase === 'undefined') {
            console.warn('[Firebase Sync] Firebase SDK not loaded yet.');
            window.updateSyncBadge('offline', 'SDK Not Loaded');
            return false;
        }

        var config = null;
        if (typeof window.getFirebaseConfig === 'function') {
            config = window.getFirebaseConfig();
        } else {
            config = window.FIREBASE_SDG_CONFIG;
        }

        // Validate config
        if (!config || !config.apiKey || (!config.databaseURL && !config.projectId)) {
            console.info('[Firebase Sync] Firebase not configured yet. Operating in Local Mode.');
            window.updateSyncBadge('offline', 'Local Mode');
            return false;
        }

        // Ensure databaseURL is present for Realtime Database
        if (!config.databaseURL && config.projectId) {
            config.databaseURL = 'https://' + config.projectId + '-default-rtdb.firebaseio.com';
        }

        try {
            if (!firebase.apps.length) {
                firebaseApp = firebase.initializeApp(config);
            } else {
                firebaseApp = firebase.app();
            }

            var db = firebase.database();
            dbRef = db.ref('kb_sharaf_dg_data');
            isInitialized = true;

            // Real-time listener for Edit Mode Password (stored in kb_sharaf_dg_settings/editPassword)
            var pwdRef = db.ref('kb_sharaf_dg_settings/editPassword');
            pwdRef.on('value', function (snapshot) {
                var cloudPwd = snapshot.val();
                if (cloudPwd !== null && cloudPwd !== undefined && String(cloudPwd).trim() !== '') {
                    var strPwd = String(cloudPwd).trim();
                    window.CURRENT_EDIT_PASSWORD = strPwd;
                    try { localStorage.setItem('kb_sdg_cloud_pwd_v1', strPwd); } catch (e) {}
                    console.log('⚡ [Firebase Sync] Cloud edit password updated:', strPwd);
                    
                    var pwdInput = document.getElementById('firebase-edit-pwd-input');
                    if (pwdInput && !pwdInput.matches(':focus')) {
                        pwdInput.value = strPwd;
                    }
                } else {
                    // Seed initial password in Firebase Console if empty
                    pwdRef.set('0000');
                    window.CURRENT_EDIT_PASSWORD = '0000';
                    try { localStorage.setItem('kb_sdg_cloud_pwd_v1', '0000'); } catch (e) {}
                }
            }, function (err) {
                console.warn('[Firebase Sync] Edit password listener warning:', err);
            });

            // Real-time listener for System Access Password (stored in kb_sharaf_dg_settings/systemPassword)
            var sysPwdRef = db.ref('kb_sharaf_dg_settings/systemPassword');
            sysPwdRef.on('value', function (snapshot) {
                var cloudSysPwd = snapshot.val();
                if (cloudSysPwd !== null && cloudSysPwd !== undefined && String(cloudSysPwd).trim() !== '') {
                    var strSysPwd = String(cloudSysPwd).trim();
                    window.CURRENT_SYSTEM_PASSWORD = strSysPwd;
                    try { localStorage.setItem('kb_sdg_cloud_sys_pwd_v1', strSysPwd); } catch (e) {}
                    console.log('⚡ [Firebase Sync] Cloud system access password updated:', strSysPwd);

                    var sysPwdInput = document.getElementById('firebase-system-pwd-input');
                    if (sysPwdInput && !sysPwdInput.matches(':focus')) {
                        sysPwdInput.value = strSysPwd;
                    }
                } else {
                    // Seed initial system password in Firebase Console if empty
                    sysPwdRef.set('0000');
                    window.CURRENT_SYSTEM_PASSWORD = '0000';
                    try { localStorage.setItem('kb_sdg_cloud_sys_pwd_v1', '0000'); } catch (e) {}
                }
            }, function (err) {
                console.warn('[Firebase Sync] System password listener warning:', err);
            });

            window.updateSyncBadge('syncing', 'Connecting...');

            // Monitor connection state
            var connectedRef = db.ref('.info/connected');
            connectedRef.on('value', function (snap) {
                if (snap.val() === true) {
                    window.updateSyncBadge('online', 'Live Cloud Sync');
                } else {
                    window.updateSyncBadge('syncing', 'Connecting...');
                }
            });

            // Real-time listener for multi-device sync
            dbRef.on('value', function (snapshot) {
                var remoteData = snapshot.val();
                if (!remoteData) {
                    // Database node is empty, seed it with current local state
                    console.log('[Firebase Sync] Database is empty. Seeding current state...');
                    window.seedFirebaseIfEmpty();
                    window.updateSyncBadge('online', 'Live Cloud Sync');
                    return;
                }

                // Echo loop prevention: don't apply if broadcast from this same tab/client
                if (remoteData.clientId === CLIENT_ID) {
                    window.updateSyncBadge('online', 'Live Cloud Sync');
                    return;
                }

                // Check timestamp to avoid stale updates
                if (remoteData.timestamp && remoteData.timestamp <= lastAppliedTimestamp) {
                    return;
                }

                lastAppliedTimestamp = remoteData.timestamp || Date.now();
                console.log('⚡ [Firebase Sync] Real-time update received from another device! Applying...');

                window.updateSyncBadge('syncing', 'Updating...');

                // Apply to DOM
                if (typeof window.applyRemoteData === 'function') {
                    window.applyRemoteData(remoteData);
                }

                // Update local storage cache
                try {
                    localStorage.setItem('kb_sdg_user_edits_v1', JSON.stringify(remoteData));
                } catch (e) {}

                window.updateSyncBadge('online', 'Live Cloud Sync');

                if (typeof window.showDgToast === 'function') {
                    window.showDgToast('⚡ Live update received from another device!');
                }
            }, function (error) {
                console.error('[Firebase Sync] Listen error:', error);
                window.updateSyncBadge('error', 'Rules / Permission Error');
                if (String(error).toLowerCase().includes('permission') || String(error).toLowerCase().includes('denied')) {
                    console.warn('[Firebase Sync] تنبيه: يرجى فتح Firebase Console ثم الذهاب إلى Realtime Database -> Rules وضبطها إلى:\n{\n  "rules": {\n    ".read": true,\n    ".write": true\n  }\n}');
                }
            });

            return true;
        } catch (err) {
            console.error('[Firebase Sync] Initialization error:', err);
            window.updateSyncBadge('error', 'Connection Error');
            return false;
        }
    };

    // Push local state to Firebase
    window.pushToFirebase = function (data, onComplete) {
        if (!isInitialized || !dbRef) {
            if (onComplete) onComplete(new Error('Firebase is not initialized'));
            return;
        }

        window.updateSyncBadge('syncing', 'Saving to Cloud...');

        // Attach metadata
        data.clientId = CLIENT_ID;
        data.timestamp = Date.now();
        lastAppliedTimestamp = data.timestamp;

        dbRef.set(data)
            .then(function () {
                window.updateSyncBadge('online', 'Live Cloud Sync');
                if (onComplete) onComplete(null);
            })
            .catch(function (err) {
                console.error('[Firebase Sync] Failed to write data to Firebase:', err);
                window.updateSyncBadge('error', 'Save Error');
                if (onComplete) onComplete(err);
            });
    };

    // Seed empty Firebase database with current local HTML state
    window.seedFirebaseIfEmpty = function () {
        if (!isInitialized || !dbRef) return;
        if (typeof window.gatherCurrentStateData === 'function') {
            var data = window.gatherCurrentStateData();
            if (data) {
                data.clientId = CLIENT_ID;
                data.timestamp = Date.now();
                lastAppliedTimestamp = data.timestamp;
                dbRef.set(data).catch(function (e) {
                    console.warn('[Firebase Sync] Initial seed failed:', e);
                });
            }
        }
    };

    // Helper to get active edit password (cloud > local cache > fallback '0000')
    window.getEditPassword = function () {
        if (window.CURRENT_EDIT_PASSWORD && String(window.CURRENT_EDIT_PASSWORD).trim() !== '') {
            return String(window.CURRENT_EDIT_PASSWORD).trim();
        }
        try {
            var cached = localStorage.getItem('kb_sdg_cloud_pwd_v1');
            if (cached && String(cached).trim() !== '') {
                return String(cached).trim();
            }
        } catch (e) {}
        return '0000';
    };

    // Helper to update password directly in Firebase
    window.setFirebasePassword = function (newPwd, callback) {
        var p = String(newPwd || '').trim();
        if (!p) {
            if (callback) callback(new Error('كلمة المرور لا يمكن أن تكون فارغة'));
            return;
        }

        if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
            firebase.database().ref('kb_sharaf_dg_settings/editPassword').set(p)
                .then(function () {
                    window.CURRENT_EDIT_PASSWORD = p;
                    try { localStorage.setItem('kb_sdg_cloud_pwd_v1', p); } catch (e) {}
                    if (callback) callback(null);
                })
                .catch(function (err) {
                    if (callback) callback(err);
                });
        } else {
            // Offline fallback
            window.CURRENT_EDIT_PASSWORD = p;
            try { localStorage.setItem('kb_sdg_cloud_pwd_v1', p); } catch (e) {}
            if (callback) callback(new Error('Firebase غير متصل، تم حفظها محلياً فقط'));
        }
    };

    // Helper to get active system access password (cloud > local cache > fallback '0000')
    window.getSystemPassword = function () {
        if (window.CURRENT_SYSTEM_PASSWORD && String(window.CURRENT_SYSTEM_PASSWORD).trim() !== '') {
            return String(window.CURRENT_SYSTEM_PASSWORD).trim();
        }
        try {
            var cached = localStorage.getItem('kb_sdg_cloud_sys_pwd_v1');
            if (cached && String(cached).trim() !== '') {
                return String(cached).trim();
            }
        } catch (e) {}
        return '0000';
    };

    // Helper to update system access password directly in Firebase
    window.setFirebaseSystemPassword = function (newPwd, callback) {
        var p = String(newPwd || '').trim();
        if (!p) {
            if (callback) callback(new Error('كلمة المرور لا يمكن أن تكون فارغة'));
            return;
        }

        if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
            firebase.database().ref('kb_sharaf_dg_settings/systemPassword').set(p)
                .then(function () {
                    window.CURRENT_SYSTEM_PASSWORD = p;
                    try { localStorage.setItem('kb_sdg_cloud_sys_pwd_v1', p); } catch (e) {}
                    if (callback) callback(null);
                })
                .catch(function (err) {
                    if (callback) callback(err);
                });
        } else {
            window.CURRENT_SYSTEM_PASSWORD = p;
            try { localStorage.setItem('kb_sdg_cloud_sys_pwd_v1', p); } catch (e) {}
            if (callback) callback(new Error('Firebase غير متصل، تم حفظها محلياً فقط'));
        }
    };

    // Auto-init on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(function () {
            window.initFirebaseSync();
        }, 150);
    });
})();

