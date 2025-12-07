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
        const originalTransition = element.style.transition;
        const originalOpacity = element.style.opacity;
        
        element.style.transition = `opacity ${duration}ms ease-out`;
        element.style.opacity = '0';
        
        setTimeout(() => {
            callback();
            element.style.opacity = '1';
            
            // Reset styles after transition completes
            setTimeout(() => {
                element.style.transition = originalTransition;
                element.style.opacity = originalOpacity;
            }, duration);
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

    // Function to create data URI placeholder images
    function createPlaceholderAvatar(seed, size = 40) {
        return `https://picsum.photos/seed/${seed}/${size}/${size}`;
    }

    function createPlaceholderImage(width, height, seed) {
        return `https://picsum.photos/seed/${seed}/${width}/${height}`;
    }

    // Check if scoped view transitions are supported
    const isSupported = HTMLElement.prototype.startViewTransition;
    if (!isSupported) {
        alert('Scoped View Transitions not supported. Using fallback animations.');
        console.warn('Scoped View Transitions not supported. Using fallback animations.');
    }

    // Handle action buttons (like, comment, share)
    document.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', function() {
            const postId = this.dataset.post;
            const action = this.dataset.action;
            const post = posts[postId];
            handleAction(post, postId, action);
        });
    });

    // Post creation modal functionality
    const createPostBtn = document.getElementById('create-post-btn');
    const createPostModal = document.getElementById('create-post-modal');
    const modalClose = document.getElementById('modal-close');
    const cancelPost = document.getElementById('cancel-post');
    const createPostForm = document.getElementById('create-post-form');
    const postContentTextarea = document.getElementById('post-content');

    // Open modal
    createPostBtn.addEventListener('click', () => {
        if (isSupported) {
            createPostModal.startViewTransition(() => {
                createPostModal.classList.add('visible');
                postContentTextarea.focus();
            });
        } else {
            createPostModal.classList.add('visible');
            postContentTextarea.focus();
        }
    });

    // Close modal functions
    function closeModal() {
        if (isSupported) {
            createPostModal.startViewTransition(() => {
                createPostModal.classList.remove('visible');
                createPostForm.reset();
            });
        } else {
            createPostModal.classList.remove('visible');
            createPostForm.reset();
        }
    }

    modalClose.addEventListener('click', closeModal);
    cancelPost.addEventListener('click', closeModal);

    // Close modal on overlay click
    createPostModal.addEventListener('click', (e) => {
        if (e.target === createPostModal) {
            closeModal();
        }
    });

    // Handle form submission
    createPostForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const content = postContentTextarea.value.trim();
        if (content) {
            createNewPost(content);
            closeModal();
        }
    });

    function createNewPost(content) {
        postCount++;
        const newPost = document.createElement('article');
        newPost.className = 'post';
        newPost.id = `post${postCount}`;
        newPost.style.contain = 'layout';
        newPost.style.viewTransitionName = `post${postCount}-transition`;

        // Use current user (could be made dynamic)
        const author = 'You';
        const avatarColor = '007bff';

        newPost.innerHTML = `
            <div class="post-header">
                <img src="${createPlaceholderAvatar('you', 40)}" alt="${author}" class="avatar">
                <div class="author-info">
                    <span class="author">${author}</span>
                    <span class="time">Just now</span>
                </div>
            </div>
            <p class="content">${content}</p>
            <div class="actions">
                <button class="update-post" data-post="${postCount}">Like</button>
                <span class="likes">0 likes</span>
            </div>
        `;

        // Insert at the top of the feed
        mainElement.insertBefore(newPost, mainElement.firstElementChild);

        // Attach event listener
        newPost.querySelector('.update-post').addEventListener('click', function() {
            const postId = this.dataset.post;
            updatePost(newPost, postId);
        });

        // Smooth scroll to top
        mainElement.scrollTo({ top: 0, behavior: 'smooth' });
    }

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
        const seeds = ['beach', 'books', 'hiking', 'cooking', 'music', 'tech'];

        const author = authors[(id - 1) % authors.length];
        const content = contents[(id - 1) % contents.length];
        const seed = seeds[(id - 1) % seeds.length];

        const post = document.createElement('article');
        post.className = 'post';
        post.id = `post${id}`;
        post.style.contain = 'layout';
        post.innerHTML = `
            <div class="post-header">
                <img src="${createPlaceholderAvatar(author.toLowerCase(), 40)}" alt="${author}" class="avatar">
                <div class="author-info">
                    <span class="author">${author}</span>
                    <span class="time">Just now</span>
                </div>
            </div>
            <p class="content">${content}</p>
            <img src="${createPlaceholderImage(300, 200, seed)}" alt="${content.split(' ')[0]}" class="post-image">
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
                        <img src="${createPlaceholderAvatar('alice', 40)}" alt="Alice" class="avatar">
                        <div class="author-info">
                            <span class="author">Alice</span>
                            <span class="time">Just now</span>
                        </div>
                    </div>
                    <p class="content">Refreshed! Just tried an amazing new brew! ☕✨</p>
                    <img src="${createPlaceholderImage(300, 200, 'newcoffee')}" alt="New coffee experience" class="post-image">
                    <div class="actions">
                        <button class="update-post" data-post="1">Like +1</button>
                        <span class="likes">15 likes</span>
                    </div>
                `;
            } else if (postId == 2) {
                newContent = `
                    <div class="post-header">
                        <img src="${createPlaceholderAvatar('bob', 40)}" alt="Bob" class="avatar">
                        <div class="author-info">
                            <span class="author">Bob</span>
                            <span class="time">Just now</span>
                        </div>
                    </div>
                    <p class="content">Fresh sunset vibes! 🌅🔥</p>
                    <img src="${createPlaceholderImage(300, 200, 'freshsunset')}" alt="Fresh sunset" class="post-image">
                    <div class="actions">
                        <button class="update-post" data-post="2">Comment</button>
                        <span class="comments">6 comments</span>
                    </div>
                `;
            } else if (postId == 3) {
                newContent = `
                    <div class="post-header">
                        <img src="${createPlaceholderAvatar('charlie', 40)}" alt="Charlie" class="avatar">
                        <div class="author-info">
                            <span class="author">Charlie</span>
                            <span class="time">Just now</span>
                        </div>
                    </div>
                    <p class="content">Updated recipe: Even better pasta! 🍝👨‍🍳</p>
                    <img src="${createPlaceholderImage(300, 200, 'updatedpasta')}" alt="Updated pasta recipe" class="post-image">
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
                        post.querySelectorAll('.action-btn').forEach(btn => {
                            btn.addEventListener('click', function() {
                                const action = this.dataset.action;
                                const btnPostId = this.dataset.post;
                                const btnPost = posts[btnPostId];
                                handleAction(btnPost, btnPostId, action);
                            });
                        });
                    }
                });
            } else {
                manualTransition(post, () => {
                    post.innerHTML = newContent;
                    post.querySelectorAll('.action-btn').forEach(btn => {
                        btn.addEventListener('click', function() {
                            const action = this.dataset.action;
                            const btnPostId = this.dataset.post;
                            const btnPost = posts[btnPostId];
                            handleAction(btnPost, btnPostId, action);
                        });
                    });
                });
            }
        });
    }

    // Helper function for handling action button clicks
    function handleAction(post, postId, action) {
        const actionMap = {
            like: '.like-count',
            comment: '.comments',
            share: '.shares'
        };

        if (action === 'like') {
            handleLikeAction(post, postId);
        } else {
            // Handle other actions (comment, share)
            const counterElement = post.querySelector(actionMap[action]);
            if (counterElement) {
                const currentCount = parseInt(counterElement.textContent) || 0;
                counterElement.textContent = currentCount + 1;

                // Add visual feedback
                const button = post.querySelector(`[data-action="${action}"]`);
                if (button) {
                    button.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        button.style.transform = '';
                    }, 150);
                }
            }
        }
    }

    // Special handling for like actions with heart morphing
    function handleLikeAction(post, postId) {
        const likeBtn = post.querySelector('.like-btn');
        const heartIcon = likeBtn.querySelector('.heart-icon');
        const likeCount = likeBtn.querySelector('.like-count');
        const isLiked = likeBtn.dataset.liked === 'true';

        if (isSupported) {
            // Use scoped view transitions for heart morphing
            likeBtn.style.viewTransitionName = `heart-${postId}-transition`;

            likeBtn.startViewTransition(() => {
                if (isLiked) {
                    // Unlike: filled heart → empty heart
                    heartIcon.textContent = '🤍';
                    likeBtn.dataset.liked = 'false';
                    const currentCount = parseInt(likeCount.textContent) || 0;
                    likeCount.textContent = Math.max(0, currentCount - 1);
                } else {
                    // Like: empty heart → filled heart
                    heartIcon.textContent = '❤️';
                    likeBtn.dataset.liked = 'true';
                    const currentCount = parseInt(likeCount.textContent) || 0;
                    likeCount.textContent = currentCount + 1;

                    // Add particle burst effect
                    createParticleBurst(likeBtn);
                }
            });
        } else {
            // Fallback for browsers without scoped transitions
            if (isLiked) {
                heartIcon.textContent = '🤍';
                likeBtn.dataset.liked = 'false';
                const currentCount = parseInt(likeCount.textContent) || 0;
                likeCount.textContent = Math.max(0, currentCount - 1);
            } else {
                heartIcon.textContent = '❤️';
                likeBtn.dataset.liked = 'true';
                const currentCount = parseInt(likeCount.textContent) || 0;
                likeCount.textContent = currentCount + 1;

                // Simple scale animation as fallback
                heartIcon.style.animation = 'heart-pop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                setTimeout(() => {
                    heartIcon.style.animation = '';
                }, 600);
            }
        }
    }

    // Create particle burst effect for likes
    function createParticleBurst(button) {
        const particles = ['💖', '✨', '💕', '🌟', '💫'];
        const particleCount = 5;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.textContent = particles[i % particles.length];

            // Random position around the button
            const rect = button.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            particle.style.left = centerX + (Math.random() - 0.5) * 40 + 'px';
            particle.style.top = centerY + (Math.random() - 0.5) * 40 + 'px';

            document.body.appendChild(particle);

            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
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
        const seeds = ['beach', 'books', 'hiking', 'cooking', 'music', 'tech'];

        const author = authors[(postId - 1) % authors.length];
        const content = contents[(postId - 1) % contents.length];
        const seed = seeds[(postId - 1) % seeds.length];
        const likesElement = post.querySelector('.likes');
        const currentLikes = likesElement ? parseInt(likesElement.textContent.split(' ')[0]) : 0;

        newContent = `
            <div class="post-header">
                <img src="${createPlaceholderAvatar(author.toLowerCase(), 40)}" alt="${author}" class="avatar">
                <div class="author-info">
                    <span class="author">${author}</span>
                    <span class="time">Just now</span>
                </div>
            </div>
            <p class="content">${content}</p>
            <img src="${createPlaceholderImage(300, 200, seed)}" alt="${content.split(' ')[0]}" class="post-image">
            <div class="actions">
                <button class="action-btn like-btn" data-post="${postId}" data-action="like">👍 Like</button>
                <span class="likes">${currentLikes + 1}</span>
                <button class="action-btn comment-btn" data-post="${postId}" data-action="comment">💬 Comment</button>
                <span class="comments">0</span>
                <button class="action-btn share-btn" data-post="${postId}" data-action="share">📤 Share</button>
                <span class="shares">0</span>
            </div>
        `;

        if (isSupported) {
            post.startViewTransition({
                callback: () => {
                    post.innerHTML = createSkeleton();
                    setTimeout(() => {
                        post.innerHTML = newContent;
                        post.querySelectorAll('.action-btn').forEach(btn => {
                            btn.addEventListener('click', function() {
                                const action = this.dataset.action;
                                handleAction(post, postId, action);
                            });
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
                        post.querySelectorAll('.action-btn').forEach(btn => {
                            btn.addEventListener('click', function() {
                                const action = this.dataset.action;
                                handleAction(post, postId, action);
                            });
                        });
                    }, 300);
                }, 1000);
            });
        }
    }

    // Bottom navigation transitions
    function attachNavListeners() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function() {
                const tab = this.dataset.tab;
                
                // Skip create button as it has special modal functionality
                if (tab === 'create') return;
                
                // Update active state
                document.querySelectorAll('.nav-item').forEach(navItem => {
                    navItem.classList.remove('active');
                });
                this.classList.add('active');
                
                // Update header based on selected tab
                let newHeader = '';
                switch(tab) {
                    case 'home':
                        newHeader = '<h1>Social Feed</h1>';
                        break;
                    case 'search':
                        newHeader = '<h1>Search</h1>';
                        break;
                    case 'profile':
                        newHeader = '<h1>Profile</h1>';
                        break;
                    default:
                        newHeader = '<h1>Social Feed</h1>';
                }
                
                // Always use manual transition for now since scoped view transitions have issues
                manualTransition(header, () => {
                    header.innerHTML = newHeader;
                });
            });
        });
    }

    attachNavListeners();
});