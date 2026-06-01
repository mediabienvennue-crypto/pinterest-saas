import './globals.css'

export const metadata = {
  title: 'PlannerAI — AI Planner, Checklist & Guide Generator',
  description: 'Generate beautiful, printable planners, checklists, and step-by-step guides in seconds with AI. Free to use. Export to PDF, Notion, or Google Sheets.',
  keywords: 'AI planner generator, checklist maker, printable planner, productivity tools, free planner',
  openGraph: {
    title: 'PlannerAI — AI Planner, Checklist & Guide Generator',
    description: 'Generate beautiful, printable planners and checklists in seconds with AI.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PlannerAI — Free AI Planner Generator',
    description: 'Generate beautiful planners & checklists in seconds.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
