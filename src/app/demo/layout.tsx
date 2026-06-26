/**
 * Demo — Layout
 *
 * Full-screen layout for Demo Mode.
 * No sidebar, no dashboard chrome, no navbar, no footer.
 * The experience is completely isolated from the rest of the app.
 *
 * Only the background and global providers are present.
 */

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg">
      {children}
    </div>
  );
}
