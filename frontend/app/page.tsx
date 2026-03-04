export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="animate-fade-in text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
          LearnFlow
        </h1>
        <p className="mb-8 text-lg" style={{ color: 'var(--color-text-secondary)' }}>
          Structured video courses with progress tracking
        </p>
        <div
          className="mx-auto h-1 w-16 rounded-full"
          style={{ background: 'var(--color-accent)' }}
        />
        <p className="mt-8 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Subject listing will appear here once the backend is connected.
        </p>
      </div>
    </div>
  );
}
