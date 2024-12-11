'use client'
import Header from '@/src/components/Header/Header'
import { backendApiUrl } from '@/src/utils/backendApiUrl'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './Portfolio.module.css'

const Portfolio = () => {
	const userId = useParams().userId // Получаем ID пользователя из параметров
	const [user, setUser] = useState<any>(null)
	const [projects, setProjects] = useState<any[]>([])
	const [recommendations, setRecommendations] = useState<any[]>([])
	const [loading, setLoading] = useState<boolean>(true)

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			try {
				// Получаем информацию о пользователе
				const userResponse = await axios.get(
					`${backendApiUrl}/user/getUser/${userId}`
				)
				setUser(userResponse.data.user)

				// Получаем рекомендации
				const recommendationsResponse = await axios.get(
					`${backendApiUrl}/user/recommendations/${userId}`
				)
				setRecommendations(recommendationsResponse.data.recommendations)

				// Получаем проекты пользователя
				const projectsResponse = await axios.get(
					`${backendApiUrl}/project?userId=${userId}`
				)
				setProjects(projectsResponse.data)
			} catch (error) {
				console.error('Ошибка при загрузке данных:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [userId])

	if (loading) {
		return <div>Загрузка...</div>
	}

	if (!user) {
		return <div>Пользователь не найден.</div>
	}

	return (
		<div>
			<Header />{' '}
			<div className={styles.portfolioContainer}>
				<h1 className={styles.portfolioTitle}>{user.name} - Портфолио</h1>
				<img
					src={user.profilePicture || '/default-image.webp'}
					alt='Profile'
					className={styles.profilePicture}
				/>
				<p className={styles.bio}>{user.bio}</p>

				<h2 className={styles.sectionTitle}>Проекты</h2>
				{projects.length > 0 ? (
					<ul className={styles.projectsList}>
						{projects.map(project => (
							<li key={project.id} className={styles.projectItem}>
								<h3>{project.title}</h3>
								<p>{project.description}</p>
							</li>
						))}
					</ul>
				) : (
					<p>Нет проектов.</p>
				)}

				<h2 className={styles.sectionTitle}>Рекомендации</h2>
				{recommendations.length > 0 ? (
					<ul className={styles.recommendationsList}>
						{recommendations.map(rec => (
							<li key={rec.id} className={styles.recommendationItem}>
								<h4>{rec.title}</h4>
								<p>{rec.description}</p>
								<p>Рейтинг: {rec.rating}</p>
							</li>
						))}
					</ul>
				) : (
					<p>Нет рекомендаций.</p>
				)}
			</div>
		</div>
	)
}

export default Portfolio
