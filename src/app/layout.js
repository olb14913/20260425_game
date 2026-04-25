import './globals.css';

export const metadata = {
  title: 'Bluffing Game',
  description: 'AI와 심리전을 펼치는 한국식 눈치게임',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}
