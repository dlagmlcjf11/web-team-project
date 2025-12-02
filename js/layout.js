document.addEventListener("DOMContentLoaded", function() {
    // Load Header
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            const header = document.createElement('div');
            header.id = 'header-placeholder'; // Create a placeholder for the header
            document.body.prepend(header);
            header.innerHTML = data;
        });

    // Load Footer
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            const footer = document.createElement('div');
            footer.id = 'footer-placeholder'; // Create a placeholder for the footer
            document.body.append(footer);
            footer.innerHTML = data;
        });
});