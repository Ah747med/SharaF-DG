(function () {
    // Create and inject styles for Sharaf DG navbar
    const style = document.createElement('style');
    style.textContent = `
    body { padding-top: 60px; }
    .navbar {
        display: flex;
        align-items: center;
        background: linear-gradient(90deg, #101826 0%, #0A0F1D 100%);
        border-bottom: 2px solid #F9A01B;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
        padding: 0 40px;
        height: 60px;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 1000;
        box-sizing: border-box;
    }
    .navbar-logo {
        display: flex;
        align-items: center;
        margin-right: 40px;
        filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4));
        text-decoration: none;
        cursor: pointer;
    }
    .navbar-logo img {
        height: 40px;
        width: 40px;
        object-fit: contain;
        border-radius: 8px;
        background: transparent;
        padding: 0;
        filter: drop-shadow(0 2px 8px rgba(255, 255, 255, 0.25));
        transition: transform 0.3s ease, filter 0.3s ease;
    }
    .navbar-logo:hover img {
        transform: scale(1.06);
        filter: drop-shadow(0 2px 10px rgba(249, 160, 27, 0.6));
    }
    .logo-text {
        margin-left: 14px;
        font-size: 1.45rem;
        font-weight: 900;
        letter-spacing: 2.5px;
        background: linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 30%, #FFBE3B 65%, #F9A01B 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8));
        font-family: 'Montserrat', 'Inter', sans-serif;
        text-transform: uppercase;
        animation: pulseLogo 2s infinite;
        overflow: hidden;
        white-space: nowrap;
        border-right: 2px solid #F9A01B;
        padding-right: 4px;
        width: 0;
    }
    @keyframes pulseLogo {
        0% { filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8)); transform: scale(1); }
        50% { filter: drop-shadow(0 4px 12px rgba(249, 160, 27, 0.5)); transform: scale(1.03); }
        100% { filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8)); transform: scale(1); }
    }
    @keyframes typewriter {
        from { width: 0; }
        to { width: 10.2ch; }
    }
    .typewriter-animate {
        animation: pulseLogo 2s infinite, typewriter 1.8s steps(10) 0.3s 1 normal both;
    }

    .navbar-menu {
        display: flex;
        gap: 30px;
        flex: 1;
        justify-content: flex-end;
        padding-right: 120px;
    }
    .navbar-menu .nav-item {
        position: relative;
        font-size: 1.08rem;
        font-weight: 700;
        color: #E2E8F0;
        text-decoration: none;
        overflow: hidden;
        height: 32px;
        display: flex;
        align-items: center;
        letter-spacing: 1.2px;
        border-radius: 18px;
        padding: 0 16px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(226, 232, 240, 0.1);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
        animation: floatSoft 2.8s ease-in-out infinite;
        font-family: 'Montserrat', 'Inter', sans-serif;
    }
    .navbar-menu .nav-item:hover {
        background: rgba(249, 160, 27, 0.15);
        border-color: rgba(249, 160, 27, 0.4);
        box-shadow: 0 2px 16px rgba(249, 160, 27, 0.3);
        color: #FFFFFF;
        transform: translateY(-2px);
    }
    .navbar-menu .nav-item.active {
        background: linear-gradient(135deg, #FFBE3B 0%, #F9A01B 50%, #D98200 100%);
        color: #0A0F1D;
        font-weight: 800;
        border-color: #FFBE3B;
        box-shadow: 0 4px 18px rgba(249, 160, 27, 0.45);
    }
    .navbar-menu .nav-item.active:hover {
        color: #0A0F1D;
    }

    @keyframes floatSoft {
        0% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
        100% { transform: translateY(0); }
    }

    @media (max-width: 900px) {
        .navbar { padding: 0 16px; }
        .navbar-menu { gap: 14px; padding-right: 20px; }
    }
    @media (max-width: 700px) {
        .navbar { flex-direction: column; height: auto; padding: 10px; border-radius: 0 0 18px 18px; }
        .navbar-logo { margin-bottom: 10px; margin-right: 0; }
        .navbar-menu { flex-direction: column; gap: 12px; align-items: flex-start; padding-right: 0; }
        .navbar-menu .nav-item { width: 100%; justify-content: flex-start; }
    }

    /* Custom Scrollbar to match Sharaf DG theme */
    html {
        scrollbar-color: #F9A01B #0B0F19;
        scrollbar-width: thin;
    }
    ::-webkit-scrollbar {
        width: 9px;
        height: 9px;
    }
    ::-webkit-scrollbar-track {
        background: #0B0F19;
    }
    ::-webkit-scrollbar-thumb {
        background: #475569;
        border-radius: 8px;
        border: 2px solid #0B0F19;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #F9A01B;
    }

    /* Password Modal Styles */
    .sdg-pwd-overlay {
        position: fixed;
        inset: 0;
        background: rgba(10, 15, 29, 0.8);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.25s ease, visibility 0.25s ease;
        padding: 20px;
        box-sizing: border-box;
    }
    .sdg-pwd-overlay.active {
        opacity: 1;
        visibility: visible;
    }
    .sdg-pwd-modal {
        background: linear-gradient(145deg, #131B2E 0%, #0D1322 100%);
        border: 1px solid rgba(249, 160, 27, 0.4);
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(249, 160, 27, 0.15);
        border-radius: 20px;
        width: 100%;
        max-width: 420px;
        padding: 32px 28px 28px;
        text-align: center;
        position: relative;
        transform: scale(0.92) translateY(12px);
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        box-sizing: border-box;
        font-family: 'Inter', 'Montserrat', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color: #F1F5F9;
        direction: ltr;
    }
    .sdg-pwd-overlay.active .sdg-pwd-modal {
        transform: scale(1) translateY(0);
    }
    .sdg-pwd-modal.shake {
        animation: sdgShake 0.45s ease-in-out;
    }
    @keyframes sdgShake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-10px); }
        40%, 80% { transform: translateX(10px); }
    }
    .sdg-pwd-close {
        position: absolute;
        top: 16px;
        right: 16px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #94A3B8;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 18px;
        line-height: 1;
    }
    .sdg-pwd-close:hover {
        background: rgba(239, 68, 68, 0.18);
        border-color: rgba(239, 68, 68, 0.45);
        color: #EF4444;
    }
    .sdg-pwd-icon-box {
        width: 68px;
        height: 68px;
        margin: 0 auto 16px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(249, 160, 27, 0.22) 0%, rgba(249, 160, 27, 0.04) 70%);
        border: 1.5px solid rgba(249, 160, 27, 0.45);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 24px rgba(249, 160, 27, 0.25);
    }
    .sdg-pwd-title {
        font-size: 1.25rem;
        font-weight: 800;
        color: #FFFFFF;
        margin-bottom: 20px;
        letter-spacing: -0.2px;
    }
    .sdg-pwd-input-wrap {
        position: relative;
        margin-bottom: 22px;
    }
    .sdg-pwd-input {
        width: 100%;
        box-sizing: border-box;
        height: 52px;
        background: rgba(15, 23, 42, 0.85);
        border: 1.5px solid rgba(148, 163, 184, 0.25);
        border-radius: 12px;
        padding: 0 46px 0 20px;
        font-size: 1.6rem;
        letter-spacing: 6px;
        text-align: center;
        color: #F9A01B;
        font-weight: 700;
        outline: none;
        transition: all 0.2s;
        font-family: monospace, sans-serif;
    }
    .sdg-pwd-input:focus {
        border-color: #F9A01B;
        box-shadow: 0 0 0 3px rgba(249, 160, 27, 0.25);
        background: rgba(15, 23, 42, 0.95);
    }
    .sdg-pwd-input.error {
        border-color: #EF4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.25) !important;
        color: #EF4444 !important;
    }
    .sdg-pwd-input.success {
        border-color: #10B981 !important;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25) !important;
        color: #10B981 !important;
    }
    .sdg-pwd-toggle-visibility {
        position: absolute;
        right: 14px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: #64748B;
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.2s;
    }
    .sdg-pwd-toggle-visibility:hover {
        color: #F9A01B;
    }
    .sdg-pwd-actions {
        display: flex;
        gap: 12px;
    }
    .sdg-pwd-btn-submit {
        flex: 1;
        height: 46px;
        background: linear-gradient(135deg, #FFBE3B 0%, #F9A01B 60%, #D97706 100%);
        border: none;
        border-radius: 12px;
        color: #0A0F1D;
        font-size: 1rem;
        font-weight: 800;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        box-shadow: 0 4px 16px rgba(249, 160, 27, 0.35);
        transition: all 0.2s;
        font-family: inherit;
    }
    .sdg-pwd-btn-submit:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(249, 160, 27, 0.5);
        background: linear-gradient(135deg, #FFC95C 0%, #FBAD37 60%, #E08312 100%);
    }
    .sdg-pwd-btn-cancel {
        height: 46px;
        padding: 0 20px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 12px;
        color: #94A3B8;
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        font-family: inherit;
    }
    .sdg-pwd-btn-cancel:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #FFFFFF;
    }
    `;
    document.head.appendChild(style);

    // Build navbar HTML
    const nav = document.createElement('nav');
    nav.className = 'navbar';
    nav.innerHTML = `
        <a href="index.html" class="navbar-logo" title="العودة إلى البوابة الرئيسية">
            <img src="Images/images.png" alt="Sharaf DG Logo">
            <span class="logo-text" id="fiat-typewriter">Sharaf DG</span>
        </a>
        <div class="navbar-menu">
            <a href="index.html" class="nav-item"><span>KB-Base</span></a>
            <a href="dashboard.html" id="nav-system-link" class="nav-item"><span>System</span></a>
        </div>
    `;

    document.body.prepend(nav);

    // Build password modal HTML
    const modalWrap = document.createElement('div');
    modalWrap.innerHTML = `
        <div id="sdgPwdOverlay" class="sdg-pwd-overlay" role="dialog" aria-modal="true" aria-labelledby="sdgPwdTitle">
            <div class="sdg-pwd-modal" id="sdgPwdModal">
                <button type="button" class="sdg-pwd-close" id="sdgPwdClose" title="Close">&times;</button>
                <div class="sdg-pwd-icon-box">
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#F9A01B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                </div>
                <div class="sdg-pwd-title" id="sdgPwdTitle">Sharaf DG System Access</div>
                <div class="sdg-pwd-input-wrap">
                    <input type="password" id="sdgPwdInput" class="sdg-pwd-input" placeholder="••••" maxlength="12" autocomplete="off" inputmode="numeric">
                    <button type="button" class="sdg-pwd-toggle-visibility" id="sdgPwdToggleVisibility" title="Show / Hide passcode">
                        <svg id="sdgEyeIcon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                </div>
                <div class="sdg-pwd-actions">
                    <button type="button" class="sdg-pwd-btn-cancel" id="sdgPwdCancel">Cancel</button>
                    <button type="button" class="sdg-pwd-btn-submit" id="sdgPwdSubmit">
                        <span>Confirm & Enter</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modalWrap.firstElementChild);

    const overlay = document.getElementById('sdgPwdOverlay');
    const modal = document.getElementById('sdgPwdModal');
    const input = document.getElementById('sdgPwdInput');
    const submitBtn = document.getElementById('sdgPwdSubmit');
    const cancelBtn = document.getElementById('sdgPwdCancel');
    const closeBtn = document.getElementById('sdgPwdClose');
    const toggleEyeBtn = document.getElementById('sdgPwdToggleVisibility');
    const eyeIcon = document.getElementById('sdgEyeIcon');
    const systemLink = document.getElementById('nav-system-link');

    function openPasswordModal() {
        if (!overlay || !input) return;
        input.value = '';
        input.type = 'password';
        input.classList.remove('error', 'success');
        if (modal) modal.classList.remove('shake');
        overlay.classList.add('active');
        setTimeout(() => input.focus(), 100);
    }

    function closePasswordModal() {
        if (overlay) overlay.classList.remove('active');
    }

    function verifyAndOpen() {
        if (!input) return;
        const val = input.value.trim();
        const activePwd = typeof window.getSystemPassword === 'function' ? window.getSystemPassword() : (window.CURRENT_SYSTEM_PASSWORD || '0000');
        if (val === activePwd) {
            input.classList.remove('error');
            input.classList.add('success');
            setTimeout(() => {
                closePasswordModal();
                window.open('dashboard.html', '_blank', 'noopener,noreferrer');
            }, 250);
        } else {
            input.classList.remove('success');
            input.classList.add('error');
            if (modal) {
                modal.classList.remove('shake');
                void modal.offsetWidth;
                modal.classList.add('shake');
            }
            input.select();
            input.focus();
        }
    }

    if (systemLink) {
        systemLink.addEventListener('click', function (e) {
            e.preventDefault();
            openPasswordModal();
        });
    }

    if (submitBtn) submitBtn.addEventListener('click', verifyAndOpen);
    if (cancelBtn) cancelBtn.addEventListener('click', closePasswordModal);
    if (closeBtn) closeBtn.addEventListener('click', closePasswordModal);
    if (overlay) {
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closePasswordModal();
        });
    }
    if (input) {
        input.addEventListener('input', function () {
            input.classList.remove('error');
        });
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                verifyAndOpen();
            }
        });
    }
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay && overlay.classList.contains('active')) {
            closePasswordModal();
        }
    });

    if (toggleEyeBtn && input && eyeIcon) {
        toggleEyeBtn.addEventListener('click', function () {
            if (input.type === 'password') {
                input.type = 'text';
                eyeIcon.innerHTML = `
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                `;
            } else {
                input.type = 'password';
                eyeIcon.innerHTML = `
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                `;
            }
            input.focus();
        });
    }

    const logoText = document.getElementById('fiat-typewriter');
    function restartTypewriter() {
        if (!logoText) return;
        logoText.classList.remove('typewriter-animate');
        void logoText.offsetWidth;
        logoText.classList.add('typewriter-animate');
    }
    if (logoText) {
        logoText.classList.add('typewriter-animate');
        setInterval(restartTypewriter, 15000);
    }

    const navLinks = document.querySelectorAll('.navbar-menu .nav-item');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(function (link) {
        const linkHref = link.getAttribute('href');
        if (linkHref && (linkHref === currentPage || (linkHref.startsWith('#') && window.location.hash === linkHref))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            if (this.id === 'nav-system-link') return;
            navLinks.forEach(function (l) { l.classList.remove('active'); });
            this.classList.add('active');
        });
    });
})();
