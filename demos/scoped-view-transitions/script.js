// Scoped View Transitions Demo Script

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('nav');
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');

    // Check if scoped view transitions are supported
    if (!HTMLElement.prototype.startViewTransition) {
        alert('Scoped View Transitions not supported. Enable experimental web platform features in Chrome.');
        console.warn('Scoped View Transitions not supported. Enable experimental web platform features in Chrome.');
        return;
    }

    // Update Nav
    document.getElementById('update-nav').addEventListener('click', () => {
        console.log('Starting nav transition');
        nav.startViewTransition({
            callback: () => {
                console.log('Nav callback executing');
                nav.innerHTML = '<ul><li>Home</li><li>About</li><li>Contact</li><li>Services</li></ul>';
            }
        });
    });

    // Update Sidebar
    document.getElementById('update-sidebar').addEventListener('click', () => {
        console.log('Starting sidebar transition');
        sidebar.startViewTransition({
            callback: () => {
                console.log('Sidebar callback executing');
                sidebar.innerHTML = '<h3>Updated Sidebar</h3><p>New Item 1</p><p>New Item 2</p><p>New Item 3</p>';
            }
        });
    });

    // Update Content
    document.getElementById('update-content').addEventListener('click', () => {
        console.log('Starting content transition');
        content.startViewTransition({
            callback: () => {
                console.log('Content callback executing');
                content.innerHTML = '<h1>Updated Main Content</h1><p>This content has been updated with a smooth transition.</p><p>More content here.</p>';
            }
        });
    });

    // Update All Simultaneously
    document.getElementById('update-all').addEventListener('click', () => {
        console.log('Starting all transitions');
        // Start transitions for each element
        nav.startViewTransition({
            callback: () => {
                console.log('Nav callback in all');
                nav.innerHTML = '<ul><li>Dashboard</li><li>Profile</li><li>Settings</li></ul>';
            }
        });

        sidebar.startViewTransition({
            callback: () => {
                console.log('Sidebar callback in all');
                sidebar.innerHTML = '<h3>Quick Links</h3><p>Link 1</p><p>Link 2</p>';
            }
        });

        content.startViewTransition({
            callback: () => {
                console.log('Content callback in all');
                content.innerHTML = '<h1>All Updated</h1><p>All sections transitioned simultaneously.</p>';
            }
        });
    });
});