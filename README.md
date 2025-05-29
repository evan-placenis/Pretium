# Pretium - Engineering Report Automation App

Pretium is a full-stack web application designed to automate engineering report writing workflows using AI. The application allows engineering firms to streamline their report creation process, from bullet-point notes to finalized reports, with AI assistance.

## Features

- **Authentication System**: Secure user accounts with email/password login
- **Building & Report Management**: Organize reports by buildings/locations
- **AI Report Generation**: Convert bullet-point notes into detailed professional reports
- **Interactive Chat Interface**: Refine and modify reports through AI chat
- **Custom Style Training**: Train AI on company-specific report styles
- **Word Document Support**: Import and export Word documents

## Technology Stack

- **Frontend**: React, Next.js, Custom CSS
- **Backend**: Next.js API Routes
- **Database & Auth**: Supabase
- **AI Integration**: OpenAI GPT API
- **Document Processing**: Mammoth.js (for Word file extraction), Docx (for Word file generation)

## Setup Instructions

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- Supabase account
- OpenAI API key

### Environment Variables

Create a `.env.local` file in the project root with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key (optional)
OPENAI_API_KEY=your_openai_api_key
```

### Database Setup

Create the following tables in your Supabase database:

1. **buildings**

   - id (uuid, primary key)
   - name (text)
   - location (text)
   - date (date)
   - user_id (uuid, foreign key to auth.users)
   - created_at (timestamp with time zone)

2. **reports**

   - id (uuid, primary key)
   - building_id (uuid, foreign key to buildings)
   - bullet_points (text)
   - generated_content (text)
   - created_at (timestamp with time zone)
   - updated_at (timestamp with time zone)

3. **chat_messages**

   - id (uuid, primary key)
   - report_id (uuid, foreign key to reports)
   - content (text)
   - role (text, 'user' or 'assistant')
   - created_at (timestamp with time zone)

4. **training_documents**
   - id (uuid, primary key)
   - filename (text)
   - content (text)
   - created_at (timestamp with time zone)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage Flow

1. **Sign Up/Login**: Create an account or sign in
2. **Create a Building**: Add a new building with location and date
3. **Create a Report**: Enter bullet-point observations about the building
4. **Generate Report**: AI converts bullet points into a detailed report
5. **Chat & Refine**: Use the chat interface to make adjustments
6. **Export to Word**: Download the finalized report as a Word document

## Additional Configuration

### OpenAI Models

The application uses GPT-4 by default. For lower costs, you can modify the model in the API routes:

- `src/app/api/generate-report/route.ts`
- `src/app/api/chat/route.ts`

### Custom Styling

The application uses a custom CSS system with variables for consistent styling. Modify the globals.css file to adjust colors, spacing, and other design elements to match your brand style.
