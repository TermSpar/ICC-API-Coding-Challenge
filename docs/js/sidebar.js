document.addEventListener("DOMContentLoaded", () => {
  // Create the placeholder if it doesn't exist
  let placeholder = document.getElementById('sidebar-placeholder');
  if (!placeholder) {
    placeholder = document.createElement('div');
    placeholder.id = 'sidebar-placeholder';
    document.body.prepend(placeholder); // inject at the top
  }

  // Fetch sidebar HTML and insert it
  fetch('includes/sidebar.html')
    .then(response => response.text())
    .then(html => {
      placeholder.innerHTML = html;

      // Auto-highlight current page
      const currentPath = window.location.pathname.split('/').pop(); // get filename
      const links = placeholder.querySelectorAll('a');
      links.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath) {
          link.classList.add('active');
        }
      });
    })
    .catch(err => console.error('Sidebar failed to load:', err));
});