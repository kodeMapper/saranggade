# 📝 Future Todo List

This file tracks upcoming features and improvements for the portfolio. Some are done already. 

---

## 🔐 Security & Authorization
- [ ] **JWT Authorization:** Protect `/admin` routes with a proper login system. Generate a token on login and verify it on every admin API call.
- [ ] **External Auth services:** We can use external services (ex. mojoauth or logto.io) also
- [ ] **Rate Limiting:** Add rate limiting to prevent abuse of public APIs.

---

## 🎨 New Sections & Features
- [ ] **Certificates Section:** Display certifications from LinkedIn/manual input on the main portfolio page.
- [ ] **Blogs Section:** Fetch and display blog posts (from Medium, Dev.to, or a custom CMS).
- [ ] **Education Section:** Add a dedicated section for educational background.
- [ ] **Awards/Achievements:** A section to showcase hackathon wins, competitions, etc.

---

## ⚙️ Automation Enhancements
- [ ] **LinkedIn Scraper Fix:** Revisit the session cookie logic or find a more reliable API-based approach.
- [ ] **Codolio Card Styling:** Allow choosing different themes for the Codolio stats card screenshot.
- [ ] **Webhook for Review Push:** Send a Discord message when a review is completed/approved.

---

## 💅 UI/UX Polish
- [ ] **Admin Login Page:** Create a proper styled login page instead of direct route access.
- [ ] **Admin Dashboard:** Build a single dashboard page listing all pending updates at once.
- [ ] **Theme Persistence:** Remember user's dark/light mode choice in localStorage.
- [ ] **Navbar Styling** Add minimal border colour to the navbar and socialbar. should not be very attention seeking, keep it minimal. The line at bottom of the navbar should be increase as we scroll down (progess bar).
- [ ] **Lazy loading:** When all the page (main) rendered then only it should be shown on screen, till implement/show the loader.
- [ ] update this new loader - 
import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="terminal-loader">
        <div className="terminal-header">
          <div className="terminal-title">Status</div>
          <div className="terminal-controls">
            <div className="control close" />
            <div className="control minimize" />
            <div className="control maximize" />
          </div>
        </div>
        <div className="text">Loading...</div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  @keyframes blinkCursor {
    50% {
      border-right-color: transparent;
    }
  }

  @keyframes typeAndDelete {
    0%,
    10% {
      width: 0;
    }
    45%,
    55% {
      width: 6.2em;
    } /* adjust width based on content */
    90%,
    100% {
      width: 0;
    }
  }

  .terminal-loader {
    border: 0.1em solid #333;
    background-color: #1a1a1a;
    color: #0f0;
    font-family: "Courier New", Courier, monospace;
    font-size: 1em;
    padding: 1.5em 1em;
    width: 12em;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
  }

  .terminal-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1.5em;
    background-color: #333;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    padding: 0 0.4em;
    box-sizing: border-box;
  }

  .terminal-controls {
    float: right;
  }

  .control {
    display: inline-block;
    width: 0.6em;
    height: 0.6em;
    margin-left: 0.4em;
    border-radius: 50%;
    background-color: #777;
  }

  .control.close {
    background-color: #e33;
  }

  .control.minimize {
    background-color: #ee0;
  }

  .control.maximize {
    background-color: #0b0;
  }

  .terminal-title {
    float: left;
    line-height: 1.5em;
    color: #eee;
  }

  .text {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    border-right: 0.2em solid green; /* Cursor */
    animation:
      typeAndDelete 4s steps(11) infinite,
      blinkCursor 0.5s step-end infinite alternate;
    margin-top: 1.5em;
  }`;

export default Loader;

---

## 🧹 Cleanup
- [ ] **Remove Deprecated Email Code:** Fully remove `emailService.js` and related env vars from documentation.
- [ ] **Audit Dependencies:** Check for unused npm packages in both frontend and backend.

## Light mode styling enhancement
- [ ] light mode does not looks good. The grey colour of text does not good for UX. Style it in more good and professional way.
- [ ] Also, the hero section (landing section) does not look good in light mode. u can switch in light mode and see yourself.

## 🧹 Make sure all the automations are working properly on time

## 🧹 In the very end, Update the content (new updates) of the portfolio in Projects section. Also update the README


