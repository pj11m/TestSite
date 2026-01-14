const scriptsToLoad = [
  'assets/vendor/bootstrap/js/bootstrap.bundle.min.js',
  'assets/vendor/php-email-form/validate.js',
  'assets/vendor/aos/aos.js',
  'assets/vendor/glightbox/js/glightbox.min.js',
  'assets/vendor/purecounter/purecounter_vanilla.js',
  'assets/vendor/swiper/swiper-bundle.min.js',
  'assets/vendor/waypoints/noframework.waypoints.js',
  'assets/vendor/imagesloaded/imagesloaded.pkgd.min.js',
  'assets/vendor/isotope-layout/isotope.pkgd.min.js',
  'assets/js/main.js'
];

// Inject header then scripts
fetch('header.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('header-include').innerHTML = html;
    // Only after header is present, load scripts
    scriptsToLoad.forEach(src => {
      const script = document.createElement('script');
      script.src = src;
      document.body.appendChild(script);
    });
  });