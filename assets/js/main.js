// Main interactivity for the portfolio
(function () {
  const header = document.getElementById('site-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const yearEl = document.getElementById('year');
  const navLinks = Array.from(document.querySelectorAll('a.nav-link'));
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
  const projectCards = Array.from(document.querySelectorAll('.project-card'));
  const modal = document.getElementById('case-modal');
  const modalBody = document.getElementById('case-modal-body');
  const modalTitle = document.getElementById('case-modal-title');

  // Footer year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu toggle
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Close menu on link click (mobile)
    mobileMenu.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.matches('a.nav-link')) {
        mobileMenu.classList.add('hidden');
      }
    });
  }

  // Elevate header on scroll
  const onScroll = () => {
    if (!header) return;
    const scrolled = window.scrollY > 4;
    header.classList.toggle('shadow-md', scrolled);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Smooth scroll with native behavior (sections have scroll margin via Tailwind)
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const section = document.querySelector(href);
      if (!section) return;
      e.preventDefault();
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Active link highlighting using IntersectionObserver
  try {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('id');
          if (!id) return;
          const related = navLinks.filter((a) => a.getAttribute('href') === `#${id}`);
          if (entry.isIntersecting) {
            related.forEach((a) => {
              a.classList.add('text-primary', 'font-semibold');
              a.setAttribute('aria-current', 'page');
            });
          } else {
            related.forEach((a) => {
              a.classList.remove('text-primary', 'font-semibold');
              a.removeAttribute('aria-current');
            });
          }
        });
      },
      {
        // Section is considered active when 55% is visible
        root: null,
        rootMargin: '0px 0px -45% 0px',
        threshold: 0.1,
      }
    );

    sections.forEach((sec) => observer.observe(sec));
  } catch (err) {
    // Fallback: highlight based on scroll position
    const updateActive = () => {
      const pos = window.scrollY + 120; // header offset
      let currentId = sections[0]?.id;
      for (const sec of sections) {
        if (sec.offsetTop <= pos) currentId = sec.id;
      }
      navLinks.forEach((a) => {
        const isActive = a.getAttribute('href') === `#${currentId}`;
        a.classList.toggle('text-primary', isActive);
        a.classList.toggle('font-semibold', isActive);
        if (isActive) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
      });
    };
    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
  }

  // --- Project Filters ---
  const applyFilter = (filter) => {
    projectCards.forEach((card) => {
      const tags = (card.getAttribute('data-tags') || '').toLowerCase().split(',').map((t) => t.trim());
      const show = filter === 'all' || tags.includes(filter);
      card.classList.toggle('hidden', !show);
      card.setAttribute('aria-hidden', String(!show));
    });
  };

  if (filterButtons.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        // update aria-pressed
        filterButtons.forEach((b) => b.setAttribute('aria-pressed', 'false'));
        btn.setAttribute('aria-pressed', 'true');
        const filter = (btn.getAttribute('data-filter') || 'all').toLowerCase();
        applyFilter(filter);
      });
    });

    // Apply default filter based on any button marked as pressed (e.g., All)
    const defaultBtn = filterButtons.find((b) => b.getAttribute('aria-pressed') === 'true');
    if (defaultBtn) {
      const filter = (defaultBtn.getAttribute('data-filter') || 'all').toLowerCase();
      applyFilter(filter);
    }
  }

  // --- Case Study Modal ---
  let lastFocused = null;
  const getFocusable = (root) => Array.from(root.querySelectorAll(
    'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'
  ));

  const openModal = (title, html) => {
    if (!modal || !modalBody || !modalTitle) return;
    lastFocused = document.activeElement;
    modalTitle.textContent = title || 'Case Study';
    modalBody.innerHTML = html || '';
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    // Focus the first focusable inside dialog
    const dialog = modal.querySelector('[role="dialog"]');
    const f = getFocusable(dialog);
    (f[0] || dialog).focus();

    const keyHandler = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'Tab') {
        // trap focus
        const focusables = getFocusable(dialog);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    modal.dataset.keybound = 'true';
    window.addEventListener('keydown', keyHandler);
    modal._keyHandler = keyHandler;
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    // remove any single-close mode marker
    modal.classList.remove('single-close-mode');
    // remove key handler
    if (modal._keyHandler) {
      window.removeEventListener('keydown', modal._keyHandler);
      delete modal._keyHandler;
    }
    // restore focus
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  };

  // Open modal on case buttons
  document.querySelectorAll('.btn-case').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project-card');
      if (!card) return;
      const title = card.querySelector('h3')?.textContent?.trim() || 'Case Study';
      const content = card.querySelector('.case-content')?.innerHTML || '';
      openModal(title, content);
    });
  });

  // Close modal listeners
  if (modal) {
    modal.addEventListener('click', (e) => {
      const target = e.target;
      if (target instanceof Element) {
        if (target.classList.contains('modal-close') || target.getAttribute('data-close') === 'overlay') {
          closeModal();
        }
      }
    });
  }

  // --- View Resume Modal trigger ---
  const viewResumeBtn = document.getElementById('view-resume-btn');
  if (viewResumeBtn) {
    viewResumeBtn.addEventListener('click', () => {
      const resumePath = 'assets/resume.pdf';
      const resumeHtml = `
          <div class="space-y-4">
            <div class="h-[60vh]">
              <iframe src="${resumePath}" class="w-full h-full border rounded" title="Resume" loading="lazy"></iframe>
            </div>
          </div>
        `;
      // mark modal to hide the top-right close so only the footer Close remains
      if (modal) modal.classList.add('single-close-mode');
      openModal('Resume', resumeHtml);
    });
  }
})();
