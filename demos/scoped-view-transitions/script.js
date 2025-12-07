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

    // Function to create loading skeleton
    function createSkeleton() {
        return `
            <div class="post-header">
                <div class="skeleton skeleton-avatar"></div>
                <div class="author-info">
                    <div class="skeleton skeleton-text short"></div>
                    <div class="skeleton skeleton-text short"></div>
                </div>
            </div>
            <div class="skeleton skeleton-text long"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-image"></div>
            <div class="actions">
                <div class="skeleton skeleton-text short"></div>
                <div class="skeleton skeleton-text short"></div>
            </div>
        `;
    }

    // Check if scoped view transitions are supported
    const isSupported = HTMLElement.prototype.startViewTransition;
    if (!isSupported) {
        alert('Scoped View Transitions not supported. Using fallback animations.');
        console.warn('Scoped View Transitions not supported. Using fallback animations.');
    }

    // Update individual posts
    document.querySelectorAll('.update-post').forEach(button => {
        button.addEventListener('click', function() {
            const postId = this.dataset.post;
            const post = posts[postId];
            updatePost(post, postId);
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

    // Pull-to-refresh functionality
    let startY = 0;
    let isRefreshing = false;
    const refreshThreshold = 80;
    const mainElement = document.querySelector('main');
    const refreshIndicator = document.getElementById('refresh-indicator');

    // Infinite scroll functionality
    let isLoadingMore = false;
    let postCount = 3;
    const loadingMore = document.getElementById('loading-more');

    mainElement.addEventListener('scroll', () => {
        if (isLoadingMore) return;

        const scrollTop = mainElement.scrollTop;
        const scrollHeight = mainElement.scrollHeight;
        const clientHeight = mainElement.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight - 100) {
            loadMorePosts();
        }
    });

    function loadMorePosts() {
        if (isLoadingMore) return;
        isLoadingMore = true;
        loadingMore.classList.remove('hidden');

        // Simulate loading delay
        setTimeout(() => {
            postCount++;
            const newPost = createNewPost(postCount);
            mainElement.insertBefore(newPost, loadingMore);

            // Add view transition name
            newPost.style.viewTransitionName = `post${postCount}-transition`;

            // Attach event listener to new post
            newPost.querySelector('.update-post').addEventListener('click', function() {
                const postId = this.dataset.post;
                updatePost(newPost, postId);
            });

            loadingMore.classList.add('hidden');
            isLoadingMore = false;
        }, 1500);
    }

    function createNewPost(id) {
        const authors = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
        const contents = [
            'Amazing day at the beach! 🏖️',
            'New book recommendations? 📚',
            'Weekend hiking adventures! ⛰️',
            'Cooking experiments in progress! 👩‍🍳',
            'Music discovery of the week! 🎵',
            'Tech tips and tricks! 💻'
        ];
        const images = [
            'https://via.placeholder.com/300x200/74B9FF/FFFFFF?text=Beach',
            'https://via.placeholder.com/300x200/6C5CE7/FFFFFF?text=Books',
            'https://via.placeholder.com/300x200/00B894/FFFFFF?text=Hiking',
            'https://via.placeholder.com/300x200/E17055/FFFFFF?text=Cooking',
            'https://via.placeholder.com/300x200/FDCB6E/FFFFFF?text=Music',
            'https://via.placeholder.com/300x200/636E72/FFFFFF?text=Tech'
        ];

        const author = authors[(id - 1) % authors.length];
        const content = contents[(id - 1) % contents.length];
        const image = images[(id - 1) % images.length];
        const avatarColor = ['FF6B6B', '45B7D1', '98D8C8', 'F7DC6F', 'A29BFE', 'FD79A8'][(id - 1) % 6];

        const post = document.createElement('article');
        post.className = 'post';
        post.id = `post${id}`;
        post.style.contain = 'layout';
        post.innerHTML = `
            <div class="post-header">
                <img src="https://via.placeholder.com/40x40/${avatarColor}/FFFFFF?text=${author[0]}" alt="${author}" class="avatar">
                <div class="author-info">
                    <span class="author">${author}</span>
                    <span class="time">Just now</span>
                </div>
            </div>
            <p class="content">${content}</p>
            <img src="${image}" alt="${content.split(' ')[0]}" class="post-image">
            <div class="actions">
                <button class="update-post" data-post="${id}">Like</button>
                <span class="likes">${Math.floor(Math.random() * 20) + 1} likes</span>
            </div>
        `;
        return post;
    }

    mainElement.addEventListener('touchstart', (e) => {
        if (mainElement.scrollTop === 0 && !isRefreshing) {
            startY = e.touches[0].clientY;
        }
    }, { passive: true });

    mainElement.addEventListener('touchmove', (e) => {
        if (startY === 0 || isRefreshing) return;

        const currentY = e.touches[0].clientY;
        const diff = currentY - startY;

        if (diff > 0 && mainElement.scrollTop === 0) {
            e.preventDefault();
            const progress = Math.min(diff / refreshThreshold, 1);
            refreshIndicator.style.transform = `translateX(-50%) translateY(${diff * 0.5}px)`;
            if (progress >= 1) {
                refreshIndicator.classList.add('visible');
            }
        }
    }, { passive: false });

    mainElement.addEventListener('touchend', () => {
        if (startY === 0 || isRefreshing) return;

        const currentY = refreshIndicator.getBoundingClientRect().top + 60;
        const diff = currentY - startY;

        if (diff >= refreshThreshold) {
            isRefreshing = true;
            refreshIndicator.classList.add('visible');
            refreshIndicator.style.transform = 'translateX(-50%) translateY(40px)';

            // Simulate refresh
            setTimeout(() => {
                refreshFeed();
                setTimeout(() => {
                    refreshIndicator.classList.remove('visible');
                    refreshIndicator.style.transform = 'translateX(-50%) translateY(0)';
                    isRefreshing = false;
                }, 500);
            }, 1500);
        } else {
            refreshIndicator.classList.remove('visible');
            refreshIndicator.style.transform = 'translateX(-50%) translateY(0)';
        }

        startY = 0;
    });

    // Function to refresh feed content
    function refreshFeed() {
        const posts = document.querySelectorAll('.post');
        posts.forEach((post, index) => {
            const postId = index + 1;
            let newContent = '';

            if (postId == 1) {
                newContent = `
                    <div class="post-header">
                        <img src="https://via.placeholder.com/40x40/FF6B6B/FFFFFF?text=A" alt="Alice" class="avatar">
                        <div class="author-info">
                            <span class="author">Alice</span>
                            <span class="time">Just now</span>
                        </div>
                    </div>
                    <p class="content">Refreshed! Just tried an amazing new brew! ☕✨</p>
                    <img src="https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=New+Coffee" alt="New coffee experience" class="post-image">
                    <div class="actions">
                        <button class="update-post" data-post="1">Like +1</button>
                        <span class="likes">15 likes</span>
                    </div>
                `;
            } else if (postId == 2) {
                newContent = `
                    <div class="post-header">
                        <img src="https://via.placeholder.com/40x40/45B7D1/FFFFFF?text=B" alt="Bob" class="avatar">
                        <div class="author-info">
                            <span class="author">Bob</span>
                            <span class="time">Just now</span>
                        </div>
                    </div>
                    <p class="content">Fresh sunset vibes! 🌅🔥</p>
                    <img src="https://via.placeholder.com/300x200/FFA07A/FFFFFF?text=Fresh+Sunset" alt="Fresh sunset" class="post-image">
                    <div class="actions">
                        <button class="update-post" data-post="2">Comment</button>
                        <span class="comments">6 comments</span>
                    </div>
                `;
            } else if (postId == 3) {
                newContent = `
                    <div class="post-header">
                        <img src="https://via.placeholder.com/40x40/98D8C8/FFFFFF?text=C" alt="Charlie" class="avatar">
                        <div class="author-info">
                            <span class="author">Charlie</span>
                            <span class="time">Just now</span>
                        </div>
                    </div>
                    <p class="content">Updated recipe: Even better pasta! 🍝👨‍🍳</p>
                    <img src="https://via.placeholder.com/300x200/F7DC6F/FFFFFF?text=Updated+Pasta" alt="Updated pasta recipe" class="post-image">
                    <div class="actions">
                        <button class="update-post" data-post="3">Share</button>
                        <span class="shares">8 shares</span>
                    </div>
                `;
            }

            if (isSupported) {
                post.startViewTransition({
                    callback: () => {
                        post.innerHTML = newContent;
                        // Re-attach event listeners
                        post.querySelector('.update-post').addEventListener('click', function() {
                            const btnPostId = this.dataset.post;
                            const btnPost = posts[btnPostId - 1];
                            updatePost(btnPost, btnPostId);
                        });
                    }
                });
            } else {
                manualTransition(post, () => {
                    post.innerHTML = newContent;
                    post.querySelector('.update-post').addEventListener('click', function() {
                        const btnPostId = this.dataset.post;
                        const btnPost = posts[btnPostId - 1];
                        updatePost(btnPost, btnPostId);
                    });
                });
            }
        });
    }

    // Helper function for updating individual posts
    function updatePost(post, postId) {
        let newContent = '';
        const authors = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
        const contents = [
            'Amazing day at the beach! 🏖️',
            'New book recommendations? 📚',
            'Weekend hiking adventures! ⛰️',
            'Cooking experiments in progress! 👩‍🍳',
            'Music discovery of the week! 🎵',
            'Tech tips and tricks! 💻'
        ];
        const images = [
            'https://via.placeholder.com/300x200/74B9FF/FFFFFF?text=Beach',
            'https://via.placeholder.com/300x200/6C5CE7/FFFFFF?text=Books',
            'https://via.placeholder.com/300x200/00B894/FFFFFF?text=Hiking',
            'https://via.placeholder.com/300x200/E17055/FFFFFF?text=Cooking',
            'https://via.placeholder.com/300x200/FDCB6E/FFFFFF?text=Music',
            'https://via.placeholder.com/300x200/636E72/FFFFFF?text=Tech'
        ];

        const author = authors[(postId - 1) % authors.length];
        const content = contents[(postId - 1) % contents.length];
        const image = images[(postId - 1) % images.length];
        const avatarColor = ['FF6B6B', '45B7D1', '98D8C8', 'F7DC6F', 'A29BFE', 'FD79A8'][(postId - 1) % 6];
        const currentLikes = parseInt(post.querySelector('.likes').textContent.split(' ')[0]);

        newContent = `
            <div class="post-header">
                <img src="https://via.placeholder.com/40x40/${avatarColor}/FFFFFF?text=${author[0]}" alt="${author}" class="avatar">
                <div class="author-info">
                    <span class="author">${author}</span>
                    <span class="time">Just now</span>
                </div>
            </div>
            <p class="content">${content}</p>
            <img src="${image}" alt="${content.split(' ')[0]}" class="post-image">
            <div class="actions">
                <button class="update-post" data-post="${postId}">Like +1</button>
                <span class="likes">${currentLikes + 1} likes</span>
            </div>
        `;

        if (isSupported) {
            post.startViewTransition({
                callback: () => {
                    post.innerHTML = createSkeleton();
                    setTimeout(() => {
                        post.innerHTML = newContent;
                        post.querySelector('.update-post').addEventListener('click', function() {
                            updatePost(post, postId);
                        });
                    }, 1000);
                }
            });
        } else {
            manualTransition(post, () => {
                post.innerHTML = createSkeleton();
                setTimeout(() => {
                    manualTransition(post, () => {
                        post.innerHTML = newContent;
                        post.querySelector('.update-post').addEventListener('click', function() {
                            updatePost(post, postId);
                        });
                    }, 300);
                }, 1000);
            });
        }
    }