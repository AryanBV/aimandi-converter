# AIMandi - AI-Powered File Converter

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.3.3-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-Backend-green?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License" />
</div>

<div align="center">
  <h3>🚀 Transform your files with AI-powered conversion technology</h3>
  <p>Fast, secure, and reliable file conversions at your fingertips</p>
</div>

---

## Overview

AIMandi is a comprehensive **AI-powered file conversion web application** that allows users to upload various file types, convert them between different formats using intelligent processing algorithms, and manage their conversion history with full authentication and user management.

Perfect for content creators, business users, developers, and anyone needing reliable file format conversions with a modern, intuitive interface.

## ✨ Features

### 🔄 Core Conversion Features
- **Multi-format Support**: Documents (PDF, DOCX, TXT, RTF, HTML), Images (JPG, PNG, WebP), Excel (XLSX, XLS)
- **Drag-and-Drop Interface**: Intuitive file upload with visual feedback
- **Real-time Progress**: Live conversion status and progress monitoring
- **Batch Processing**: Convert multiple files simultaneously
- **Smart Format Detection**: Automatic source format recognition

### 👤 User Management
- **Google OAuth Integration**: Secure authentication with Google accounts
- **Personal Dashboard**: User-specific conversion history and statistics
- **Profile Management**: Customizable user profiles with conversion metrics
- **Protected Routes**: Secure access to user-specific features

### 💾 Data & Storage
- **Supabase Backend**: Robust PostgreSQL database with real-time features
- **File Storage**: Secure file management with signed URLs
- **Conversion History**: Track and manage all past conversions
- **Statistics Tracking**: Monitor usage patterns and preferences

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Theme**: Modern dark UI with gradient accents
- **Animated Interface**: Smooth animations and micro-interactions
- **Accessibility**: WCAG compliant with proper contrast and navigation

## 🛠️ Technology Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library

### Backend & Database
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service with PostgreSQL
- **[Supabase Auth](https://supabase.com/auth)** - Authentication management
- **[Supabase Storage](https://supabase.com/storage)** - File storage with CDN
- **Row Level Security (RLS)** - Database-level security policies

### File Processing Libraries
- **[Mammoth.js](https://github.com/mwilliamson/mammoth.js)** - DOCX to HTML/text conversion
- **[PDF-lib](https://pdf-lib.js.org/)** - PDF manipulation and creation
- **[jsPDF](https://github.com/parallax/jsPDF)** - Client-side PDF generation
- **[SheetJS](https://sheetjs.com/)** - Excel file processing
- **[Sharp](https://sharp.pixelplumbing.com/)** - High-performance image processing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm**, **yarn**, or **pnpm** package manager
- **Git** for version control
- A **Supabase** account and project
- A **Google Cloud Console** project for OAuth

## ⚡ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/aimandi-converter.git
   cd aimandi-converter
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase and Google OAuth credentials
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Installation

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/aimandi-converter.git
cd aimandi-converter

# Install dependencies
npm install
```

### 2. Database Setup

Create the required database tables in your Supabase project:

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversion history table
CREATE TABLE conversion_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  original_filename TEXT NOT NULL,
  converted_filename TEXT NOT NULL,
  original_format TEXT NOT NULL,
  target_format TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  conversion_status TEXT CHECK (conversion_status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  download_url TEXT,
  storage_path TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  downloaded_at TIMESTAMP WITH TIME ZONE
);

-- User statistics table
CREATE TABLE user_statistics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE UNIQUE NOT NULL,
  total_conversions INTEGER DEFAULT 0,
  total_files_converted INTEGER DEFAULT 0,
  favorite_output_format TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_statistics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own conversions" ON conversion_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conversions" ON conversion_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own statistics" ON user_statistics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own statistics" ON user_statistics FOR UPDATE USING (auth.uid() = user_id);
```

### 3. Storage Setup

Create a storage bucket in Supabase:

```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('converted-files', 'converted-files', false);

-- Storage policies
CREATE POLICY "Users can upload own files" ON storage.objects FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view own files" ON storage.objects FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own files" ON storage.objects FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);
```

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google OAuth (Optional - for authentication)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)

### Supabase Configuration

1. Create a new Supabase project
2. Go to Authentication > Providers
3. Enable Google provider
4. Add your Google OAuth credentials
5. Set redirect URL: `https://your-project.supabase.co/auth/v1/callback`

## 🚀 Usage

### Basic File Conversion

1. **Upload Files**: Drag and drop files or click to select
2. **Choose Format**: Select your desired output format
3. **Add to Queue**: Click "Add to Queue" to prepare for conversion
4. **Start Conversion**: Click "Start All" to begin processing
5. **Download**: Access converted files from the Recent Conversions tab

### Authentication

- Click "Sign In with Google" in the header
- Authorize the application
- Access personalized features and conversion history

### Managing Conversions

- View conversion progress in real-time
- Access download links in Recent Conversions
- Clear history or individual items as needed

## 📁 Project Structure

```
aimandi-converter/
├── public/                 # Static assets
├── src/
│   ├── app/               # Next.js app directory
│   │   ├── auth/         # Authentication pages
│   │   ├── globals.css   # Global styles
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   ├── components/        # React components
│   │   ├── converter/    # Conversion-related components
│   │   └── layout/       # Layout components
│   ├── contexts/         # React contexts
│   ├── lib/              # Utility libraries
│   │   └── supabase/     # Supabase configuration
│   ├── services/         # Business logic
│   └── types/            # TypeScript type definitions
├── .env.local            # Environment variables
├── package.json          # Dependencies and scripts
├── tailwind.config.ts    # Tailwind configuration
└── tsconfig.json         # TypeScript configuration
```

## 🎯 Development Roadmap

### Current Status (85% Complete)
- ✅ File upload system with drag-and-drop
- ✅ Format selection interface
- ✅ Basic conversion workflow
- ✅ User authentication with Google OAuth
- ✅ Conversion history display
- ✅ Responsive UI components
- ✅ Database connectivity

### Upcoming Features

#### Phase 1: Enhanced User Experience
- [ ] User dashboard with statistics
- [ ] Advanced file management
- [ ] Real-time notifications
- [ ] Dark/light theme toggle
- [ ] Mobile app (PWA)

#### Phase 2: AI Integration
- [ ] AI-powered conversion optimization
- [ ] Content-aware processing
- [ ] Quality prediction
- [ ] Batch processing with AI

#### Phase 3: Advanced Features
- [ ] API for developers
- [ ] Premium subscription tiers
- [ ] Team collaboration
- [ ] Enterprise features

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

### Code Style

- Use Prettier for code formatting
- Follow ESLint rules
- Use meaningful variable names
- Comment complex logic
- Keep components small and focused

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Aryan B V

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```


### Resources

- [Documentation](https://docs.aimandi.in)
- [API Reference](https://api.aimandi.in/docs)
- [FAQ](https://aimandi.in/faq)
- [Changelog](CHANGELOG.md)

---

<div align="center">
  <p>Made with ❤️ by the AIMandi Team</p>
  <p>⭐ Star us on GitHub if this project helped you!</p>
</div>
