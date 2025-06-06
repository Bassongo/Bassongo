
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
      if (this.classList.contains('disabled-link')) {
        e.preventDefault();
        alert("Cette page est désactivée pour le moment.");
        return;
      }
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function () {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // Pour que le clic sur .dropdown-toggle ouvre/ferme le menu
  document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      const parent = this.closest('.dropdown');
      parent.classList.toggle('show');
    });
  });

  // Ferme les dropdowns si on clique ailleurs
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });
  });

  function toggleLink(selector, disabled) {
    const link = document.querySelector(selector);
    if (!link) return;
    if (disabled) {
      link.classList.add('disabled-link');
    } else {
      link.classList.remove('disabled-link');
    }
  }

  function updateNavVisibility() {
    const state = getState();
    const candidatureOn = isCandidatureActive();
    const voteOn = isVoteActive();

    toggleLink('a[href$="candidat.html"]', !candidatureOn);
    toggleLink('a[href$="campagnes.html"]', !candidatureOn);
    toggleLink('a[href$="vote.html"]', !voteOn);

    const canSeeStats = state.vote.category && userHasVoted(state.vote.category);
    toggleLink('a[href$="statistique.html"]', !canSeeStats);
    const showResults = state.vote.category && !voteOn && state.vote.endTime && Date.now() >= state.vote.endTime;
    toggleLink('a[href$="resultat.html"]', !showResults);
  }

  document.addEventListener('DOMContentLoaded', updateNavVisibility);
  document.addEventListener('stateChanged', updateNavVisibility);
