(function () {
    var modal = document.getElementById('portfolio-preview-modal');
    var iframe = document.getElementById('portfolio-preview-iframe');
    var closeButtons = document.querySelectorAll('[data-close-preview]');
    var previewButtons = document.querySelectorAll('.portfolio-preview-btn');

    // If cover image fails to load (e.g. screenshot API limit), hide it so placeholder shows
    document.querySelectorAll('.portfolio-cover-img').forEach(function (img) {
        img.onerror = function () {
            this.style.display = 'none';
        };
    });

    function openPreview(url) {
        if (!modal || !iframe) return;
        iframe.src = url;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');
    }

    function closePreview() {
        if (!modal || !iframe) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
        iframe.src = 'about:blank';
    }

    previewButtons.forEach(function (btn) {
        var card = btn.closest('.portfolio-card');
        if (!card) return;
        var url = card.getAttribute('data-url');
        if (url) {
            btn.addEventListener('click', function () {
                openPreview(url);
            });
        }
    });

    closeButtons.forEach(function (btn) {
        btn.addEventListener('click', closePreview);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closePreview();
        }
    });
})();
