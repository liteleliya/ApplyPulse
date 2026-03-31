/**
 * Email Parser Service
 * 
 * This service handles parsing job application emails.
 * Currently uses mock data, but is structured to easily swap in Gmail API.
 * 
 * To integrate Gmail API later:
 * 1. Install googleapis: npm install googleapis
 * 2. Set up OAuth credentials in Google Cloud Console
 * 3. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.local
 * 4. Implement the GmailProvider class (see TODO below)
 */

export interface ParsedEmail {
  id: string
  subject: string
  from: string
  date: string
  body: string
  htmlBody?: string
}

export interface ParsedApplication {
  company_name: string
  role_title: string
  job_url?: string
  location?: string
  work_type?: 'remote' | 'hybrid' | 'onsite'
  applied_date: string
  confidence: number // 0-100, how confident we are in the parsing
  source_email_id: string
  raw_snippet: string
}

// Email patterns for parsing
const EMAIL_PATTERNS = {
  // Company name extraction patterns
  company: [
    /(?:from|at|with)\s+([A-Z][A-Za-z0-9\s&.]+?)(?:\s+regarding|\s+for|\s*[,.])/i,
    /([A-Z][A-Za-z0-9\s&.]+?)\s+(?:has received|received|got)\s+your\s+application/i,
    /Thank you for (?:applying|your application|your interest) (?:to|at|with)\s+([A-Z][A-Za-z0-9\s&.]+)/i,
    /Your application (?:to|at|for)\s+([A-Z][A-Za-z0-9\s&.]+)/i,
  ],
  // Role extraction patterns
  role: [
    /(?:position|role|job)(?:\s+of)?:\s*([A-Za-z0-9\s,.-]+)/i,
    /applying for (?:the\s+)?([A-Za-z0-9\s,.-]+?)(?:\s+position|\s+role|\s+at|\s*[,.])/i,
    /application for (?:the\s+)?([A-Za-z0-9\s,.-]+?)(?:\s+position|\s+role|\s+at|\s*[,.])/i,
    /([A-Za-z]+\s+(?:Engineer|Developer|Designer|Manager|Analyst|Scientist|Intern))/i,
  ],
  // Location patterns
  location: [
    /(?:location|based in|office):\s*([A-Za-z\s,]+)/i,
    /(?:in|at)\s+([A-Za-z]+,\s*[A-Z]{2})/i,
  ],
  // Job URL patterns
  jobUrl: [
    /(https?:\/\/[^\s<>"]+(?:job|career|position|apply)[^\s<>"]*)/i,
    /(https?:\/\/(?:www\.)?linkedin\.com\/jobs\/[^\s<>"]+)/i,
    /(https?:\/\/[^\s<>"]+)/i, // Fallback to any URL
  ],
  // Work type patterns
  workType: [
    /\b(remote|hybrid|on-?site|in-?office)\b/i,
  ],
}

/**
 * Parse a single email and extract application data
 */
export function parseEmail(email: ParsedEmail): ParsedApplication | null {
  const text = `${email.subject} ${email.body}`
  let confidence = 0

  // Extract company name
  let company_name = ''
  for (const pattern of EMAIL_PATTERNS.company) {
    const match = text.match(pattern)
    if (match) {
      company_name = match[1].trim()
      confidence += 30
      break
    }
  }

  // Try to extract from email address if no company found
  if (!company_name && email.from) {
    const domainMatch = email.from.match(/@([a-zA-Z0-9-]+)\./i)
    if (domainMatch) {
      company_name = domainMatch[1].charAt(0).toUpperCase() + domainMatch[1].slice(1)
      confidence += 15
    }
  }

  // Extract role title
  let role_title = ''
  for (const pattern of EMAIL_PATTERNS.role) {
    const match = text.match(pattern)
    if (match) {
      role_title = match[1].trim()
      confidence += 30
      break
    }
  }

  // Extract job URL
  let job_url = ''
  for (const pattern of EMAIL_PATTERNS.jobUrl) {
    const match = text.match(pattern)
    if (match) {
      job_url = match[1]
      confidence += 10
      break
    }
  }

  // Extract location
  let location = ''
  for (const pattern of EMAIL_PATTERNS.location) {
    const match = text.match(pattern)
    if (match) {
      location = match[1].trim()
      confidence += 10
      break
    }
  }

  // Extract work type
  let work_type: 'remote' | 'hybrid' | 'onsite' | undefined
  const workTypeMatch = text.match(EMAIL_PATTERNS.workType[0])
  if (workTypeMatch) {
    const wt = workTypeMatch[1].toLowerCase().replace('-', '')
    if (wt === 'remote') work_type = 'remote'
    else if (wt === 'hybrid') work_type = 'hybrid'
    else work_type = 'onsite'
    confidence += 10
  }

  // Only return if we have at least company or role
  if (!company_name && !role_title) {
    return null
  }

  // Default role if not found
  if (!role_title) {
    role_title = 'Position (Review Required)'
    confidence -= 10
  }

  // Default company if not found
  if (!company_name) {
    company_name = 'Company (Review Required)'
    confidence -= 10
  }

  return {
    company_name,
    role_title,
    job_url: job_url || undefined,
    location: location || undefined,
    work_type,
    applied_date: email.date,
    confidence: Math.max(0, Math.min(100, confidence)),
    source_email_id: email.id,
    raw_snippet: email.body.substring(0, 200),
  }
}

/**
 * Parse multiple emails
 */
export function parseEmails(emails: ParsedEmail[]): ParsedApplication[] {
  const results: ParsedApplication[] = []

  for (const email of emails) {
    // Filter to only application-related emails
    const isApplicationEmail =
      /application|applied|applying|received|thank you for your interest|candidate/i.test(
        `${email.subject} ${email.body}`
      )

    if (isApplicationEmail) {
      const parsed = parseEmail(email)
      if (parsed) {
        results.push(parsed)
      }
    }
  }

  return results
}

// ============================================================
// MOCK DATA - Replace with Gmail API calls later
// ============================================================

export const MOCK_EMAILS: ParsedEmail[] = [
  {
    id: 'mock-1',
    subject: 'Application Received - Software Engineer at Google',
    from: 'jobs-noreply@google.com',
    date: new Date().toISOString(),
    body: `Hi,

Thank you for applying to Google for the Software Engineer position.

We have received your application and our recruiting team will review it shortly. If your qualifications match our requirements, we will reach out to schedule next steps.

Position: Software Engineer
Location: Mountain View, CA
Job Type: Hybrid

Best regards,
Google Recruiting Team

View job: https://careers.google.com/jobs/123456`,
  },
  {
    id: 'mock-2',
    subject: 'Your application to Meta',
    from: 'careers@meta.com',
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    body: `Dear Candidate,

Thank you for your interest in joining Meta! We've received your application for the Frontend Developer role.

Our team is currently reviewing applications and we'll be in touch if there's a potential match.

Location: Remote
Apply here: https://www.metacareers.com/jobs/789

Regards,
Meta Talent Team`,
  },
  {
    id: 'mock-3',
    subject: 'Application Confirmation - Amazon',
    from: 'no-reply@amazon.jobs',
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    body: `Hello,

This email confirms that Amazon has received your application for:

Position: Senior Backend Engineer
Location: Seattle, WA
Work Type: On-site

We appreciate your interest in joining our team. Your application will be reviewed by our hiring managers.

Track your application: https://amazon.jobs/application/ABC123

Thank you,
Amazon Recruiting`,
  },
  {
    id: 'mock-4',
    subject: 'Thanks for applying to Stripe',
    from: 'recruiting@stripe.com',
    date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    body: `Hi there,

We received your application for the Full Stack Developer position at Stripe.

Our hiring team reviews every application carefully. If your background is a match, we'll reach out to discuss next steps.

This is a remote position.

Best,
Stripe Recruiting`,
  },
  {
    id: 'mock-5',
    subject: 'Newsletter: Top Tech Jobs This Week',
    from: 'newsletter@jobsite.com',
    date: new Date(Date.now() - 345600000).toISOString(),
    body: `Check out these amazing job opportunities...`, // This should be filtered out
  },
]

/**
 * Email Provider Interface
 * Implement this interface for different email sources
 */
export interface EmailProvider {
  fetchEmails(options: { maxResults?: number; query?: string }): Promise<ParsedEmail[]>
  isConnected(): Promise<boolean>
  connect(): Promise<void>
  disconnect(): Promise<void>
}

/**
 * Mock Email Provider
 * Returns mock emails for testing
 */
export class MockEmailProvider implements EmailProvider {
  private connected = false

  async fetchEmails(options: { maxResults?: number; query?: string } = {}): Promise<ParsedEmail[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const maxResults = options.maxResults || 10
    return MOCK_EMAILS.slice(0, maxResults)
  }

  async isConnected(): Promise<boolean> {
    return this.connected
  }

  async connect(): Promise<void> {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 300))
    this.connected = true
  }

  async disconnect(): Promise<void> {
    this.connected = false
  }
}

/**
 * TODO: Gmail API Provider
 * Implement this when ready for real Gmail integration
 * 
 * Requirements:
 * 1. npm install googleapis
 * 2. Set up OAuth in Google Cloud Console
 * 3. Add environment variables:
 *    - GOOGLE_CLIENT_ID
 *    - GOOGLE_CLIENT_SECRET
 *    - GOOGLE_REDIRECT_URI
 * 
 * Example implementation outline:
 * 
 * import { google } from 'googleapis'
 * 
 * export class GmailProvider implements EmailProvider {
 *   private oauth2Client: OAuth2Client
 *   private gmail: gmail_v1.Gmail
 * 
 *   constructor() {
 *     this.oauth2Client = new google.auth.OAuth2(
 *       process.env.GOOGLE_CLIENT_ID,
 *       process.env.GOOGLE_CLIENT_SECRET,
 *       process.env.GOOGLE_REDIRECT_URI
 *     )
 *     this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client })
 *   }
 * 
 *   async fetchEmails(options) {
 *     const response = await this.gmail.users.messages.list({
 *       userId: 'me',
 *       q: 'subject:(application OR applied OR applying)',
 *       maxResults: options.maxResults || 10
 *     })
 *     // Parse and return emails...
 *   }
 * 
 *   // ... implement other methods
 * }
 */

// Export default provider (swap this when ready for Gmail)
export const emailProvider: EmailProvider = new MockEmailProvider()
