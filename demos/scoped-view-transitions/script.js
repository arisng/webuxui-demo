// Scoped View Transitions Demo Script

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('nav');
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    const footer = document.getElementById('footer');

    // Fallback function for manual transitions
    function manualTransition(element, newHTML, duration = 500) {
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        element.style.opacity = '0';
        setTimeout(() => {
            element.innerHTML = newHTML;
            element.style.opacity = '1';
        }, duration);
    }

    // Check if scoped view transitions are supported
    const isSupported = HTMLElement.prototype.startViewTransition;
    if (!isSupported) {
        alert('Scoped View Transitions not supported. Using fallback animations.');
        console.warn('Scoped View Transitions not supported. Using fallback animations.');
    }

    // Update Nav
    document.getElementById('update-nav').addEventListener('click', () => {
        const newHTML = '<ul><li>Home</li><li>About</li><li>Contact</li><li>Services</li></ul>';
        if (isSupported) {
            console.log('Starting nav transition');
            nav.startViewTransition({
                callback: () => {
                    console.log('Nav callback executing');
                    nav.innerHTML = newHTML;
                }
            });
        } else {
            manualTransition(nav, newHTML);
        }
    });

    // Update Sidebar
    document.getElementById('update-sidebar').addEventListener('click', () => {
        const newHTML = '<h3>Updated Sidebar</h3><p>New Item 1</p><p>New Item 2</p><p>New Item 3</p>';
        if (isSupported) {
            console.log('Starting sidebar transition');
            sidebar.startViewTransition({
                callback: () => {
                    console.log('Sidebar callback executing');
                    sidebar.innerHTML = newHTML;
                }
            });
        } else {
            manualTransition(sidebar, newHTML);
        }
    });

    // Update Content
    document.getElementById('update-content').addEventListener('click', () => {
        const newHTML = '<h1>Updated Main Content</h1><p>This content has been updated with a smooth transition.</p><p>More content here.</p>';
        if (isSupported) {
            console.log('Starting content transition');
            content.startViewTransition({
                callback: () => {
                    console.log('Content callback executing');
                    content.innerHTML = newHTML;
                }
            });
        } else {
            manualTransition(content, newHTML);
        }
    });

    // Update Footer
    document.getElementById('update-footer').addEventListener('click', () => {
        const newHTML = '<p>Updated footer with new information and links.</p><p>Contact us at example.com</p>';
        if (isSupported) {
            console.log('Starting footer transition');
            footer.startViewTransition({
                callback: () => {
                    console.log('Footer callback executing');
                    footer.innerHTML = newHTML;
                }
            });
        } else {
            manualTransition(footer, newHTML);
        }
    });

    // Reset All
    document.getElementById('reset').addEventListener('click', () => {
        const navHTML = '<ul><li>Home</li><li>About</li></ul>';
        const sidebarHTML = '<h3>Sidebar</h3><p>Item 1</p><p>Item 2</p>';
        const contentHTML = '<h1>Main Content</h1><p>This is the main content area.</p>';
        const footerHTML = '<p>Footer content here.</p>';
        if (isSupported) {
            console.log('Resetting all');
            nav.startViewTransition({
                callback: () => {
                    nav.innerHTML = navHTML;
                }
            });
            sidebar.startViewTransition({
                callback: () => {
                    sidebar.innerHTML = sidebarHTML;
                }
            });
            content.startViewTransition({
                callback: () => {
                    content.innerHTML = contentHTML;
                }
            });
            footer.startViewTransition({
                callback: () => {
                    footer.innerHTML = footerHTML;
                }
            });
        } else {
            manualTransition(nav, navHTML);
            manualTransition(sidebar, sidebarHTML);
            manualTransition(content, contentHTML);
            manualTransition(footer, footerHTML);
        }
    });

    // Update All Simultaneously
    document.getElementById('update-all').addEventListener('click', () => {
        const navHTML = '<ul><li>Dashboard</li><li>Profile</li><li>Settings</li></ul>';
        const sidebarHTML = '<h3>Quick Links</h3><p>Link 1</p><p>Link 2</p>';
        const contentHTML = '<h1>All Updated</h1><p>All sections transitioned simultaneously.</p>';
        const footerHTML = '<p>Simultaneous update demo complete!</p>';
        if (isSupported) {
            console.log('Starting all transitions');
            nav.startViewTransition({
                callback: () => {
                    console.log('Nav callback in all');
                    nav.innerHTML = navHTML;
                }
            });
            sidebar.startViewTransition({
                callback: () => {
                    console.log('Sidebar callback in all');
                    sidebar.innerHTML = sidebarHTML;
                }
            });
            content.startViewTransition({
                callback: () => {
                    console.log('Content callback in all');
                    content.innerHTML = contentHTML;
                }
            });
            footer.startViewTransition({
                callback: () => {
                    console.log('Footer callback in all');
                    footer.innerHTML = footerHTML;
                }
            });
        } else {
            manualTransition(nav, navHTML);
            manualTransition(sidebar, sidebarHTML);
            manualTransition(content, contentHTML);
            manualTransition(footer, footerHTML);
        }
    });
});