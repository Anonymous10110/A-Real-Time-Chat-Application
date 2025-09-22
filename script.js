>
        // Sample data for demonstration
        const sampleUsers = [
            { id: 1, name: "Alice Johnson", avatar: "AJ", status: "online", lastSeen: null },
            { id: 2, name: "Bob Smith", avatar: "BS", status: "online", lastSeen: null },
            { id: 3, name: "Carol Davis", avatar: "CD", status: "away", lastSeen: "2 hours ago" },
            { id: 4, name: "David Wilson", avatar: "DW", status: "offline", lastSeen: "Yesterday" },
            { id: 5, name: "Emma Brown", avatar: "EB", status: "online", lastSeen: null }
        ];

        const sampleGroups = [
            { id: 101, name: "Project Team", avatar: "PT", members: 5, lastMessage: "Let's meet tomorrow at 10 AM" },
            { id: 102, name: "Family Group", avatar: "FG", members: 8, lastMessage: "Happy birthday to mom! 🎂" },
            { id: 103, name: "Book Club", avatar: "BC", members: 12, lastMessage: "Next book: 'The Midnight Library'" }
        ];

        const sampleMessages = {
            1: [
                { id: 1, sender: 1, text: "Hey, how are you?", timestamp: "10:30 AM", status: "read" },
                { id: 2, sender: "current", text: "I'm good, thanks! How about you?", timestamp: "10:32 AM", status: "read" },
                { id: 3, sender: 1, text: "Doing great! Just finished the project.", timestamp: "10:35 AM", status: "read" },
                { id: 4, sender: "current", text: "That's awesome! 🎉", timestamp: "10:36 AM", status: "read" }
            ],
            2: [
                { id: 1, sender: 2, text: "Are we still meeting today?", timestamp: "09:15 AM", status: "read" },
                { id: 2, sender: "current", text: "Yes, 3 PM at the usual place", timestamp: "09:20 AM", status: "read" },
                { id: 3, sender: 2, text: "Perfect, see you then!", timestamp: "09:21 AM", status: "read" }
            ],
            3: [
                { id: 1, sender: 3, text: "Thanks for your help yesterday!", timestamp: "Yesterday", status: "read" },
                { id: 2, sender: "current", text: "No problem, happy to help! 😊", timestamp: "Yesterday", status: "read" }
            ],
            101: [
                { id: 1, sender: 1, text: "Team, I've uploaded the latest design files", timestamp: "11:45 AM", status: "read" },
                { id: 2, sender: 2, text: "Great, I'll review them this afternoon", timestamp: "11:50 AM", status: "read" },
                { id: 3, sender: "current", text: "I'll work on the frontend integration", timestamp: "11:52 AM", status: "read" }
            ]
        };

        // App State
        let currentUser = null;
        let activeChat = null;
        let isDarkMode = false;
        let emojiPickerVisible = false;
        let fileToSend = null;
        let typingTimeout = null;

        // DOM Elements
        const authModal = document.getElementById('authModal');
        const appContainer = document.getElementById('appContainer');
        const themeToggle = document.getElementById('themeToggle');
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const authTabs = document.querySelectorAll('.auth-tab');
        const userProfile = document.getElementById('userProfile');
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');
        const userStatus = document.getElementById('userStatus');
        const chatsList = document.getElementById('chatsList');
        const searchInput = document.getElementById('searchInput');
        const activeChatName = document.getElementById('activeChatName');
        const activeChatAvatar = document.getElementById('activeChatAvatar');
        const activeChatStatus = document.getElementById('activeChatStatus');
        const messagesContainer = document.getElementById('messagesContainer');
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        const emojiBtn = document.getElementById('emojiBtn');
        const emojiPicker = document.getElementById('emojiPicker');
        const emojiGrid = document.getElementById('emojiGrid');
        const attachmentBtn = document.getElementById('attachmentBtn');
        const filePreview = document.getElementById('filePreview');
        const fileName = document.getElementById('fileName');
        const fileSize = document.getElementById('fileSize');
        const removeFile = document.getElementById('removeFile');
        const typingIndicator = document.getElementById('typingIndicator');
        const typingUser = document.getElementById('typingUser');

        // Initialize the app
        function init() {
            // Check if user is already logged in (from localStorage)
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                currentUser = JSON.parse(savedUser);
                showApp();
            } else {
                showAuthModal();
            }
            
            setupEventListeners();
            renderChatsList();
            renderEmojis();
        }

        // Set up event listeners
        function setupEventListeners() {
            // Auth forms
            loginForm.addEventListener('submit', handleLogin);
            signupForm.addEventListener('submit', handleSignup);
            
            // Auth tabs
            authTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const tabName = tab.dataset.tab;
                    switchAuthTab(tabName);
                });
            });
            
            // Theme toggle
            themeToggle.addEventListener('click', toggleTheme);
            
            // Message input
            messageInput.addEventListener('input', handleTyping);
            messageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
            
            // Send button
            sendBtn.addEventListener('click', sendMessage);
            
            // Emoji picker
            emojiBtn.addEventListener('click', toggleEmojiPicker);
            document.addEventListener('click', (e) => {
                if (!emojiPicker.contains(e.target) && e.target !== emojiBtn) {
                    emojiPicker.classList.remove('active');
                    emojiPickerVisible = false;
                }
            });
            
            // File attachment
            attachmentBtn.addEventListener('click', handleFileAttachment);
            removeFile.addEventListener('click', removeAttachedFile);
            
            // Search
            searchInput.addEventListener('input', filterChats);
            
            // Sidebar tabs
            document.querySelectorAll('.tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    renderChatsList(tab.dataset.tab);
                });
            });
        }

        // Auth functions
        function handleLogin(e) {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            
            // Simple validation (in a real app, this would check against a database)
            if (username && password) {
                // For demo purposes, create a user object
                currentUser = {
                    id: 100, // Current user ID
                    name: username,
                    avatar: username.substring(0, 2).toUpperCase(),
                    status: 'online'
                };
                
                // Save to localStorage
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                showApp();
            } else {
                alert('Please enter both username and password');
            }
        }

        function handleSignup(e) {
            e.preventDefault();
            const username = document.getElementById('signupUsername').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const avatarUrl = document.getElementById('signupAvatar').value;
            
            if (username && email && password) {
                // For demo purposes, create a user object
                currentUser = {
                    id: 100, // Current user ID
                    name: username,
                    avatar: avatarUrl || username.substring(0, 2).toUpperCase(),
                    status: 'online'
                };
                
                // Save to localStorage
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                showApp();
            } else {
                alert('Please fill in all required fields');
            }
        }

        function switchAuthTab(tabName) {
            authTabs.forEach(tab => tab.classList.remove('active'));
            document.querySelector(`.auth-tab[data-tab="${tabName}"]`).classList.add('active');
            
            if (tabName === 'login') {
                loginForm.style.display = 'block';
                signupForm.style.display = 'none';
            } else {
                loginForm.style.display = 'none';
                signupForm.style.display = 'block';
            }
        }

        function showAuthModal() {
            authModal.style.display = 'flex';
            appContainer.style.display = 'none';
        }

        function showApp() {
            authModal.style.display = 'none';
            appContainer.style.display = 'flex';
            
            // Update user info in the UI
            userName.textContent = currentUser.name;
            userAvatar.textContent = currentUser.avatar;
            userStatus.textContent = 'Online';
            
            // Select the first chat by default
            if (sampleUsers.length > 0) {
                setActiveChat(sampleUsers[0], 'user');
            }
        }

        // Theme functions
        function toggleTheme() {
            isDarkMode = !isDarkMode;
            document.body.classList.toggle('dark-mode', isDarkMode);
            themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            
            // Save theme preference
            localStorage.setItem('darkMode', isDarkMode);
        }

        // Chat functions
        function renderChatsList(tab = 'chats') {
            chatsList.innerHTML = '';
            
            if (tab === 'chats' || tab === 'contacts') {
                // Render user chats
                sampleUsers.forEach(user => {
                    const lastMessage = getLastMessage(user.id);
                    const chatItem = createChatItem(user, lastMessage, 'user');
                    chatsList.appendChild(chatItem);
                });
            }
            
            if (tab === 'groups' || tab === 'chats') {
                // Render group chats
                sampleGroups.forEach(group => {
                    const lastMessage = getLastMessage(group.id);
                    const chatItem = createChatItem(group, lastMessage, 'group');
                    chatsList.appendChild(chatItem);
                });
            }
        }

        function createChatItem(chat, lastMessage, type) {
            const chatItem = document.createElement('div');
            chatItem.className = 'chat-item';
            if (activeChat && activeChat.id === chat.id && activeChat.type === type) {
                chatItem.classList.add('active');
            }
            
            chatItem.innerHTML = `
                <div class="chat-avatar">${chat.avatar}</div>
                <div class="chat-info">
                    <div class="chat-header">
                        <div class="chat-name">${chat.name}</div>
                        <div class="last-time">${lastMessage ? lastMessage.timestamp : ''}</div>
                    </div>
                    <div class="last-message">${lastMessage ? lastMessage.text : 'No messages yet'}</div>
                </div>
            `;
            
            chatItem.addEventListener('click', () => {
                setActiveChat(chat, type);
                document.querySelectorAll('.chat-item').forEach(item => item.classList.remove('active'));
                chatItem.classList.add('active');
            });
            
            return chatItem;
        }

        function getLastMessage(chatId) {
            if (sampleMessages[chatId] && sampleMessages[chatId].length > 0) {
                return sampleMessages[chatId][sampleMessages[chatId].length - 1];
            }
            return null;
        }

        function setActiveChat(chat, type) {
            activeChat = { ...chat, type };
            
            // Update UI
            activeChatName.textContent = chat.name;
            activeChatAvatar.textContent = chat.avatar;
            
            if (type === 'user') {
                activeChatStatus.textContent = chat.status === 'online' ? 'Online' : 
                                            chat.status === 'away' ? 'Away' : 
                                            `Last seen ${chat.lastSeen}`;
            } else {
                activeChatStatus.textContent = `${chat.members} members`;
            }
            
            // Render messages
            renderMessages();
        }

        function renderMessages() {
            if (!activeChat) return;
            
            messagesContainer.innerHTML = '';
            
            const messages = sampleMessages[activeChat.id] || [];
            
            messages.forEach(message => {
                const messageElement = createMessageElement(message);
                messagesContainer.appendChild(messageElement);
            });
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function createMessageElement(message) {
            const messageDiv = document.createElement('div');
            const isSent = message.sender === 'current';
            
            messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;
            
            let senderName = 'You';
            let senderAvatar = currentUser.avatar;
            
            if (!isSent) {
                const sender = sampleUsers.find(u => u.id === message.sender);
                if (sender) {
                    senderName = sender.name;
                    senderAvatar = sender.avatar;
                } else if (activeChat.type === 'group') {
                    senderName = 'Unknown User';
                    senderAvatar = 'UU';
                }
            }
            
            messageDiv.innerHTML = `
                <div class="message-avatar">${senderAvatar}</div>
                <div class="message-content">
                    <div class="message-text">${message.text}</div>
                    <div class="message-time">${message.timestamp}</div>
                    ${isSent ? `<div class="message-status">${message.status === 'read' ? '✓✓' : '✓'}</div>` : ''}
                </div>
            `;
            
            return messageDiv;
        }

        function sendMessage() {
            const text = messageInput.value.trim();
            if (!text && !fileToSend) return;
            
            // Create message object
            const message = {
                id: Date.now(), // Simple ID generation
                sender: 'current',
                text: text,
                timestamp: getCurrentTime(),
                status: 'sent' // In a real app, this would change to 'delivered' and then 'read'
            };
            
            // Add to messages
            if (!sampleMessages[activeChat.id]) {
                sampleMessages[activeChat.id] = [];
            }
            sampleMessages[activeChat.id].push(message);
            
            // Render the new message
            const messageElement = createMessageElement(message);
            messagesContainer.appendChild(messageElement);
            
            // Clear input and scroll to bottom
            messageInput.value = '';
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Simulate response after a delay (in a real app, this would come from the server)
            if (activeChat.type === 'user') {
                setTimeout(() => {
                    const response = {
                        id: Date.now() + 1,
                        sender: activeChat.id,
                        text: getRandomResponse(),
                        timestamp: getCurrentTime(),
                        status: 'read'
                    };
                    
                    sampleMessages[activeChat.id].push(response);
                    const responseElement = createMessageElement(response);
                    messagesContainer.appendChild(responseElement);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }, 1000 + Math.random() * 2000);
            }
            
            // Update chat list
            renderChatsList();
            
            // Hide typing indicator
            typingIndicator.style.display = 'none';
        }

        function getCurrentTime() {
            const now = new Date();
            return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        function getRandomResponse() {
            const responses = [
                "That's interesting!",
                "I see what you mean.",
                "Tell me more about that.",
                "I agree with you.",
                "That's a good point.",
                "Thanks for sharing!",
                "I'll think about that.",
                "That makes sense.",
                "I appreciate your perspective.",
                "Let's discuss this further."
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }

        function handleTyping() {
            // Show typing indicator in the active chat
            if (activeChat && activeChat.type === 'user') {
                typingUser.textContent = activeChat.name;
                typingIndicator.style.display = 'flex';
                
                // Clear previous timeout
                if (typingTimeout) {
                    clearTimeout(typingTimeout);
                }
                
                // Hide typing indicator after 2 seconds of inactivity
                typingTimeout = setTimeout(() => {
                    typingIndicator.style.display = 'none';
                }, 2000);
            }
        }

        // Emoji functions
        function toggleEmojiPicker() {
            emojiPickerVisible = !emojiPickerVisible;
            emojiPicker.classList.toggle('active', emojiPickerVisible);
        }

        function renderEmojis() {
            // Sample emojis by category
            const emojiCategories = {
                smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳'],
                people: ['👋', '🤚', '🖐', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏'],
                nature: ['🐵', '🐒', '🦍', '🦧', '🐶', '🐕', '🦮', '🐩', '🐺', '🦊', '🦝', '🐱', '🐈', '🦁', '🐯', '🐅', '🐆', '🐴', '🐎', '🦄', '🦓', '🦌', '🐮', '🐂', '🐃', '🐄', '🐷', '🐖', '🐗', '🐽'],
                food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔'],
                activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷'],
                objects: ['💡', '🔦', '🏮', '🪔', '📔', '📕', '📖', '📗', '📘', '📙', '📚', '📓', '📒', '📃', '📜', '📄', '📰', '🗞', '📑', '🔖', '🏷', '💰', '🪙', '💴', '💵', '💶', '💷', '💸', '💳', '🧾'],
                symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐'],
                flags: ['🏳️', '🏴', '🏁', '🚩', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇦🇫', '🇦🇽', '🇦🇱', '🇩🇿', '🇦🇸', '🇦🇩', '🇦🇴', '🇦🇮', '🇦🇶', '🇦🇬', '🇦🇷', '🇦🇲', '🇦🇼', '🇦🇺', '🇦🇹', '🇦🇿', '🇧🇸', '🇧🇭', '🇧🇩', '🇧🇧', '🇧🇾', '🇧🇪', '🇧🇿']
            };
            
            // Render first category by default
            renderEmojiCategory('smileys');
            
            // Add event listeners to category buttons
            document.querySelectorAll('.emoji-category').forEach(button => {
                button.addEventListener('click', () => {
                    document.querySelectorAll('.emoji-category').forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    renderEmojiCategory(button.dataset.category);
                });
            });
        }

        function renderEmojiCategory(category) {
            const emojis = {
                smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳'],
                people: ['👋', '🤚', '🖐', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏'],
                nature: ['🐵', '🐒', '🦍', '🦧', '🐶', '🐕', '🦮', '🐩', '🐺', '🦊', '🦝', '🐱', '🐈', '🦁', '🐯', '🐅', '🐆', '🐴', '🐎', '🦄', '🦓', '🦌', '🐮', '🐂', '🐃', '🐄', '🐷', '🐖', '🐗', '🐽'],
                food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔'],
                activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷'],
                objects: ['💡', '🔦', '🏮', '🪔', '📔', '📕', '📖', '📗', '📘', '📙', '📚', '📓', '📒', '📃', '📜', '📄', '📰', '🗞', '📑', '🔖', '🏷', '💰', '🪙', '💴', '💵', '💶', '💷', '💸', '💳', '🧾'],
                symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐'],
                flags: ['🏳️', '🏴', '🏁', '🚩', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇦🇫', '🇦🇽', '🇦🇱', '🇩🇿', '🇦🇸', '🇦🇩', '🇦🇼', '🇦🇺', '🇦🇹', '🇦🇿', '🇧🇸', '🇧🇭', '🇧🇩', '🇧🇧', '🇧🇾', '🇧🇪', '🇧🇿', '🇧🇯', '🇧🇲', '🇧🇹', '🇧🇴', '🇧🇦', '🇧🇼']
            };
            
            emojiGrid.innerHTML = '';
            
            if (emojis[category]) {
                emojis[category].forEach(emoji => {
                    const emojiElement = document.createElement('div');
                    emojiElement.className = 'emoji';
                    emojiElement.textContent = emoji;
                    emojiElement.addEventListener('click', () => {
                        messageInput.value += emoji;
                        messageInput.focus();
                    });
                    emojiGrid.appendChild(emojiElement);
                });
            }
        }

        // File attachment functions
        function handleFileAttachment() {
            // Create a file input element
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '*/*'; // Accept all file types
            
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    fileToSend = file;
                    showFilePreview(file);
                }
            });
            
            fileInput.click();
        }

        function showFilePreview(file) {
            fileName.textContent = file.name;
            fileSize.textContent = formatFileSize(file.size);
            filePreview.classList.add('active');
        }

        function removeAttachedFile() {
            fileToSend = null;
            filePreview.classList.remove('active');
        }

        function formatFileSize(bytes) {
            if (bytes < 1024) return bytes + ' bytes';
            else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
            else return (bytes / 1048576).toFixed(1) + ' MB';
        }

        // Search function
        function filterChats() {
            const searchTerm = searchInput.value.toLowerCase();
            const chatItems = document.querySelectorAll('.chat-item');
            
            chatItems.forEach(item => {
                const chatName = item.querySelector('.chat-name').textContent.toLowerCase();
                if (chatName.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        // Load saved theme preference
        function loadThemePreference() {
            const savedTheme = localStorage.getItem('darkMode');
            if (savedTheme === 'true') {
                isDarkMode = true;
                document.body.classList.add('dark-mode');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
        }

        // Initialize the app when the DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            loadThemePreference();
            init();
        });
    
