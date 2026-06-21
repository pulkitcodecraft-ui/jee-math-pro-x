import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy — JEE Math Pro',
  description: 'How JEE Math Pro handles your account information and submitted content.',
};

const sections = [
  {
    heading: 'What we collect',
    body: 'If you create an account, we store your display name, email address, and a role (student or admin) via Firebase Authentication and Firestore. Browsing topics, questions, and explanations requires no account and no personal data.',
  },
  {
    heading: 'Content you submit',
    body: 'Approaches you submit (text and any uploaded image) are stored in Firebase and reviewed by an admin before being shown publicly. Submissions are linked to your account so we can attribute and moderate them.',
  },
  {
    heading: 'How we use it',
    body: 'Your information is used only to operate the platform — authenticating you, attributing your contributions, and moderating community submissions. We do not sell your data.',
  },
  {
    heading: 'Third-party services',
    body: 'We rely on Google Firebase (Authentication, Firestore, Storage) to run the service. Your data is processed according to Google\u2019s security and privacy practices.',
  },
  {
    heading: 'Your choices',
    body: 'You can sign out at any time, and request deletion of your account and submitted content by contacting us.',
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-light text-xs font-medium text-primary-light mb-5">
        Privacy
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
        Privacy <span className="gradient-text">Policy</span>
      </h1>
      <p className="text-text-muted leading-relaxed mt-5">
        Plain-English summary of what we store and why. This is a starting template
        for this project — review it with the appropriate guidance before launch.
      </p>

      <div className="space-y-8 mt-10">
        {sections.map((s) => (
          <div key={s.heading}>
            <h2 className="text-base font-semibold text-foreground mb-2">{s.heading}</h2>
            <p className="text-sm text-text-muted leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
