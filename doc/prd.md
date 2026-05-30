BYAPAR AI
AI Growth & Operations System for Bangladeshi SMEs


Product Requirements Document (PRD)
Version 1.0  |  May 2026
Prepared for: CloudCamp Bangladesh Competition

 
1. Executive Summary
Byapar AI is a subscription-based AI automation platform built exclusively for small and medium enterprises (SMEs) in Bangladesh. It replaces the need for a social media manager, customer support agent, review manager, and marketing assistant — at a fraction of the cost.

The platform automates the full digital presence lifecycle of a business: generating and publishing social media content, auto-replying to customer messages on Messenger and WhatsApp, managing Google Business Profile activity, and responding to Google reviews using AI — all from a single simple dashboard.

Attribute	Details
Product Name	Byapar AI
Tagline	AI for your Byapar
Target Market	Bangladeshi SMEs (restaurants, clinics, salons, retail, hotels)
Business Model	Subscription SaaS — ৳500 to ৳5,000/month
MVP Launch Target	Q3 2026
Competition	CloudCamp Bangladesh 2026

2. Problem Statement
2.1 The SME Digital Gap
Most Bangladeshi SMEs have a Google Business listing, a Facebook page, and receive messages from customers — but lack the time, budget, or skills to manage them properly. This results in:

•	Unanswered customer messages on Messenger and WhatsApp, leading to lost sales
•	No response to Google reviews, damaging trust and local SEO ranking
•	Inconsistent or zero social media posting, reducing visibility
•	No branded marketing content due to high agency costs
•	Poor Google Business Profile optimization hurting map discoverability

2.2 Current Alternatives & Why They Fail
Alternative	Problem
Hire a social media manager	Costs ৳15,000–৳30,000/month — unaffordable for SMEs
Generic scheduling tools (Buffer, Hootsuite)	No AI, no Bangla, no local context, expensive in USD
Manual responses	Time-consuming, inconsistent, often ignored
General chatbots	Not trained on business data, poor Bangla support

3. Product Vision & Goals
3.1 Vision Statement
"Byapar AI makes every Bangladeshi business owner feel like they have a full digital team working for them 24/7 — at the cost of a part-time employee."

3.2 Strategic Goals
•	Automate 80% of repetitive digital operations for SME owners
•	Deliver measurable ROI: more reviews, faster response, consistent presence
•	Build the #1 AI business operations platform for Bangladesh
•	Achieve 500 paying SME customers within 12 months of launch

4. Target Users
4.1 Primary User Persona
Field	Details
Name	Rahim Bhai (Typical SME Owner)
Age	30–50 years old
Business Type	Restaurant, Salon, Clinic, Retail Shop, Hotel
Tech Level	Basic smartphone user, uses Facebook daily
Pain Point	Too busy to manage digital presence, can't afford a team
Goal	More customers, better reputation, less manual work
Willingness to Pay	৳500–৳2,000/month for real results

4.2 Business Segments
Segment	Use Case	Priority
Restaurants & Food	Daily specials, menu posts, review replies	High
Clinics & Healthcare	Appointment reminders, FAQ replies, trust building	High
Salons & Beauty	Promotional posts, before/after content, booking replies	High
Retail Shops	Product highlights, offers, stock updates	Medium
Hotels & Hospitality	Room promotions, review management, guest queries	Medium
Real Estate	Property listings, inquiry auto-replies	Low (v2)

5. Features & Requirements
5.1 MVP Features (v1.0)
Feature 1: Facebook Post Generator & Auto-Scheduler
•	AI generates post captions based on business knowledge base (menu, offers, services)
•	Generates accompanying image using Flux/Ideogram API
•	Suggests optimal posting times based on engagement patterns
•	Publishes directly to Facebook Page via Meta Graph API
•	Dashboard shows post history, status, and basic reach

Feature 2: Messenger AI Auto-Reply
•	Connects to Facebook Page inbox via Messenger Platform webhook
•	AI reads incoming message and generates a relevant reply
•	Uses business knowledge base (products, prices, hours, FAQs)
•	Respects Meta's 24-hour messaging window rule
•	Owner can review and override replies from dashboard

Feature 3: Google Review Auto-Reply
•	Fetches new Google reviews via Google Business Profile API
•	AI generates personalized, professional reply for each review
•	Handles positive, neutral, and negative reviews with different tones
•	Posts reply back via API within configurable time window
•	Dashboard shows review history and reply status

Feature 4: Google Business Profile Advisor
•	Analyzes GBP completeness and suggests improvements
•	Recommends missing information (hours, photos, descriptions)
•	Auto-generates GBP posts (updates, offers, events)
•	Tracks profile views and provides weekly summary

Feature 5: Business Dashboard
•	Onboarding wizard to set up business knowledge base
•	View all scheduled and published posts
•	Monitor review replies and Messenger conversations
•	Weekly AI-generated performance summary
•	Simple toggle controls for each automation feature

5.2 Post-MVP Features (v2.0)
Feature	Description	Timeline
WhatsApp Auto-Reply	AI replies via WhatsApp Business API	Q4 2026
Instagram Posts	Extend Facebook posts to Instagram simultaneously	Q4 2026
AI Video Posts	Short promotional video generation (Reels/Stories)	Q1 2027
Analytics Dashboard	Engagement trends, best post times, ROI metrics	Q1 2027
Multi-branch Support	One account managing multiple business locations	Q2 2027
Local SEO Audit	Automated GBP optimization scoring and fixes	Q2 2027

6. Technical Architecture
6.1 Tech Stack
Layer	Technology	Purpose
Frontend	Next.js 14 (App Router)	Business owner dashboard
Backend	FastAPI (Python)	API server, webhook handling
AI Engine	Ollama (local LLMs)	Caption generation, reply drafting
Image Generation	fal.ai — Flux Pro	Marketing image creation
Database	PostgreSQL	Business data, post history, reviews
Cache / Queue	Redis + BullMQ	Scheduled posts, job processing
Facebook / Instagram	Meta Graph API v18+	Post publishing, Messenger
Google Business	GBP API v4.9	Reviews, profile, posts
Hosting (MVP)	Local + ngrok tunnels	Webhook testing and demo
Hosting (Production)	Railway or Render	Scalable cloud deployment

6.2 System Flow
Business Owner sets up knowledge base → AI agent reads business context → Scheduler decides posting cadence → Image API generates visual → Meta Graph API publishes post → Webhooks capture customer messages → AI auto-replies via Messenger API → Google Reviews fetched nightly → AI replies posted back → Dashboard reflects all activity in real time.

6.3 AI Models (Local Ollama)
Model	Task
Llama 3.1 8B	Facebook caption generation, post planning, content strategy
Mistral 7B	Review replies, Messenger responses, short-form copy
Claude API (optional)	Premium tier — higher quality outputs for enterprise clients

7. External Integrations
Integration	API / Service	MVP Priority	Key Challenge
Facebook Posts	Meta Graph API	Must Have	App review approval (1–2 weeks)
Messenger Replies	Messenger Platform API	Must Have	Webhook setup, 24hr rule
Google Reviews	GBP API	Must Have	OAuth2 approval process
GBP Posts & Profile	GBP API v4.9	Must Have	API quota management
Image Generation	fal.ai (Flux Pro)	Must Have	API cost per generation
Instagram Posts	Meta Graph API	Nice to Have	Requires Facebook link
WhatsApp Replies	WhatsApp Business API	Post-MVP	BSP approval complexity

8. Business Model
8.1 Pricing Tiers
Plan	Price/Month	Features	Target
Starter	৳500	Facebook posts (10/mo), Review replies	Small shops, stalls
Growth	৳1,500	Unlimited posts, Messenger replies, GBP advisor	Restaurants, salons
Pro	৳3,000	All features + Instagram + priority support	Clinics, hotels
Business	৳5,000	All features + multi-branch + custom AI training	Chains, agencies

8.2 Unit Economics
•	Cost per customer (infra): ~৳150–৳300/month at scale
•	Gross margin target: 70–80%
•	Target: 500 customers by Month 12 = ৳7.5L–৳15L MRR
•	Image generation cost: ~৳2–৳5 per image (passed into plan limits)

9. Go-To-Market Strategy
9.1 Phase 1 — MVP & Validation (Month 1–3)
•	Onboard 10–20 pilot businesses for free (restaurants in Dhaka)
•	Collect feedback, measure review response rate improvement
•	Demo at CloudCamp Bangladesh for visibility and investor contact

9.2 Phase 2 — Early Growth (Month 4–6)
•	Launch paid plans with ৳0 first month offer
•	Partner with local business associations and chambers of commerce
•	Facebook ads targeting business owners in Dhaka, Chittagong, Sylhet

9.3 Phase 3 — Scale (Month 7–12)
•	Expand to 8 divisions across Bangladesh
•	Build referral/affiliate program with local digital marketers
•	Launch agency tier for digital marketing firms to resell

10. MVP Build Plan
Week	Milestone	Deliverable
Week 1	Business KB + AI Caption Engine	LLM reads business data, generates Facebook captions
Week 2	Image Generation Integration	fal.ai Flux API generates post images, preview in dashboard
Week 3	Facebook Graph API Publisher	Posts published manually to Facebook Page from dashboard
Week 4	Post Scheduler	BullMQ queue auto-publishes posts at scheduled times
Week 5	Messenger Webhook + AI Reply	Incoming Messenger messages auto-replied by AI
Week 6	Google Reviews Auto-Reply	New reviews detected, AI reply posted within 1 hour
Week 7	GBP Advisor + Dashboard Polish	Profile completeness scoring, weekly summary, UI cleanup
Week 8	Demo Prep + CloudCamp	End-to-end demo flow, pitch deck ready, competition entry

11. Success Metrics
11.1 MVP Success Criteria
Metric	Target
Pilot businesses onboarded	10+ before CloudCamp
Review reply rate	95%+ of reviews replied within 1 hour
Messenger response time	Under 60 seconds average
Posts published successfully	Zero failed publishes in demo
Image generation success rate	98%+ images generated correctly
Dashboard uptime	99%+ during competition demo

11.2 Post-Launch KPIs
•	Monthly Recurring Revenue (MRR)
•	Customer churn rate (target: under 5%/month)
•	Average reviews per business per month
•	Messenger response rate vs. baseline
•	Facebook engagement rate on AI-generated posts

12. Risks & Mitigations
Risk	Impact	Mitigation
Meta API approval delay	High	Start app review immediately; use test mode for demo
GBP API access rejection	High	Apply early; use mock data in demo if needed
AI reply quality in Bangla	Medium	Fine-tune prompts; allow owner review before send
Image generation cost overrun	Medium	Set monthly image limits per plan tier
WhatsApp BSP approval	Low (v2)	Excluded from MVP scope entirely
Competitor with similar idea	Medium	Focus on execution quality and local market depth

Appendix: Competitive Positioning
Capability	Byapar AI	Buffer/Hootsuite	Generic Chatbot	Human Agency
Facebook Post AI Generation	✅ Yes	❌ No	❌ No	✅ Yes
Bengali Language Support	✅ Yes	❌ No	Partial	✅ Yes
Google Review Auto-Reply	✅ Yes	❌ No	❌ No	✅ Yes
Messenger AI Reply	✅ Yes	❌ No	✅ Yes	✅ Yes
AI Image Generation	✅ Yes	❌ No	❌ No	✅ Yes
Local SME Focus	✅ Yes	❌ No	❌ No	Varies
Monthly Cost (BDT)	৳500–৳5,000	৳3,000–৳10,000	৳2,000–৳8,000	৳15,000–৳40,000
