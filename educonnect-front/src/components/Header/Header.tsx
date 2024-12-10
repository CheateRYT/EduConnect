// Header.tsx
'use client'
import { validateToken } from '@/src/utils/validateToken'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import styles from './Header.module.css'
const Header = () => {
	const router = useRouter()

	useEffect(() => {
		const token = Cookies.get('token')
		if (token) {
			validateToken(token).then(valid => {
				if (!valid) {
					router.push('/login')
				}
			})
		} else {
			router.push('/login')
		}
	}, [])

	const handleClickLogo = () => {
		router.push('/')
	}

	return (
		<header className={styles.header}>
			<div onClick={handleClickLogo} className={styles.logo}>
				EduConnect
			</div>
			<nav className={styles.nav}>
				<Link href='/projects' className={styles.navLink}>
					Проекты
				</Link>
				<Link href='/courses' className={styles.navLink}>
					Курсы
				</Link>
				<Link href='/vacancies' className={styles.navLink}>
					Вакансии
				</Link>
				<Link href='/portfolio' className={styles.navLink}>
					Портфолио
				</Link>
				<Link href='/profile' className={styles.navLink}>
					Профиль
				</Link>
			</nav>
		</header>
	)
}

export default Header
