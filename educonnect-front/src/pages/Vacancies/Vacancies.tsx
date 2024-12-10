'use client'
import Header from '@/src/components/Header/Header'
import { backendApiUrl } from '@/src/utils/backendApiUrl'
import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from './Vacancies.module.css' // Импортируем модульные стили

interface Vacancy {
	id: number
	title: string
	description: string
	salary?: number | null
	workFormat?: string | null
	address?: string | null
	schedule?: string | null
	employmentType?: string | null
}

export default function VacanciesPage() {
	const [vacancies, setVacancies] = useState<Vacancy[]>([])

	useEffect(() => {
		async function fetchVacancies() {
			try {
				const response = await axios.get<Vacancy[]>(`${backendApiUrl}/vacancy`)
				setVacancies(response.data)
			} catch (error) {
				console.error('Ошибка при получении списка вакансий:', error)
			}
		}

		fetchVacancies()
	}, [])

	return (
		<div>
			{' '}
			<Header />{' '}
			<div className={styles.listContainer}>
				<h1 className={styles.title}>Список вакансий</h1>
				{vacancies.map(vacancy => (
					<div key={vacancy.id} className={styles.vacancyItem}>
						<Link className={styles.link} href={`/vacancies/${vacancy.id}`}>
							{vacancy.title}
						</Link>
						<p className={styles.vacancyDescription}>{vacancy.description}</p>
						<p className={styles.vacancyMeta}>
							<span className={styles.vacancySalary}>
								{vacancy.salary ? `${vacancy.salary} руб.` : 'Не указана'}
							</span>{' '}
							|<span> {vacancy.workFormat}</span> |
							<span> {vacancy.address}</span> |<span> {vacancy.schedule}</span>{' '}
							|<span> {vacancy.employmentType}</span>
						</p>
						<hr />
					</div>
				))}
			</div>
		</div>
	)
}
