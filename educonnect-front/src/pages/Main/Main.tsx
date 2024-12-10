'use client'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import TypeIt from 'typeit'
import styles from './Main.module.css'

const Main = () => {
	// Указываем только HTMLSpanElement для рефа
	const typeItRef = useRef<HTMLSpanElement | null>(null)

	useEffect(() => {
		const timer = setTimeout(() => {
			if (typeItRef.current) {
				// Проверяем, что реф не равен null
				const typeItInstance = new TypeIt(typeItRef.current, {
					speed: 50,
					waitUntilVisible: true,
					loop: true,
				})
					.type(
						'EduConnect — цифровая образовательная платформа, которая делает образование в России качественным и доступным!'
					)
					.pause(1000)
					.delete(100)
					.go()

				// Очистка при размонтировании компонента
				return () => {
					typeItInstance.destroy() // Уничтожаем экземпляр TypeIt
				}
			}
		}, 100) // Задержка в 100 мс

		return () => clearTimeout(timer) // Очистка таймера при размонтировании
	}, [])

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<h1 className={styles.title}>EduConnect</h1>
				<nav>
					<Link href='/login'>
						<button className={styles.navLink}>Войти</button>
					</Link>
				</nav>
			</header>
			<main className={styles.main}>
				<h2 className={styles.subtitle}>
					<span ref={typeItRef}></span> {/* Используем реф вместо id */}
				</h2>
				<p className={styles.description}>
					Веб-платформа для объединения студентов, преподавателей и
					работодателей с целью улучшения образовательного процесса и
					трудоустройства.
				</p>
				<p className={styles.join}>Присоединиться:</p>
				<div className={styles.actions}>
					<Link href='/registerStudent'>
						<button className={styles.signupButton}>Для Студента</button>
					</Link>
					<Link href='/registerTeacher'>
						<button className={styles.signupButton}>Для Преподавателя</button>
					</Link>
					<Link href='/registerEmployer'>
						<button className={styles.signupButton}>Для Работодателя</button>
					</Link>
				</div>
			</main>
			<footer className={styles.footer}>
				<p>
					© 2024 Для хакатона. Лучшее Веб приложение. Кейс WEB practic. Автор
					Редников Лев. Команда Пчелки
				</p>
			</footer>
		</div>
	)
}

export default Main
