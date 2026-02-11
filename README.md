# Pi-Pie — Math Week Story Website

A professional one-page website for Math Week with animated storytelling.
The main goal of this site was to get a 5 from my math teacher because he gave me a not-so-good grade last term (

## 🎯 Project Goal

Create an academically serious presentation that:

* Shows the student’s motivation and discipline
* Presents achievements and plans for studying abroad
* Expresses willingness to complete extra assignments to improve grades
* Addresses the math teacher respectfully

## 🚀 How to run the project

### Simple way (double-click)

Open `index.html` in any modern browser.

### Local server (recommended)

```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if installed)
npx serve

# Then open: http://localhost:8000
```

## 📁 Project structure

```
Pi-Pie_for_math/
├── index.html      # Main HTML structure
├── styles.css      # Styles and animations
├── script.js       # JavaScript functionality
└── README.md       # Documentation
```

## ✨ Key features

### 1. **Pie → π animation**

* Smooth 5-second animation on page load
* Pie visually transforms into the π symbol
* Automatically disables if `prefers-reduced-motion` is set

### 2. **Scroll animations**

* Sections smoothly appear on scroll
* Achievement cards appear in a staggered sequence
* Uses `IntersectionObserver` for performance

### 3. **Modal form**

* "Suggest an assignment" button
* Form with validation
* Fields: Name, Email, Assignment description, Deadline
* Closes by clicking outside the modal or pressing ESC

### 4. **Respect for accessibility**

* Semantic HTML5
* ARIA attributes
* Support for `prefers-reduced-motion`
* Keyboard navigation

### 5. **Responsive design**

* Mobile-first approach
* Adaptation for tablets and phones
* Flexible typography (clamp)

## 🎨 Design system

### Color palette

* **Background:** `#FFF8F0` (cream)
* **Text:** `#14213D` (dark blue)
* **Accent:** `#2B3A67` (for headings and π)
* **CTA:** `#FF6B6B` (buttons)
* **Auxiliary:** `#6B7280` (muted text)
* **Cards:** `#FFFFFF` (white)

### Typography

* **UI:** Inter (400, 500, 600, 700)
* **Accents:** Merriweather (700)
  Google Fonts load automatically

### Shadows and radii

* Border radius: `12px`
* Shadow: `0 6px 18px rgba(20,33,61,0.08)`

## 🔧 Form setup

### Send to email

In `script.js` (around line ~170) find:

```javascript
const mailtoLink = `mailto:teacher@example.com?subject=${subject}&body=${body}`;
```

Replace `teacher@example.com` with the real email of the teacher.

### Server-side handling

For full form submission, integrate:

* **Formspree:** [https://formspree.io/](https://formspree.io/)
* **EmailJS:** [https://www.emailjs.com/](https://www.emailjs.com/)
* Your own backend (Node.js, PHP, Python)

## 📱 Browser support

* ✅ Chrome 90+
* ✅ Firefox 88+
* ✅ Safari 14+
* ✅ Edge 90+
* ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🛠️ Technologies

* HTML5 (Semantic)
* CSS3 (Custom Properties, Grid, Flexbox)
* Vanilla JavaScript (ES6+)
* IntersectionObserver API
* SVG animations
* Google Fonts

## 📝 Content customization

### Edit texts

Open `index.html` and edit the section contents:

* Hero (lines 18–30)
* Teacher (lines 34–43)
* Achievements (lines 47–79)
* Current Situation (lines 83–94)
* Readiness (lines 98–111)

### Edit achievements

In the `#achievements` section (lines 52–77):

```html
<div class="achievement-card reveal-card" style="--delay: 0">
    <div class="achievement-icon">🥈</div>
    <h3 class="achievement-title">Silver Medal</h3>
    <p class="achievement-desc">Stanford International Logic Olympiad 2025</p>
</div>
```

### Change colors

In `styles.css` (lines 2–11) change the CSS variables:

```css
:root {
  --bg: #FFF8F0;      /* background */
  --text: #14213D;    /* main text */
  --accent: #2B3A67;  /* headings */
  --cta: #FF6B6B;     /* buttons */
}
```

## 🎓 Usage recommendations

1. **Before showing the teacher:**

   * Check all texts for spelling
   * Make sure the email in the form is correct
   * Test on a mobile device

2. **Demonstration:**

   * Open the site in advance (to preload fonts)
   * Show it on a large screen or projector
   * Scroll smoothly to reveal the animations

3. **For Math Week:**

   * Place a QR code at your booth
   * Publish on GitHub Pages (free hosting)
   * Share the link in school chats

## 🌐 Publishing online

### GitHub Pages (free)

```bash
# 1. Create a repository on GitHub
# 2. Upload files
git init
git add .
git commit -m "Initial commit: Pi-Pie website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pi-pie.git
git push -u origin main

# 3. In repo settings → Pages → Source: main branch
# Your site will be available at:
# https://YOUR_USERNAME.github.io/pi-pie/
```

### Netlify Drop (easiest)

1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag-and-drop the project folder
3. Get an instant link

## 📞 Support

If you need help with setup or customization — reach out!

---

**Good luck at Math Week! 🎓📐**
