# DATA REQUIREMENTS — Owner Discovery Session

**Purpose:** This document is the interview guide for the first structured meeting with the restaurant owner. It organizes questions by data category. The answers will define the Business Intelligence Platform data model.

**Rules:**
- Ask every question in every category.
- Do NOT assume answers.
- Do NOT fill defaults.
- Record answers verbatim.
- Mark unknown items as "TBD".

---

## Business

- What is the legal business name?
- What is the trading name?
- What is the tax ID or business registration number?
- How many years has the business been operating?
- Is this a single location or multiple branches?
- If multiple, how many branches and what are their names?
- What is the business structure (sole proprietorship, partnership, corporation)?

## Branches

- What is the full address of each branch?
- What are the operating hours for each branch? (per day of week)
- Does each branch have its own phone number?
- Does each branch have its own WhatsApp number?
- Who manages each branch?
- How many staff work per shift at each branch?
- Are there any seasonal hours or holiday closures?

## Menu / Products

- What is the complete list of products sold?
- What categories do products belong to?
- What are the exact prices for each product?
- Are there product variations (size, combo, extras)?
- What are the ingredient lists per product?
- What are the allergen labels per product?
- Which products are most popular? (rank by sales volume)
- Which products have the highest and lowest profit margins?
- Are there seasonal or limited-time products?
- How often is the menu updated?
- Who is responsible for menu changes?

## POS System

- What POS system do you use?
- What version of the POS system?
- Who provided or supports the POS system?
- Can the POS export data? In what formats? (CSV, Excel, PDF, API)
- What reports does the POS generate?
- Can the POS report sales by product, by time, by staff member?
- Does the POS track inventory?
- Does the POS integrate with any other systems?
- Can we access POS data in real time or only via scheduled exports?
- What is the process to request a data export?

## Uber Eats

- Do you use Uber Eats?
- What is the Uber Eats store name?
- What is the Uber Eats commission rate?
- How are Uber Eats orders fulfilled? (in-house prep, tablet, POS integration)
- Can Uber Eats order data be exported?
- Do menu prices differ on Uber Eats vs in-store?
- How are Uber Eats promotions managed?
- Who handles Uber Eats customer service?

## Didi Food

- Do you use Didi Food?
- What is the Didi Food store name?
- What is the Didi Food commission rate?
- How are Didi Food orders fulfilled?
- Can Didi Food order data be exported?
- Do menu prices differ on Didi Food vs in-store?

## WhatsApp

- What WhatsApp number is used for orders?
- Is this WhatsApp Business or personal WhatsApp?
- How are orders taken through WhatsApp? (manual chat, broadcast list, catalog, API)
- How many WhatsApp orders per day on average?
- How do you track WhatsApp orders from receipt to fulfillment?
- Do you use WhatsApp for customer support or only orders?
- Would you like WhatsApp orders to be automatically captured?

## Facebook

- Do you have a Facebook business page?
- What is the Facebook page URL?
- How do customers use Facebook to interact with you? (messenger, posts, reviews)
- Who manages the Facebook page?
- How often do you post?
- Do you run Facebook ads? What is the monthly spend?
- Can Facebook insights be shared with us?

## Instagram

- Do you have an Instagram business account?
- What is the Instagram handle?
- How do customers interact via Instagram? (DMs, comments, stories)
- Who manages the Instagram account?
- How often do you post?
- Do you run Instagram ads? What is the monthly spend?
- Do you track engagement metrics?

## Google Maps

- Is the business listed on Google Maps?
- Is the Google Business profile verified?
- What information is shown on Google Maps? (hours, photos, reviews)
- How many reviews do you have and what is the average rating?
- Who responds to Google reviews?
- Do you use Google Posts or Google Ads?

## Customers

- How do you identify returning customers?
- Do you have a customer database or loyalty program?
- Do you capture customer contact information? How?
- What is the average order value?
- What is the average customer visit frequency?
- Do you have repeat customer metrics?
- How do customers usually find you? (walk-in, social media, delivery apps, referral)

## Marketing

- What marketing channels do you currently use?
- What is the monthly marketing budget?
- What promotions have you run in the past?
- Which promotions were most successful? How was success measured?
- Do you run any recurring promotions (happy hour, daily special)?
- How do you communicate promotions to customers?
- Do you have an email list or SMS broadcast list?
- Have you done influencer or partnership marketing?

## Operations

- What are the peak hours and days for each branch?
- How many orders are processed per day?
- What is the average preparation time per order?
- How are orders routed to the kitchen?
- Do you have a order numbering or tracking system?
- How do you handle order errors or customer complaints?
- What is the busiest month of the year?
- What is the slowest month of the year?

## KPIs

- What metrics do you currently track manually?
- What would you consider a "good day" financially?
- What is the target average order value?
- What is the target number of orders per day?
- What is the food cost percentage target?
- What is the labor cost percentage target?
- What metrics would you like to see on a dashboard every morning?
- Are there any regulatory or compliance metrics required?

## Reports

- What reports do you currently receive or generate?
- Who prepares these reports and how often?
- What format are reports in? (paper, PDF, Excel, dashboard)
- What is the most important report for your business?
- What information is missing from current reports?
- Would you like automated reports? At what frequency?
- Who should receive reports? (owner, manager, accountant)
- Do you need historical comparisons (week-over-week, year-over-year)?

## Technology

- Do you have a website? What is the URL?
- Do you use any other software to run the business?
- Is there an existing accounting or bookkeeping system?
- Do you use any scheduling or staffing software?
- Do you have cameras or security systems with analytics?
- What devices do you use to manage the business? (phone, tablet, laptop)

## Current Pain Points

- What is the most time-consuming task in running the business?
- What information do you wish you had but cannot easily get?
- What frustrates you most about your current systems?
- If you could automate one thing, what would it be?
- Have you tried any other dashboard or analytics tools? Why did they not work?
- What would make you excited to open a dashboard every morning?

---

**After the session:**
- Mark every question as answered or "TBD"
- Create data source mappings (POS → export → pipeline)
- Prioritize data categories by implementation feasibility
- Begin service implementations for available data sources
