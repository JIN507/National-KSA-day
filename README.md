# لعبة اليوم الوطني السعودي
## Saudi National Day Interactive Game

A comprehensive browser-based interactive game celebrating Saudi Arabia's history and culture for Saudi National Day.

## Features

### 🎮 Three Game Modes

1. **مسابقة وطنية (Quiz Game)**
   - Multiple-choice questions about Saudi history
   - 10 questions covering founding, kings, achievements
   - Timer-based gameplay (30 seconds per question)
   - Score based on correct answers

2. **لعبة المطابقة (Memory Match)**
   - Match Saudi landmarks with their icons
   - 8 pairs of famous Saudi locations
   - Score based on speed and accuracy
   - Time bonus for quick completion

3. **لعبة الالتقاط (Catch Game)**
   - Catch falling Saudi symbols (+10 points each)
   - Avoid bombs (instant game over) and bad symbols (-10 points)
   - No penalty for missing good symbols - fun and educational!
   - Win by reaching 200 points
   - Keyboard (arrow keys) and touch controls

### 🎨 Design Features

- **Welcome Screen**: Personalized player name entry
- **Player Management**: Recent players list and current player display
- **Full Arabic RTL Support**: All UI text in Arabic
- **Saudi Theme**: Green and white color scheme with gold accents
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, modern interface with smooth animations
- **High Score System**: localStorage-based score tracking with player names
- **Smooth Animations**: CSS transitions and keyframe animations

### 🏆 Scoring System

- **Quiz**: 10 points per correct answer
- **Memory**: 20 points per match + time bonus
- **Catch**: 10 points per Saudi symbol, -10 for bad symbols, 200 points to win

### 📱 Controls

- **Desktop**: Mouse clicks and arrow keys
- **Mobile**: Touch controls and swipe gestures
- **Memory Game**: Click/tap to flip cards
- **Catch Game**: Arrow keys or touch left/right sides of screen

## Technical Implementation

- **Pure HTML5/CSS3/JavaScript**: No frameworks required
- **Canvas API**: Used for the catch game
- **localStorage**: High score persistence
- **CSS Grid/Flexbox**: Responsive layouts
- **CSS Animations**: Smooth transitions and effects

## File Structure

```
nagame/
├── index.html          # Main HTML structure
├── style.css           # Styling and animations
├── game.js            # Game logic and controllers
├── assets/            # SVG icons and graphics
│   ├── saudi-flag.svg
│   ├── palm-tree.svg
│   └── masmak-fort.svg
└── README.md          # This file
```

## How to Run

1. Open `index.html` in any modern web browser
2. No server setup required - runs entirely client-side
3. For best experience, use Chrome, Firefox, or Safari

## Educational Content

The game includes authentic Saudi historical information:
- Kingdom founding (1932)
- King Abdulaziz Al Saud
- National Day (September 23)
- Historical landmarks (Masmak Fort, Al-Ula, etc.)
- Cultural symbols and heritage sites

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- Sound effects and background music
- More game modes (Timeline Runner)
- Multiplayer functionality
- Achievement system
- Social sharing features

---

**Created for Saudi National Day 2024**
*Celebrating the rich history and culture of the Kingdom of Saudi Arabia*
