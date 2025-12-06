// Scoped View Transitions Demo Script

document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const posts = {
        1: document.getElementById('post1'),
        2: document.getElementById('post2'),
        3: document.getElementById('post3')
    };
    const bottomNav = document.getElementById('bottom-nav');

    // Fallback function for manual transitions
    function manualTransition(element, callback, duration = 600) {
        element.style.transition = `opacity ${duration}ms ease-out`;
        element.style.opacity = '0';
        setTimeout(() => {
            callback();
            element.style.opacity = '1';
        }, duration);
    }

    // Check if scoped view transitions are supported
    const isSupported = HTMLElement.prototype.startViewTransition;
    if (!isSupported) {
        alert('Scoped View Transitions not supported. Using fallback animations.');
        console.warn('Scoped View Transitions not supported. Using fallback animations.');
    }

    // Update individual posts
    document.querySelectorAll('.update-post').forEach(button => {
        button.addEventListener('click', () => {
            const postId = button.dataset.post;
            const post = posts[postId];
            let newContent = '';

            if (postId == 1) {
                newContent = `
                    <div class="post-header">
                        <span class="author">Alice</span>
                        <span class="time">2h ago</span>
                    </div>
                    <p class="content">Just tried the new coffee shop downtown! ☕ The latte art is amazing.</p>
                    <div class="actions">
                        <button class="update-post" data-post="1">Like +1</button>
                        <span class="likes">13 likes</span>
                    </div>
                `;
            } else if (postId == 2) {
                newContent = `
                    <div class="post-header">
                        <span class="author">Bob</span>
                        <span class="time">4h ago</span>
                    </div>
                    <p class="content">Beautiful sunset today! 🌅</p>
                    <div class="actions">
                        <button class="update-post" data-post="2">Comment</button>
                        <span class="comments">4 comments</span>
                    </div>
                `;
            } else if (postId == 3) {
                newContent = `
                    <div class="post-header">
                        <span class="author">Charlie</span>
                        <span class="time">6h ago</span>
                    </div>
                    <p class="content">New recipe alert! Made the best pasta ever. 🍝</p>
                    <div class="actions">
                        <button class="update-post" data-post="3">Share</button>
                        <span class="shares">6 shares</span>
                    </div>
                `;
            }

            if (isSupported) {
                post.startViewTransition({
                    callback: () => {
                        post.innerHTML = newContent;
                    }
                });
            } else {
                manualTransition(post, () => {
                    post.innerHTML = newContent;
                });
            }
        });
    });

    // Bottom navigation transitions
    function attachNavListeners() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function() {
                const tab = this.dataset.tab;
                const newNav = `
                    <button class="nav-item ${tab === 'home' ? 'active' : ''}" data-tab="home">Home</button>
                    <button class="nav-item ${tab === 'search' ? 'active' : ''}" data-tab="search">Search</button>
                    <button class="nav-item ${tab === 'profile' ? 'active' : ''}" data-tab="profile">Profile</button>
                `;

                if (isSupported) {
                    bottomNav.startViewTransition({
                        callback: () => {
                            bottomNav.innerHTML = newNav;
                            attachNavListeners();
                        }
                    });
                } else {
                    manualTransition(bottomNav, () => {
                        bottomNav.innerHTML = newNav;
                        attachNavListeners();
                    });
                }
            });
        });
    }

    attachNavListeners();

    // Auto-update header after 2 seconds
    setTimeout(() => {
        const newHeader = '<h1>Social Feed - Updated</h1>';
        if (isSupported) {
            header.startViewTransition({
                callback: () => {
                    header.innerHTML = newHeader;
                }
            });
        } else {
            manualTransition(header, () => {
                header.innerHTML = newHeader;
            });
        }
    }, 2000);
});