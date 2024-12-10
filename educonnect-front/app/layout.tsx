import localFont from 'next/font/local'
import './globals.css'
import StoreProvider from './StoreProvider'

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
			<StoreProvider>
				<body className={`${defaultFont.variable} antialiased`}>
					{children}
				</body>
			</StoreProvider>
		</html>
	)
}
