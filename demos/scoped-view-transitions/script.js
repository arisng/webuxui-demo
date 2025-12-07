// Scoped View Transitions Demo Script

document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const posts = {
        1: document.getElementById('post1'),
        2: document.getElementById('post2'),
        3: document.getElementById('post3')
    };
    const bottomNav = document.getElementById('bottom-nav');

    // Variable to save scroll position for back navigation
    let savedScrollPosition = 0;

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

    // Handle comment input submissions
    document.querySelectorAll('.comment-field').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                const postId = this.dataset.post;
                const commentText = this.value.trim();
                addNewComment(postId, commentText);
                this.value = '';
            }
        });
    });

    // Handle action buttons (like, comment, share)
    document.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent post expansion when clicking buttons
            const postId = this.dataset.post;
            const action = this.dataset.action;
            const post = posts[postId];
            handleAction(post, postId, action);
        });
    });

    // Scroll lock management
    let scrollLockCount = 0;

    function lockScroll() {
        scrollLockCount++;
        if (scrollLockCount === 1) {
            document.body.style.overflow = 'hidden';
        }
    }

    function unlockScroll() {
        scrollLockCount = Math.max(0, scrollLockCount - 1);
        if (scrollLockCount === 0) {
            document.body.style.overflow = '';
        }
    }

    // Notification System
    let notificationId = 0;

    function createNotification(message, type = 'info', duration = 4000) {
        const container = document.getElementById('notification-container');
        const id = ++notificationId;

        const notification = document.createElement('div');
        notification.className = `notification-badge ${type}`;
        notification.id = `notification-${id}`;
        notification.style.viewTransitionName = `notification-${type}-transition`;

        const icons = {
            info: '💬',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };

        notification.innerHTML = `
            <span class="notification-icon">${icons[type] || '💬'}</span>
            <span class="notification-message">${message}</span>
            <span class="notification-close" onclick="dismissNotification(${id})">&times;</span>
        `;

        // Add click handler for the notification itself
        notification.addEventListener('click', (e) => {
            if (!e.target.classList.contains('notification-close')) {
                dismissNotification(id);
            }
        });

        container.appendChild(notification);

        // Auto-dismiss after duration
        setTimeout(() => {
            if (notification.parentNode) {
                dismissNotification(id);
            }
        }, duration);

        return id;
    }

    function dismissNotification(id) {
        const notification = document.getElementById(`notification-${id}`);
        if (!notification) return;

        if (isSupported) {
            notification.startViewTransition(() => {
                notification.remove();
            });
        } else {
            notification.style.animation = 'notification-slide-out 0.3s ease forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }

    function showRandomNotification() {
        const messages = [
            'Someone liked your post!',
            'New comment on your photo',
            'Your post is trending! 🔥',
            'Friend request accepted',
            'Message from Sarah',
            'Post shared successfully',
            'New follower: @johndoe',
            'Photo liked by 5 people'
        ];

        const types = ['info', 'success', 'warning'];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        const randomType = types[Math.floor(Math.random() * types.length)];

        createNotification(randomMessage, randomType);
    }

    // Make functions globally available for onclick handlers
    window.dismissNotification = dismissNotification;
    window.showRandomNotification = showRandomNotification;

    const createPostBtn = document.getElementById('create-post-btn');
    const createPostModal = document.getElementById('create-post-modal');
    const modalClose = document.getElementById('modal-close');
    const cancelPost = document.getElementById('cancel-post');
    const createPostForm = document.getElementById('create-post-form');
    const postContentTextarea = document.getElementById('post-content');

    // Open modal
    createPostBtn.addEventListener('click', () => {
        lockScroll();
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
        unlockScroll();
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
        newPost.setAttribute('onclick', `togglePostExpansion('post${postCount}')`);

        // Use current user (could be made dynamic)
        const author = 'You';
        const avatarColor = '007bff';
        const randomSeed = ['userpost1', 'userpost2', 'userpost3'][Math.floor(Math.random() * 3)];

        newPost.innerHTML = `
            <div class="post-header">
                <img src="${createPlaceholderAvatar('you', 40)}" alt="${author}" class="avatar">
                <div class="author-info">
                    <span class="author">${author}</span>
                    <span class="time">Just now</span>
                </div>
            </div>
            <p class="content">${content}</p>
            <img src="${createPlaceholderImage(300, 200, randomSeed)}" alt="User post" class="post-image" style="view-transition-name: image-${postCount};">
            <div class="actions">
                <button class="action-btn like-btn" data-post="${postCount}" data-action="like" data-liked="false">
                    <span class="heart-icon">🤍</span>
                    <span class="like-count">0</span>
                </button>
                <button class="action-btn comment-btn" data-post="${postCount}" data-action="comment">💬 Comment</button>
                <span class="comments">0</span>
                <button class="action-btn share-btn" data-post="${postCount}" data-action="share">📤 Share</button>
                <span class="shares">0</span>
            </div>
            <div class="comments-section" id="comments-${postCount}" style="display: none;">
                <div class="comment-input">
                    <img src="https://picsum.photos/seed/user/32/32" alt="You" class="comment-avatar">
                    <input type="text" class="comment-field" placeholder="Write a comment..." data-post="${postCount}">
                </div>
                <div class="comments-list">
                    <!-- Comments will be populated dynamically -->
                </div>
            </div>
        `;

        // Insert at the top of the feed
        mainElement.insertBefore(newPost, mainElement.firstElementChild);

        // Attach event listeners to action buttons
        newPost.querySelectorAll('.action-btn').forEach(button => {
            button.addEventListener('click', function(event) {
                event.stopPropagation();
                const postId = this.dataset.post;
                const action = this.dataset.action;
                handleAction(newPost, postId, action);
            });
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

            // Attach event listeners to new post action buttons
            newPost.querySelectorAll('.action-btn').forEach(button => {
                button.addEventListener('click', function(event) {
                    event.stopPropagation();
                    const postId = this.dataset.post;
                    const action = this.dataset.action;
                    handleAction(newPost, postId, action);
                });
            });

            loadingMore.classList.add('hidden');
            isLoadingMore = false;
        }, 1500);
    }

    function createNewPost(id) {
        const authors = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
        const contents = [
            'Amazing day at the beach! 🏖️ The waves were perfect for surfing.',
            'New book recommendations? 📚 I just finished an incredible mystery novel.',
            'Weekend hiking adventures! ⛰️ The trails were challenging but rewarding.',
            'Cooking experiments in progress! 👩‍🍳 Trying fusion cuisine tonight.',
            'Music discovery of the week! 🎵 This new artist has blown me away.',
            'Tech tips and tricks! 💻 Productivity shortcuts that changed my workflow.'
        ];
        const seeds = ['beach', 'books', 'hiking', 'cooking', 'music', 'tech'];

        const author = authors[(id - 1) % authors.length];
        const content = contents[(id - 1) % contents.length];
        const seed = seeds[(id - 1) % seeds.length];

        const post = document.createElement('article');
        post.className = 'post';
        post.id = `post${id}`;
        post.style.contain = 'layout';
        post.setAttribute('onclick', `togglePostExpansion('post${id}')`);
        post.innerHTML = `
            <div class="post-header">
                <img src="${createPlaceholderAvatar(author.toLowerCase(), 40)}" alt="${author}" class="avatar">
                <div class="author-info">
                    <span class="author">${author}</span>
                    <span class="time">Just now</span>
                </div>
            </div>
            <p class="content">${content}</p>
            <img src="${createPlaceholderImage(300, 200, seed)}" alt="${content.split(' ')[0]}" class="post-image" style="view-transition-name: image-${id};">
            <div class="actions">
                <button class="action-btn like-btn" data-post="${id}" data-action="like" data-liked="false">
                    <span class="heart-icon">🤍</span>
                    <span class="like-count">${Math.floor(Math.random() * 20) + 1}</span>
                </button>
                <button class="action-btn comment-btn" data-post="${id}" data-action="comment">💬 Comment</button>
                <span class="comments">${Math.floor(Math.random() * 10)}</span>
                <button class="action-btn share-btn" data-post="${id}" data-action="share">📤 Share</button>
                <span class="shares">${Math.floor(Math.random() * 5)}</span>
            </div>
            <div class="comments-section" id="comments-${id}" style="display: none;">
                <div class="comment-input">
                    <img src="https://picsum.photos/seed/user/32/32" alt="You" class="comment-avatar">
                    <input type="text" class="comment-field" placeholder="Write a comment..." data-post="${id}">
                </div>
                <div class="comments-list">
                    <!-- Comments will be populated dynamically -->
                </div>
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
                    <p class="content">Refreshed! Just tried an amazing new brew with unique flavors! ☕✨ The barista recommended it and it was perfect.</p>
                    <img src="${createPlaceholderImage(300, 200, 'newcoffee')}" alt="New coffee experience" class="post-image" style="view-transition-name: image-1;">
                    <div class="actions">
                        <button class="action-btn like-btn" data-post="1" data-action="like" data-liked="false">
                            <span class="heart-icon">❤️</span>
                            <span class="like-count">15</span>
                        </button>
                        <button class="action-btn comment-btn" data-post="1" data-action="comment">💬 Comment</button>
                        <span class="comments">5</span>
                        <button class="action-btn share-btn" data-post="1" data-action="share">📤 Share</button>
                        <span class="shares">3</span>
                    </div>
                    <div class="comments-section" id="comments-1" style="display: none;">
                        <div class="comment-input">
                            <img src="https://picsum.photos/seed/user/32/32" alt="You" class="comment-avatar">
                            <input type="text" class="comment-field" placeholder="Write a comment..." data-post="1">
                        </div>
                        <div class="comments-list">
                        </div>
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
                    <p class="content">Fresh sunset vibes with incredible colors! 🌅🔥 The sky was on fire with oranges and pinks.</p>
                    <img src="${createPlaceholderImage(300, 200, 'freshsunset')}" alt="Fresh sunset" class="post-image" style="view-transition-name: image-2;">
                    <div class="actions">
                        <button class="action-btn like-btn" data-post="2" data-action="like" data-liked="false">
                            <span class="heart-icon">🤍</span>
                            <span class="like-count">10</span>
                        </button>
                        <button class="action-btn comment-btn" data-post="2" data-action="comment">💬 Comment</button>
                        <span class="comments">6</span>
                        <button class="action-btn share-btn" data-post="2" data-action="share">📤 Share</button>
                        <span class="shares">2</span>
                    </div>
                    <div class="comments-section" id="comments-2" style="display: none;">
                        <div class="comment-input">
                            <img src="https://picsum.photos/seed/user/32/32" alt="You" class="comment-avatar">
                            <input type="text" class="comment-field" placeholder="Write a comment..." data-post="2">
                        </div>
                        <div class="comments-list">
                        </div>
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
                    <p class="content">Updated recipe: Even better pasta with fresh ingredients! 🍝👨‍🍳 Added truffle oil for extra flavor.</p>
                    <img src="${createPlaceholderImage(300, 200, 'updatedpasta')}" alt="Updated pasta recipe" class="post-image" style="view-transition-name: image-3;">
                    <div class="actions">
                        <button class="action-btn like-btn" data-post="3" data-action="like" data-liked="false">
                            <span class="heart-icon">🤍</span>
                            <span class="like-count">20</span>
                        </button>
                        <button class="action-btn comment-btn" data-post="3" data-action="comment">💬 Comment</button>
                        <span class="comments">8</span>
                        <button class="action-btn share-btn" data-post="3" data-action="share">📤 Share</button>
                        <span class="shares">8</span>
                    </div>
                    <div class="comments-section" id="comments-3" style="display: none;">
                        <div class="comment-input">
                            <img src="https://picsum.photos/seed/user/32/32" alt="You" class="comment-avatar">
                            <input type="text" class="comment-field" placeholder="Write a comment..." data-post="3">
                        </div>
                        <div class="comments-list">
                        </div>
                    </div>
                `;
            }

            if (isSupported) {
                post.startViewTransition({
                    callback: () => {
                        post.innerHTML = newContent;
                        // Re-attach event listeners
                        post.querySelectorAll('.action-btn').forEach(btn => {
                            btn.addEventListener('click', function(event) {
                                event.stopPropagation();
                                const action = this.dataset.action;
                                const btnPostId = this.dataset.post;
                                const btnPost = document.getElementById(`post${btnPostId}`);
                                handleAction(btnPost, btnPostId, action);
                            });
                        });
                    }
                });
            } else {
                manualTransition(post, () => {
                    post.innerHTML = newContent;
                    post.querySelectorAll('.action-btn').forEach(btn => {
                        btn.addEventListener('click', function(event) {
                            event.stopPropagation();
                            const action = this.dataset.action;
                            const btnPostId = this.dataset.post;
                            const btnPost = document.getElementById(`post${btnPostId}`);
                            handleAction(btnPost, btnPostId, action);
                        });
                    });
                });
            }
        });
    }

    // Helper function for handling action button clicks
    function handleAction(post, postId, action) {
        if (action === 'like') {
            handleLikeAction(post, postId);
        } else if (action === 'comment') {
            handleCommentAction(post, postId);
        } else if (action === 'share') {
            handleShareAction(post, postId);
        } else {
            // Handle other actions (share)
            const counterElement = post.querySelector('.shares');
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

                    // Show notification
                    createNotification('Post liked! ❤️', 'success');
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

    // Special handling for comment actions (expand/collapse)
    function handleCommentAction(post, postId) {
        const commentsSection = document.getElementById(`comments-${postId}`);
        const isVisible = commentsSection.style.display !== 'none';

        if (isSupported) {
            // Use scoped view transitions for smooth expand/collapse
            commentsSection.style.viewTransitionName = `comments-${postId}-transition`;

            commentsSection.startViewTransition(() => {
                if (isVisible) {
                    // Collapse comments
                    commentsSection.style.display = 'none';
                } else {
                    // Expand comments
                    commentsSection.style.display = 'block';
                }
            });
        } else {
            // Fallback for browsers without scoped transitions
            if (isVisible) {
                commentsSection.style.display = 'none';
            } else {
                commentsSection.style.display = 'block';
                // Add simple fade-in animation for comments
                const comments = commentsSection.querySelectorAll('.comment');
                comments.forEach((comment, index) => {
                    comment.style.opacity = '0';
                    comment.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        comment.style.transition = 'all 0.3s ease';
                        comment.style.opacity = '1';
                        comment.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        }
    }

    // Add a new comment to a post
    function addNewComment(postId, commentText) {
        const commentsList = document.querySelector(`#comments-${postId} .comments-list`);
        const commentCount = document.querySelector(`[data-post="${postId}"].action-btn + .comments`);

        // Create new comment element
        const newComment = document.createElement('div');
        newComment.className = 'comment';
        newComment.innerHTML = `
            <img src="https://picsum.photos/seed/user/32/32" alt="You" class="comment-avatar">
            <div class="comment-content">
                <span class="comment-author">You</span>
                <span class="comment-time">Just now</span>
                <p class="comment-text">${commentText}</p>
            </div>
        `;

        // Add animation to new comment
        newComment.style.opacity = '0';
        newComment.style.transform = 'translateY(10px)';

        // Insert at the top of comments list
        commentsList.insertBefore(newComment, commentsList.firstChild);

        // Animate in the new comment
        setTimeout(() => {
            newComment.style.transition = 'all 0.3s ease';
            newComment.style.opacity = '1';
            newComment.style.transform = 'translateY(0)';
        }, 10);

        // Update comment count
        const currentCount = parseInt(commentCount.textContent) || 0;
        commentCount.textContent = currentCount + 1;

        // Show notification
        createNotification('Comment added! 💬', 'info');
    }

    // Special handling for share actions (show share sheet)
    function handleShareAction(post, postId) {
        const shareSheetOverlay = document.getElementById('share-sheet-overlay');
        const shareSheet = document.getElementById('share-sheet');

        // Lock scroll when overlay is shown
        lockScroll();

        if (isSupported) {
            // Use scoped view transitions for share sheet appearance
            shareSheet.style.viewTransitionName = `share-sheet-${postId}-transition`;

            shareSheetOverlay.startViewTransition(() => {
                shareSheetOverlay.classList.add('visible');
            });
        } else {
            // Fallback for browsers without scoped transitions
            shareSheetOverlay.classList.add('visible');
        }
    }

    // Function to toggle post expansion
    // Function to navigate to post details view
    function togglePostExpansion(postId) {
        const post = document.getElementById(postId);
        const detailsView = document.getElementById('details-view');
        const detailsPost = document.getElementById('details-post');
        const mainElement = document.querySelector('main');
        const header = document.getElementById('header');
        const bottomNav = document.getElementById('bottom-nav');

        // Save current scroll position
        savedScrollPosition = mainElement.scrollTop;

        // Populate details view with post content
        populateDetailsView(post);

        if (isSupported) {
            // Use view transitions for page navigation
            document.startViewTransition(() => {
                // Hide feed, show details
                mainElement.style.display = 'none';
                header.style.display = 'none';
                bottomNav.style.display = 'none';
                detailsView.style.display = 'block';

                // Set view transition names for smooth transition
                post.style.viewTransitionName = 'details-post-transition';
                detailsPost.style.viewTransitionName = 'details-post-transition';
            });
        } else {
            // Fallback
            mainElement.style.display = 'none';
            header.style.display = 'none';
            bottomNav.style.display = 'none';
            detailsView.style.display = 'block';
        }
    }

    // Function to populate details view
    function populateDetailsView(post) {
        const detailsPost = document.getElementById('details-post');
        const relatedList = document.querySelector('.related-list');

        // Clone the post content and enhance it
        const postClone = post.cloneNode(true);
        postClone.id = 'details-post-content';
        postClone.className = 'details-post-content';

        // Remove onclick to prevent recursion
        postClone.removeAttribute('onclick');

        // Expand comments by default in details
        const commentsSection = postClone.querySelector('.comments-section');
        if (commentsSection) {
            commentsSection.style.display = 'block';
        }

        // Add more detailed content
        const content = postClone.querySelector('.content');
        if (content) {
            content.innerHTML += '<br><br>This is additional content that would appear in the full article view. Here you can include more details, background information, or extended thoughts about the topic. The details view allows for a more immersive reading experience with better typography and layout.';
        }

        // Clear and populate details post
        detailsPost.innerHTML = '';
        detailsPost.appendChild(postClone);

        // Populate related posts
        relatedList.innerHTML = '';
        const relatedPosts = [
            { author: 'Bob', text: 'Beautiful sunset today! 🌅', image: 'sunset' },
            { author: 'Charlie', text: 'New recipe alert! 🍝', image: 'pasta' },
            { author: 'Diana', text: 'Weekend hiking adventure! 🥾', image: 'hiking' }
        ];

        relatedPosts.forEach(related => {
            const relatedElement = document.createElement('div');
            relatedElement.className = 'related-post';
            relatedElement.innerHTML = `
                <img src="${createPlaceholderImage(60, 60, related.image)}" alt="${related.text}">
                <div class="related-content">
                    <div class="related-author">${related.author}</div>
                    <div class="related-text">${related.text}</div>
                </div>
            `;
            relatedList.appendChild(relatedElement);
        });
    }

    // Function to go back to feed
    function goBackToFeed() {
        const detailsView = document.getElementById('details-view');
        const mainElement = document.querySelector('main');
        const header = document.getElementById('header');
        const bottomNav = document.getElementById('bottom-nav');

        if (isSupported) {
            // Use view transitions for page navigation
            document.startViewTransition(() => {
                // Hide details, show feed
                detailsView.style.display = 'none';
                mainElement.style.display = 'block';
                header.style.display = 'block';
                bottomNav.style.display = 'block';

                // Restore scroll position
                mainElement.scrollTop = savedScrollPosition;
            });
        } else {
            // Fallback
            detailsView.style.display = 'none';
            mainElement.style.display = 'block';
            header.style.display = 'block';
            bottomNav.style.display = 'block';
            mainElement.scrollTop = savedScrollPosition;
        }
    }

    // Make functions global
    window.togglePostExpansion = togglePostExpansion;
    window.goBackToFeed = goBackToFeed;

    // Handle share option clicks
    document.querySelectorAll('.share-option').forEach(option => {
        option.addEventListener('click', function() {
            const shareType = this.dataset.share;
            handleShareOption(shareType);
        });
    });

    // Handle share sheet close
    document.getElementById('share-close').addEventListener('click', hideShareSheet);
    document.getElementById('share-sheet-overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            hideShareSheet();
        }
    });

    // Function to hide share sheet
    function hideShareSheet() {
        const shareSheetOverlay = document.getElementById('share-sheet-overlay');

        if (isSupported) {
            shareSheetOverlay.startViewTransition(() => {
                shareSheetOverlay.classList.remove('visible');
            });
        } else {
            shareSheetOverlay.classList.remove('visible');
        }

        // Unlock scroll when overlay is hidden
        unlockScroll();
    }

    // Handle individual share options
    function handleShareOption(shareType) {
        // Simulate sharing action
        const messages = {
            twitter: 'Post shared to Twitter! 🐦',
            facebook: 'Post shared to Facebook! 📘',
            copy: 'Link copied to clipboard! 🔗',
            whatsapp: 'Post shared via WhatsApp! 💬',
            telegram: 'Post shared via Telegram! ✈️',
            email: 'Post shared via Email! ✉️'
        };

        // Show feedback (you could replace this with actual sharing functionality)
        showShareFeedback(messages[shareType] || 'Shared!');

        // Show notification
        createNotification(messages[shareType] || 'Post shared!', 'success');

        // Hide share sheet
        setTimeout(() => {
            hideShareSheet();
        }, 500);
    }

    // Show share feedback
    function showShareFeedback(message) {
        // Create a temporary feedback element
        const feedback = document.createElement('div');
        feedback.textContent = message;
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-size: 0.875rem;
            z-index: 2000;
            pointer-events: none;
            animation: share-feedback 2s ease-out;
        `;

        document.body.appendChild(feedback);

        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 2000);
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

    // Mobile viewport handling for dynamic address bar
    function handleViewportChanges() {
        let currentHeight = window.innerHeight;

        const updateViewportHeight = () => {
            const newHeight = window.innerHeight;
            const heightChanged = Math.abs(newHeight - currentHeight) > 100; // Significant change

            if (heightChanged) {
                // Update CSS custom property for dynamic height
                document.documentElement.style.setProperty('--vh', `${newHeight * 0.01}px`);
                currentHeight = newHeight;

                // Force layout recalculation for fixed elements
                const nav = document.getElementById('bottom-nav');
                if (nav) {
                    nav.style.transform = 'translateZ(0)';
                    setTimeout(() => {
                        nav.style.transform = '';
                    }, 10);
                }
            }
        };

        // Set initial value
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);

        // Listen for viewport changes
        window.addEventListener('resize', updateViewportHeight);
        window.addEventListener('orientationchange', () => {
            setTimeout(updateViewportHeight, 100);
        });

        // iOS Safari specific handling
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            window.addEventListener('focusin', () => {
                setTimeout(updateViewportHeight, 300);
            });
            window.addEventListener('focusout', () => {
                setTimeout(updateViewportHeight, 300);
            });
        }
    }

    handleViewportChanges();

    attachNavListeners();
});