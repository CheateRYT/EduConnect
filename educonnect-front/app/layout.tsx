import localFont from 'next/font/local'
import './globals.css'

const defaultFont = localFont({
	src: './fonts/Dusha V5 Regular.ttf',
	variable: '--font-default',
	weight: '100 900',
})

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={`${defaultFont.variable} antialiased`}>{children}</body>
		</html>
	)
}
