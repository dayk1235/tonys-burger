# TonyBot — Chatbot Architecture Preparation

## Overview

This directory is prepared for the future implementation of **TonyBot**, an AI-powered chatbot assistant for Tony's Burger.

## Future Capabilities

- Answer menu questions (ingredients, allergens, pricing)
- Provide business information (hours, location, contact)
- Make personalized burger recommendations
- Redirect to WhatsApp for order placement
- Handle common FAQs

## Architecture Planning

### Recommended Stack

- **Framework:** Consider using a lightweight AI SDK (e.g., Vercel AI SDK, LangChain)
- **Model:** GPT-4o-mini or Claude Haiku for cost-effective responses
- **Fallback:** Rule-based responses for common questions when AI is unavailable

### Directory Structure (Future)

```
features/chatbot/
├── components/        # Chat UI components
│   ├── ChatWindow.tsx
│   ├── ChatMessage.tsx
│   └── ChatInput.tsx
├── hooks/            # Chat logic hooks
│   └── useChat.ts
├── prompts/          # System prompts and context
│   └── system-prompt.ts
├── services/         # AI API integration
│   └── chat-service.ts
├── types/            # Chat-specific types
│   └── index.ts
└── README.md         # This file
```

### Data Requirements

The chatbot will need access to:

1. **Menu data** — Items, descriptions, prices, ingredients, allergens
2. **Business info** — Hours, address, phone, social links
3. **FAQ content** — Common questions and answers
4. **WhatsApp configuration** — Phone number, message template

## Implementation Notes

- Chatbot implementation is **deferred** to a future task
- This directory serves as a placeholder for the architecture
- Do not implement until explicitly requested
- When implementing, consider:
  - Mobile-first chat UI
  - Typing indicators
  - Message persistence
  - Error handling and fallbacks
  - Rate limiting
  - Cost management for AI API calls

## Related Placeholders

- `PLACEHOLDER_WHATSAPP_NUMBER` in `src/content/placeholders.ts`
- `PLACEHOLDER_WHATSAPP_MESSAGE` in `src/content/placeholders.ts`
