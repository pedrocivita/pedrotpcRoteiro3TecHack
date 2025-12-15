
# TecHack Privacy Extension

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![WebExtensions](https://img.shields.io/badge/WebExtensions-FF6611?style=flat&logo=firefox&logoColor=white)](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
[![Chrome](https://img.shields.io/badge/Chrome-4285F4?style=flat&logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/)
[![Firefox](https://img.shields.io/badge/Firefox-FF7139?style=flat&logo=firefox&logoColor=white)](https://addons.mozilla.org/)

A comprehensive browser extension designed to detect and report privacy violations during web browsing. This tool provides real-time insights into tracking techniques, data collection practices, and potential security threats on websites.

## About

This project was developed as part of the **Hacker Technologies** course (Roteiro 3) at **Insper - Institute of Education and Research**, São Paulo, Brazil, for the Computer Engineering program. The extension demonstrates practical applications of web security concepts and privacy-preserving technologies.

## Features

### Privacy Detection Capabilities

**Third-Party Domain Connections**
- Real-time detection of external domains contacted during page load
- Comprehensive tracking of third-party resources and services
- Detailed domain listing in the extension popup

**Browser Hijacking Detection**
- Monitors suspicious script injections and DOM modifications
- Identifies potential malicious code execution attempts
- Alerts users to security threats in real-time

**HTML5 Storage Analysis**
- Detects usage of multiple storage mechanisms:
  - `localStorage`
  - `sessionStorage`
  - `IndexedDB`
  - `Web SQL Database`
- Displays stored data entries for user inspection

**Cookie & Supercookie Analysis**
- Differentiates between first-party and third-party cookies
- Identifies session vs. persistent cookies
- Detects ETag-based supercookies for persistent tracking
- Comprehensive cookie enumeration and classification

**Fingerprinting Detection**
- Canvas Fingerprinting monitoring
- WebGL Fingerprinting detection
- AudioContext API tracking
- Alerts users when fingerprinting techniques are employed

**Cookie Synchronization Detection**
- Identifies cross-domain cookie value synchronization
- Detects potential cross-site tracking mechanisms
- Monitors cookie sharing between first and third-party domains

**Privacy Score Calculation**
- Quantitative privacy rating (0-100) for each website
- Visual representation of privacy metrics
- Transparent scoring methodology with detailed explanations

## Installation

### Firefox

1. Clone or download this repository:
   ```bash
   git clone https://github.com/pedrocivita/pedrotpcRoteiro3TecHack.git
   ```

2. Open Firefox and navigate to:
   ```
   about:debugging#/runtime/this-firefox
   ```

3. Click **"Load Temporary Add-on"**

4. Select the `manifest.json` file from the extension directory

### Chrome/Chromium

1. Clone or download this repository

2. Open Chrome and navigate to:
   ```
   chrome://extensions/
   ```

3. Enable **"Developer mode"** (toggle in top-right corner)

4. Click **"Load unpacked"**

5. Select the extension directory

## Usage

1. **Navigate to any website** you want to analyze

2. **Click the extension icon** in your browser toolbar

3. **View the Privacy Report** displaying:
   - Overall Privacy Score
   - Third-party domain connections
   - Cookie details and classifications
   - Storage mechanism usage
   - Fingerprinting technique detection
   - Browser hijacking attempts
   - Cookie synchronization activity

4. **Refresh analysis** by clicking "Reiniciar e Verificar Novamente"

5. **View methodology** details by clicking "Ver metodologia"

## Privacy Score Methodology

The privacy score is calculated using the following penalty system (starting from 100 points):

| Detection Type | Penalty | Maximum Penalty |
|----------------|---------|-----------------|
| Third-party cookies | -1 per cookie | -30 points |
| Third-party connections | -2 per domain | -20 points |
| localStorage usage | -10 points | -10 points |
| sessionStorage usage | -10 points | -10 points |
| IndexedDB usage | -10 points | -10 points |
| Web SQL usage | -10 points | -10 points |
| Canvas Fingerprinting | -20 points | -20 points |
| WebGL Fingerprinting | -20 points | -20 points |
| AudioContext Fingerprinting | -20 points | -20 points |
| Browser Hijacking detected | -20 points | -20 points |
| Supercookies (ETag) | -10 points | -10 points |
| Cookie Synchronization | -15 points | -15 points |

**Score Range:** 0-100 (higher scores indicate better privacy practices)

## Technical Architecture

### Project Structure

```
.
├── manifest.json          # Extension configuration and permissions
├── background.js          # Background script for cookie/network monitoring
├── content_script.js      # Injected script for page-level detection
├── popup.html            # Extension popup UI structure
├── popup.js              # Popup logic and privacy score calculation
├── popup.css             # Popup styling
└── icons/                # Extension icons and UI assets
```

### Core Components

**background.js**
- Cookie detection and classification
- Network request monitoring for third-party connections
- Supercookie (ETag) detection
- Cookie synchronization analysis
- Message passing with content scripts

**content_script.js**
- HTML5 storage mechanism detection
- Fingerprinting API monitoring (Canvas, WebGL, AudioContext)
- DOM mutation observation for hijacking detection
- Real-time privacy threat alerts

**popup.js**
- Privacy score calculation engine
- UI state management
- Data aggregation from background and content scripts
- User interaction handling

## Technologies Used

- **JavaScript** - Core programming language
- **HTML5** - Popup interface structure
- **CSS3** - Styling and visual presentation
- **WebExtensions API** - Cross-browser extension framework
- **Chrome Extensions API** - Chrome-specific functionality
- **Firefox Add-ons API** - Firefox-specific functionality

## Academic Context

**Course:** Hacker Technologies (Tecnologias Hacker)  
**Assignment:** Roteiro 3 - Privacy Extension  
**Institution:** Insper - Institute of Education and Research  
**Program:** Computer Engineering (Engenharia de Computação)  
**Location:** São Paulo, Brazil

### Assignment Requirements Met

This extension fulfills all requirements specified in Roteiro 3:

- Third-party domain connections (2.5 points)
- Browser hijacking threat detection (1 point)
- HTML5 storage detection (2.5 points)
- Cookie and supercookie counting (1 point)
- Canvas fingerprinting detection (1 point)
- Cookie synchronization detection (implemented)
- Privacy score calculation (2 points)

## References

### Technical Documentation
- [Mozilla WebExtensions API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
- [Web Privacy Measurement](https://webtransparency.cs.princeton.edu/)

### Research & Resources
- [Fingerprinting Techniques](https://fingerprintable.org)
- [Mozilla Privacy Blog](https://blog.mozilla.org/privacy/)
- [Electronic Frontier Foundation - Privacy Badger](https://privacybadger.org/)
- [StoragErazor Extension](https://github.com/Miraculix200/StoragErazor)

## Contact

**Pedro Civita**

- Email: pedrocivita@gmail.com
- LinkedIn: [linkedin.com/in/pedrocivita](https://www.linkedin.com/in/pedrocivita/)
- GitHub: [@pedrocivita](https://github.com/pedrocivita)

## License

This project was developed for educational purposes as part of academic coursework at Insper. Feel free to use and modify the code for learning and non-commercial purposes.

---

**Note:** This extension is designed for educational and research purposes to demonstrate privacy detection techniques. Users should be aware of privacy implications when browsing the web and take appropriate measures to protect their data.
