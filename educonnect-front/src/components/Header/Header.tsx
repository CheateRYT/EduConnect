// Header.tsx
'use client'
import { getUser, validateToken } from '@/src/utils/validateToken'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './Header.module.css'
const Header = () => {
	const router = useRouter()
	const [user, setUser] = useState<any>(null)
	useEffect(() => {
		const token = Cookies.get('token')
		if (token) {
			validateToken(token).then(valid => {
				if (!valid) {
					router.push('/')
				}
			})
		} else {
			router.push('/')
		}
	}, [])

	const handleClickLogo = () => {
		router.push('/')
	}

	useEffect(() => {
		const token = Cookies.get('token')
		if (token) {
			getUser(token).then(setUser)
		}
	}, [])
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
				{user && user.role == 'TEACHER' && (
					<Link href='/create-recomend' className={styles.navLink}>
						Рекомендации
					</Link>
				)}
				{user && (
					<Link href={`/profile/${user.id}`} className={styles.navLink}>
						Профиль
					</Link>
				)}
			</nav>
		</header>
	)
}

export default Header
