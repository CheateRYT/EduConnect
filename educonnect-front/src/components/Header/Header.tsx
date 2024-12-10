'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './Header.module.css'

const Header = () => {
	const router = useRouter()
	const handleClickLogo = async () => {
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
