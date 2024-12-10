'use client'

import Header from '@/src/components/Header/Header'
import { backendApiUrl } from '@/src/utils/backendApiUrl'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation' // Используем useNavigate для навигации
import { useEffect, useState } from 'react'
import styles from './page.module.css' // Импортируем модульные стили

interface Vacancy {
	title: string
	description: string
	salary?: number
	workFormat: string
	address: string
	schedule: string
	employmentType: string
}

export default function VacancyDetailsPage() {
	const vacancyId = useParams().vacancyId as string // Получаем параметр из URL
	const router = useRouter() // Используем для навигации к чату
	const [vacancy, setVacancy] = useState<Vacancy>({} as Vacancy) // Устанавливаем начальное состояние для вакансии
	const [isLoading, setIsLoading] = useState(true) // Флаг загрузки

	useEffect(() => {
		async function fetchVacancy() {
			try {
				const response = await axios.get<Vacancy>(
					`${backendApiUrl}/vacancy/${Number(vacancyId)}`
				)
				setVacancy(response.data)
			} catch (error) {
				console.error(`Ошибка при получении вакансии с id=${vacancyId}:`, error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchVacancy()
	}, [vacancyId])

	if (isLoading) {
		return <div>Загрузка...</div>
	}

	return (
		<div>
			<Header />
			<div className={styles.detailsContainer}>
				<div className={styles.vacancyWrapper}>
					<div className={styles.vacancyHeader}>
						<h1 className={styles.vacancyTitle}>{vacancy.title}</h1>
						<p className={styles.vacancyDescription}>{vacancy.description}</p>
						<div className={styles.vacancyMeta}>
							<span className={styles.vacancyMetaItem}>
								Зарплата:{' '}
								{vacancy.salary ? `${vacancy.salary} руб.` : 'Не указана'}
							</span>
							<span className={styles.vacancyMetaItem}>
								{vacancy.workFormat}
							</span>
							<span className={styles.vacancyMetaItem}>{vacancy.address}</span>
							<span className={styles.vacancyMetaItem}>{vacancy.schedule}</span>
							<span className={styles.vacancyMetaItem}>
								{vacancy.employmentType}
							</span>
						</div>
					</div>
					<div className={styles.vacancyFooter}>
						<button
							className={styles.chatButton}
							onClick={() => router.push(`/vacancyChat/${vacancyId}`)}
						>
							Перейти в чат с работодателем
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
