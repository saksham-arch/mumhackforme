# FlowGuide Personal Requirements Document

## 1. Application Overview

### 1.1 Application Name
FlowGuide Personal

### 1.2 Application Description
An AI-powered Personal Financial Memory Assistant with a clean, minimal, Scandinavian-style SaaS dashboard. The platform combines ultra-minimal UI design with comprehensive financial management, personal financial history tracking, AI assistant chat experience, multimodal risk mitigation features, intelligent automation, and predictive analytics. Now supports multi-member household financial management with individual income/expense tracking and consolidated predictions.

## 2. Core Features
\n### 2.1 Navigation Structure
**Left Sidebar (Icon-only vertical navigation)**
- Dashboard
- My Money
- Bills
- Goals
- Members (NEW)
- Advice History
- Safety Logs
- Settings

**Top Bar**
- Search bar with placeholder: 'Find anything…'
- Date range selector
- Profile icon
\n### 2.2 Main Dashboard Components

**Hero Insight Block**
- Key financial metric display (e.g., Today's Balance)\n- Minimal bar chart visualization
- Profit/Loss dropdown selector
- Large bold numbers for primary metrics

**Connect Account Section**
- Empty state card with headline: 'Connect your bank account'
- Black primary button
- Brief description text

**AI Assistant Section**
- Soft grey background block
- Suggestion chips (rounded, minimal style)
- Text input box with placeholder: 'Ask something about your money…'

**Money Timeline (WhatsApp-style chat format)**
- Display items: incomes, expenses, AI advice, voice call summaries, SMS summaries, risk warnings
- Chat bubble format with timestamps
\n**Spending Breakdown**\n- Horizontal bar chart with pastel monochrome bars
- Thin labels and minimal legend
\n**Invoices/Bills Section**
- Empty state placeholders
- '+ Add Bill' button
\n### 2.3 Financial Features

**My Money**
- Full income/expense logs list
- Today's balance display
- Weekly/monthly trend graphs
- Receipt upload functionality with AI extraction

**Bills**
- Upcoming bills list
- Paid bills history
- Thin list rows in monochrome style
- Due date alerts integration

**Goals**\n- Goal list with thin progress bars
- Add goal functionality
- Progress tracking alerts

**Advice History**
- Categorized AI advice (savings, emergency, planning)\n- Each card shows date and short answer summary
\n**Voice & SMS History**
- AI voice call transcripts
- SMS summaries\n- Minimal bubble display format

**Safety Logs**
- High-risk interaction records
- Fallback trigger logs
- ASR failure records
- Inconsistency resolution logs
- Simple phrasing for each entry

### 2.4 Multimodal AI Features

**Risk Indicators**
- Risk Score Badge (tiny grey indicator)
- 'Corrected by AI' labels
- Pipeline health banner
- Micro warnings in timeline (e.g., 'Low ASR confidence — we asked for a repetition')

**Admin Dashboard Elements**
- Risk scoring logs
- Model fallback logs
- Consistency checker logs
- Carrier delay reports

### 2.5 AI Auto-Categorization + Receipt Scanner

**Receipt Upload**
- Image upload interface for bills/receipts
- AI extraction of:\n  - Amount
  - Merchant
  - Date
  - Category
  - Tax/GST split
- Automatic entry creation in expense logs
- Manual correction option for extracted data

### 2.6 Smart Spend Forecast (AI Predictive Model)

**Predictive Analytics**
- Analysis of spending patterns
- Next month's expense predictions
- Upcoming cash shortage warnings
- Overspending risk alerts
- Recommended safe-to-spend amount calculation
- Display in dedicated forecast card on dashboard
- **NEW: Multi-member consolidated predictions**
- **NEW: Individual member spending forecasts**
- **NEW: Investment growth predictions per member**

### 2.7 AI Budget Generator

**Budget Creation Wizard**
- User input fields:\n  - Age
  - Income\n  - Responsibilities
  - Fixed expenses
  - Lifestyle preferences
- AI-generated outputs:\n  - Ideal budget percentages by category
  - Personalized savings plan
  - Emergency fund calculation
  - Investment split suggestions
- One-click budget application

### 2.8 Personalized Emergency Alerts

**Real-time Alert System**
- Cash flow warnings: 'You are likely to run out of money by22nd of this month.'
- Bill reminders: 'Your electricity bill is due in 2 days.'
- Goal progress alerts: 'Your goal progress is falling behind.'
- Alert display:\n  - Top banner notifications
  - Timeline entries
  - Push notification support
\n### 2.9 Auto-Summarization of Monthly Finances

**Monthly AI Report**
- Generated automatically at month-end
- Report contents:
  - Total spent
  - Biggest spending category
  - Good financial habits identified
  - Bad financial habits identified
  - Personalized improvement suggestions
- Spotify Wrapped-style presentation
- Accessible from dashboard and advice history

### 2.10 Family Members Management (NEW)

**Add Member Functionality**
- '+ Add Member' button in Members section
- Member profile creation:\n  - Name
  - Relationship (spouse, child, parent, etc.)
  - Income source (optional)
  - Contribution type (earner/dependent)
\n**Member Financial Tracking**
- Individual income logs per member
- Individual expense tracking per member
- Investment portfolio per member
- Separate money timeline for each member

**Consolidated Household View**
- Total household income display
- Combined expense breakdown
- Household-level spending forecast
- Consolidated investment predictions
- Member contribution comparison chart

**Member-Specific Predictions**
- Individual spending forecasts
- Personal investment growth projections
- Member-level budget recommendations
- Individual savings goal tracking

## 3. Screen List

### 3.1 Landing Page
- Hero headline
- Sub-headline about AI financial assistant
- Dashboard preview mockup
- Black rectangular CTA buttons (4px radius)

### 3.2 Login Screen
- OTP-based login form
- Federated login buttons (Google, Apple, GitHub)
- Minimal form design
\n### 3.3 OTP Verification Screen
- 6 input boxes for OTP entry
- Clean spacing with soft borders
\n### 3.4 Profile Setup Screen
- Headline: 'Update your account'
- Input fields: name, language preference, primary income type
- Minimal Save button
\n### 3.5 Main Dashboard
- Hero metrics section
- Timeline display
- Assistant interaction box
- Spending breakdown visualization
- Emergency alerts banner
- Spend forecast card

### 3.6 Insight Modal
- AI-generated insights popup
- Thin border styling
- One primary CTA button
\n### 3.7 Connect Bank Account\n- Clean empty-state card
- Single CTA button
\n### 3.8 Receipt Upload Screen
- Image upload area
- Camera capture option
- AI extraction results display
- Edit and confirm interface

### 3.9 Budget Generator Screen
- Multi-step form for user inputs
- AI-generated budget display
- Category breakdown visualization
- Apply budget CTA

### 3.10 Monthly Report Screen
- Full-screen report presentation
- Visual spending breakdown
- Habits summary cards
- Suggestions list
- Share and download options

### 3.11 Forecast Dashboard
- Predicted expenses chart
- Cash flow timeline
- Risk indicators
- Safe-to-spend amount display
\n### 3.12 Members Management Screen (NEW)
- Member list with profile cards
- '+ Add Member' button
- Individual member financial summary cards
- Quick access to member-specific timelines

### 3.13 Add Member Screen (NEW)
- Member profile form
- Income source input
- Contribution type selector
- Save button

### 3.14 Member Detail Screen (NEW)
- Individual member dashboard
- Personal income/expense timeline
- Investment portfolio display
- Member-specific predictions
- Edit member profile option

### 3.15 Household Overview Screen (NEW)
- Consolidated financial metrics
- Member contribution breakdown
- Household spending forecast
- Combined investment predictions
- Member comparison charts

## 4. Design Style\n
### 4.1 Overall Aesthetic
- Ultra clean Scandinavian minimalism with lots of white space
- Light theme only\n- **Kanban-style card layout inspired by image.png**
- **Column-based organization for status tracking**
\n### 4.2 Color Palette
- Grayscale scheme: #FFFFFF, #F8F8F8, #EDEDED, #CFCFCF, #999999, #000000
- Thin borders: #E6E6E6\n- Hover states: 3% darker grey
- **Accent color for active cards: subtle dark overlay (#1A1A1A with 90% opacity)**

### 4.3 Typography
- Modern geometric font: Inter or SF Pro
- **Card titles:16px medium weight**
- **Metadata text: 12px regular weight**
- **Section headers: 14px medium weight**

### 4.4 Visual Details
- Rounded corners: 4px for buttons, 8px for cards, **12px for member profile cards**
- Ultra-soft shadows (1–2% opacity, almost invisible)
- Very soft fade/slide animations
- Thin outline-style icons
- **Card hover effect: subtle lift with 4px shadow**

### 4.5 Component Specifications
- **Cards: white background, thin outline, 16px padding, 8–12px border radius**
- **Kanban columns: light grey background (#F8F8F8), 16px gap between cards**
- **Status badges: small rounded pills with grey background**
- Buttons: black background, white text, 4px border radius
- Charts: low contrast, monochrome bars
- Input fields: thin borders (#E6E6E6), tall spacing
- Shadows: ultra-soft (1–2% opacity)
- Alert banners: minimal design with subtle grey background
- **Member cards: profile image (40px circle), name, role label, financial summary**

### 4.6 Layout Structure (Inspired by image.png)
- **Left sidebar: 240px fixed width, icon + label navigation**
- **Main content area: flexible width with 24px padding**
- **Top metrics bar: horizontal layout with key numbers and circular progress indicators**
- **Kanban board: 4-column layout (Contacted, Negotiation, Offer Sent, Deal Closed)**
- **Card grid: 280px card width, 16px gap, auto-flow layout**
- **Member list: 2-column grid on desktop, single column on mobile**
\n### 4.7 Tone & Feel
- Professional, precise, and calm
- Premium fintech aesthetic
- Midday-inspired vibe
- World-class SaaS platform feel
- No colorful or cluttered elements
- **Organized and scannable like a CRM dashboard**

## 5. Reference Image
- UI layout and card design inspired by image.png
- Kanban-style column organization
- Minimal card styling with metadata badges
- Clean typography hierarchy