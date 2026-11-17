/* =========================================
   1. THREE.JS 3D INTERACTIVE BACKGROUND
========================================= */
(function initThreeScene() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 28;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Main Group
  const coreGroup = new THREE.Group();
  scene.add(coreGroup);

  // Outer Wireframe Icosahedron (Neon Purple)
  const icoGeo = new THREE.IcosahedronGeometry(8.5, 1);
  const icoMat = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    wireframe: true,
    transparent: true,
    opacity: 0.28
  });
  const icosahedron = new THREE.Mesh(icoGeo, icoMat);
  coreGroup.add(icosahedron);

  // Inner Counter-Rotating Octahedron (Electric Blue)
  const octGeo = new THREE.OctahedronGeometry(5.2, 0);
  const octMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    wireframe: true,
    transparent: true,
    opacity: 0.42
  });
  const octahedron = new THREE.Mesh(octGeo, octMat);
  coreGroup.add(octahedron);

  // Glowing Vertex Nodes on Outer Mesh
  const pointsMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.25,
    transparent: true,
    opacity: 0.85
  });
  const vertexNodes = new THREE.Points(icoGeo, pointsMat);
  coreGroup.add(vertexNodes);

  // Ambient Cyber Particles
  const particleCount = 450;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 75;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xa855f7,
    size: 0.16,
    transparent: true,
    opacity: 0.65
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Position 3D core slightly right on desktop
  function updateCorePosition() {
    if (window.innerWidth > 992) {
      coreGroup.position.set(8.5, 0, -2);
    } else {
      coreGroup.position.set(0, 2, -6);
    }
  }
  updateCorePosition();

  // Mouse Parallax
  let targetX = 0;
  let targetY = 0;
  window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 1.4;
    targetY = (e.clientY / window.innerHeight - 0.5) * 1.4;
  });

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateCorePosition();
  });

  // Animation Loop
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    icosahedron.rotation.x = elapsed * 0.14;
    icosahedron.rotation.y = elapsed * 0.2;
    vertexNodes.rotation.copy(icosahedron.rotation);

    octahedron.rotation.x = -elapsed * 0.25;
    octahedron.rotation.y = -elapsed * 0.18;

    particles.rotation.y = elapsed * 0.03;

    coreGroup.rotation.y += (targetX - coreGroup.rotation.y) * 0.05;
    coreGroup.rotation.x += (targetY - coreGroup.rotation.x) * 0.05;

    renderer.render(scene, camera);
  }
  animate();
})();

/* =========================================
   2. MOBILE NAVIGATION & SCROLL REVEAL
========================================= */
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// IntersectionObserver for Reveal Animations
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* =========================================
   3. 3D PERSPECTIVE TILT ON CARDS
========================================= */
document.querySelectorAll('.tilt-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 768) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / rect.height) * -7;
    const rotateY = ((x - rect.width / 2) / rect.width) * 7;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
  });
});

/* =========================================
   4. COPY GITHUB HANDLE & REAL EMAIL FORM
========================================= */
const copyBtn = document.getElementById('copy-handle-btn');
const copyText = document.getElementById('copy-text');

if (copyBtn && copyText) {
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('https://github.com/mian-cs');
    copyText.textContent = 'Copied: github.com/mian-cs';
    setTimeout(() => {
      copyText.textContent = 'Copy GitHub: github.com/mian-cs';
    }, 2500);
  });
}

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    formStatus.textContent = '';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (result.success) {
        formStatus.style.color = '#22c55e';
        formStatus.textContent = 'Message sent successfully! Mian Moazzam will reply soon.';
        contactForm.reset();
      } else {
        formStatus.style.color = '#ef4444';
        formStatus.textContent = 'Error sending message. Please check your Access Key.';
      }
    } catch (error) {
      formStatus.style.color = '#ef4444';
      formStatus.textContent = 'Network error. Please try again later.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    }
  });
}