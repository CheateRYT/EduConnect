'use client'
import Header from '@/src/components/Header/Header'
import { backendApiUrl } from '@/src/utils/backendApiUrl'
import { getUser } from '@/src/utils/validateToken'
import axios from 'axios'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import CreateVacancyModal from './CreateVacancyModal'
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
	const [isEmployer, setIsEmployer] = useState<boolean>(false)
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const [userId, setUserId] = useState<number | null>(null) // To store the user's ID
	async function fetchVacancies() {
		try {
			const response = await axios.get<Vacancy[]>(`${backendApiUrl}/vacancy`)
			setVacancies(response.data)
		} catch (error) {
			console.error('Ошибка при получении списка вакансий:', error)
		}
	}
	useEffect(() => {
		fetchVacancies()
	}, [])
	useEffect(() => {
		const token = Cookies.get('token')
		if (token) {
			getUser(token).then(user => {
				if (user.role === 'EMPLOYER') {
					setIsEmployer(true)
				}
				setUserId(user.id) // Store the user's ID
			})
		}
	}, [])

	const handleVacancyCreated = () => {
		fetchVacancies() // Fetch vacancies again after a new vacancy is created
	}

	const handleDeleteVacancy = async (id: number) => {
		try {
			await axios.delete(`${backendApiUrl}/vacancy/${id}`)
			fetchVacancies() // Refresh the list after deletion
		} catch (error) {
			console.error('Ошибка при удалении вакансии:', error)
		}
	}
	return (
		<div>
			<Header />
			<div className={styles.listContainer}>
				<h1 className={styles.title}>Список вакансий</h1>
				{isEmployer && (
					<button
						onClick={() => setIsModalOpen(true)}
						className={styles.createVacancyButton}
					>
						Создать вакансию
					</button>
				)}
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
						{userId === vacancy.employerId && ( // Check if the user is the employer of the vacancy
							<button
								onClick={() => handleDeleteVacancy(vacancy.id)}
								className={styles.deleteVacancyButton}
							>
								Удалить вакансию
							</button>
						)}
						<hr />
					</div>
				))}
			</div>
			<CreateVacancyModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onVacancyCreated={handleVacancyCreated}
			/>
		</div>
	)
}
