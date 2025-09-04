# SensAI Commerce

*Your Intelligent Multi-Channel Selling Assistant*

This repository contains the full source code for the **SensAI Commerce** project, built for the **Sensay Connect Hackathon**.

---

## **Project Overview**

**SensAI Commerce** is an AI-powered multi-channel assistant that helps e-commerce merchants recover abandoned carts, personalize upsells, manage order tracking, and provide instant support. It leverages Sensay's powerful multi-platform automation to create seamless, conversational shopping experiences.

### **Key Folders**

*   `/frontend`: Contains the React/Next.js storefront application.
*   `/backend`: Contains the Node.js + Express API that orchestrates the Sensay integration, AI layer, and database.

---

## **Tech Stack**

| Layer       | Technology                                   |
| ----------- | -------------------------------------------- |
| **Frontend**| Next.js, React, Tailwind CSS                 |
| **Backend** | Node.js, Express                             |
| **AI Layer**| Gemini / OpenAI (via API)                    |
| **Database**| MongoDB / Firebase (placeholder)             |
| **Sensay**  | Topics, Webhooks, WhatsApp, Messenger, etc.  |

---

## **Getting Started**

### **1. Backend**

```bash
cd backend
npm install
npm run dev
```

The backend server will start on `http://localhost:3001`.

### **2. Frontend**

```bash
cd frontend
npm install
npm run dev
```

The frontend development server will start on `http://localhost:3000`.

---

## **Deliverables**

*   **Frontend Repo**: `/frontend`
*   **Backend Repo**: `/backend`
*   **Demo Video**: A 3-minute walkthrough.
*   **Pitch Deck**: See `PITCH_DECK.md`.
*   **Deployment**: Live demo store + WhatsApp sandbox.
