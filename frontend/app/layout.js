import '../styles/globals.css';

export const metadata = { title: "Football Management" };
export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        {children}
      </body>
    </html>
  );
}
