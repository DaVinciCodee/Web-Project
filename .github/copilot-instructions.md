# Copilot Instructions for Spotify Rencontres

## Project Overview
A React + Node.js + MongoDB + Socket.io web application connecting users based on shared Spotify music tastes. The app authenticates users via Spotify OAuth, displays their top artists/genres, and enables real-time messaging between matched users.

### Key Tech Stack
- **Frontend**: React 18, React Router, Axios, Socket.io-client, React Icons
- **Backend**: Express, MongoDB/Mongoose, Socket.io
- **External API**: Spotify API (OAuth, user data, currently playing)

## Architecture Patterns

### 1. Client-Server Communication
The app uses **two separate communication channels**:
- **REST API** (`/api/` routes): Fetch user profiles, update bios, get now-playing tracks
- **Socket.io** (real-time): Instant messaging, user registration, message delivery

Example flow in `client/src/pages/Chat.js`:
```javascript
// REST: Load message history
const response = await axios.post('/api/messages/getmsg', { from, to });

// Socket.io: Real-time message listening
socket.on('msg-recieve', (data) => { /* handle incoming */ });
socket.emit('send-msg', { to, from, msg });
```

### 2. Authentication & User Model
**Spotify OAuth** is the only auth mechanism (`server/routes/auth.js`):
- Users authenticate via `/auth/spotify`, receive OAuth code
- Code exchanged for Spotify `accessToken` and `refreshToken`
- User saved to MongoDB with `spotifyId` as unique identifier
- Token expiration tracked in `User.tokenExpiration` field

User model (`server/models/User.js`) structure:
- `spotifyId` (unique key for Spotify ID like 'thibault_123')
- `accessToken`, `refreshToken`, `tokenExpiration`
- Custom profile: `user_name`, `bio`, `profilePicture`
- Music data: `topGenres`, `topArtists` (enriched from Spotify)

### 3. Spotify Data Integration
**spotifyService.js** handles all Spotify API calls:
- `getUserTasteProfile()`: Fetches top 20 artists, extracts genres
  - **Note**: Contains mock data injection for empty Spotify accounts (Daft Punk & Queen)
- `getNowPlaying()`: Gets currently playing track with album art and preview URL
- Uses Bearer token in Authorization header for all requests

### 4. Real-time Messaging (Socket.io)
Server tracks connected users in `Map<userId, socketId>`:
```javascript
socket.on('register', (userId) => {
  onlineUsers.set(userId, socket.id);
});

socket.on('private message', async ({ content, to, from }) => {
  // 1. Save to MongoDB
  const newMessage = new Message({ sender: from, recipient: to, content });
  await newMessage.save();
  
  // 2. Send to recipient if online
  io.to(onlineUsers.get(to)).emit('private message', newMessage);
});
```

## Project Structure & Key Files

### Backend (`server/`)
- `server.js`: Express + Socket.io setup, CORS, MongoDB connection
- `routes/auth.js`: Spotify OAuth flow (`/auth/spotify`, `/auth/spotify/callback`)
- `routes/users.js`: Profile endpoints (`GET /:spotifyId`, `PUT /:spotifyId`)
- `routes/messages.js`: `POST /api/messages/getmsg` - fetch message history
- `models/User.js`: Spotify user + profile + music taste data
- `models/Message.js`: Message schema with `sender`, `recipient`, `content`, `timestamp`
- `controllers/userController.js`: Business logic for user operations
- `services/spotifyService.js`: External Spotify API integration

### Frontend (`client/src/`)
- `App.js`: Router setup (3-column layout: navbar | main content | right sidebar)
- `pages/Login.js`: OAuth redirect to Spotify
- `pages/Profile.js`: View/edit user profile
- `pages/Chat.js`: Real-time messaging UI with message history
- `components/Chat.js`: Chat message component
- `components/Navbar.js`: Navigation between sections
- `components/NowPlaying.js`: Display currently playing track
- `components/ArtistCard.js`: Display artist info from top artists list
- `services/api.js`: Axios wrappers (fetchUserProfile, updateUserProfile, fetchNowPlaying)

## Critical Workflows

### Running the App
```powershell
# Terminal 1: Start backend (requires .env with MONGODB_URI, SPOTIFY_* credentials)
cd server
npm install  # if needed
node server.js          # listens on port 8000

# Terminal 2: Start frontend (proxies /api requests to :8000)
cd client
npm install  # if needed
npm start                # listens on port 3000, proxy in package.json
```

### Environment Variables (.env in `server/` root)
```
MONGODB_URI=mongodb://...
SPOTIFY_CLIENT_ID=<from Spotify Developer Dashboard>
SPOTIFY_CLIENT_SECRET=<from Spotify Developer Dashboard>
SPOTIFY_REDIRECT_URI=http://localhost:8000/api/auth/spotify/callback
```

### Frontend Proxy Configuration
`client/package.json` includes `"proxy": "http://localhost:8000"` — enables `/api/` calls without full URL in development.

## Project-Specific Conventions

### 1. User Identification
- Frontend uses MongoDB `_id` for internal operations
- API endpoints use `spotifyId` as the public identifier (in URL params)
- Example: `GET /api/users/thibault_123` (spotifyId), not MongoDB ObjectId

### 2. Message Direction Convention
Messages always have `sender` and `recipient` (MongoDB ObjectId references).
History queries use bidirectional matching:
```javascript
{ $or: [
  { sender: from, recipient: to },
  { sender: to, recipient: from }
]}
```

### 3. API Response Formatting
- `fetchUserProfile()` returns full User document
- `fetchNowPlaying()` returns formatted object with `{ isPlaying, artist, title, albumImage, previewUrl }`
- Error handling uses `.catch()` in client, logs to console, often returns `null`

### 4. Socket.io Event Naming
Uses kebab-case: `register`, `private message`, `msg-recieve`, `send-msg`, `add-user`
Payload structure varies—check `server.js` and `Chat.js` for exact shapes.

### 5. Component Structure (React)
- Functional components with hooks (useState, useEffect, useRef)
- CSS files follow component name (e.g., `Chat.js` + `Chat.css`)
- Uses react-icons for UI icons
- No global state management (Context/Redux) — props & local state only

## Important Notes

### Known Issues / In-Progress Features
- Feature branch: `feature/messagerie-backend` — messaging system being refined
- Spotify token refresh logic appears incomplete; only initial access token stored
- Socket.io event naming inconsistency between frontend (e.g., `msg-recieve`) and expected backend
- Message model has optional `conversationId` field (designed but not actively used)

### Data Flow Example: User Messaging
1. User logs in → Spotify OAuth → User saved with `spotifyId` + tokens
2. User navigates to `/messages` → Chat.js initializes Socket.io connection, emits `register` with MongoDB `_id`
3. User selects another user to message → Chat history fetched via REST (`/api/messages/getmsg`)
4. User types and sends → Socket.io `send-msg` event → Server saves to MongoDB + broadcasts to recipient socket
5. If recipient online, they receive via `msg-recieve` listener in real-time

## Debugging Tips
- Check `.env` file exists in `server/` root with all required variables
- Backend logs user registration/disconnection to console; watch for Socket.io connection issues
- Frontend API errors logged to console—check Network tab for failed requests
- Spotify API errors often due to expired token; refresh logic not yet implemented
- Message queries return empty array if no conversation exists (not an error)

## Testing the Messaging Feature
1. Open two browser windows (or incognito), log both in via Spotify
2. In first window, fetch the second user's data to get their MongoDB `_id`
3. In Chat.js, pass `currentChat` object with `_id` property
4. Send message—should persist in MongoDB and appear real-time if recipient online
