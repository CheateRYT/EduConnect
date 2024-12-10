'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import TypeIt from 'typeit'
import styles from './Main.module.css'

const Main = () => {
	useEffect(() => {
		new TypeIt('#typeit', {
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
	}, [])

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				{/* <h1 className={styles.title}>EduConnect</h1> */}
				<nav>{}</nav>
			</header>
			<main className={styles.main}>
				<h2 className={styles.subtitle}>
					<span id='typeit'></span>
				</h2>
				<p className={styles.description}>
					Веб-платформа для объединения студентов, преподавателей и
					работодателей с целью улучшения образовательного процесса и
					трудоустройства.
				</p>
				<p className={styles.join}>Присоединиться:</p>
				<div className={styles.actions}>
					{' '}
					<Link href='/registerStudent'>
						<button className={styles.signupButton}>Для Студента</button>
					</Link>
					<Link href='/registerTeacher'>
						<button className={styles.signupButton}>Для Преподователя</button>
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
