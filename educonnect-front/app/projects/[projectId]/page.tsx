'use client'
import Header from '@/src/components/Header/Header'
import CreateProjectActionModal from '@/src/pages/Projects/CreateProjectActionModal'
import { backendApiUrl } from '@/src/utils/backendApiUrl'
import { getUser } from '@/src/utils/validateToken'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './page.module.css' // Импортируем модульные стили

interface User {
	id: string
	name: string
}

interface Project {
	title: string
	description: string
	createdAt: string
	creator: {
		name: string
		id: string // Добавляем id создателя проекта
	}
	actions: ProjectAction[]
	users: User[] // Добавляем массив участников
	repositoryUrl?: string // Добавляем поле для URL репозитория
}

interface ProjectAction {
	title: string
	description?: string
	createdAt: string
	repositoryUrl?: string // Добавляем поле для URL репозитория действия
	user: User // Добавляем поле для пользователя, который создал действие
}

export default function ProjectPage() {
	const projectId = useParams().projectId // Получаем projectId из URL
	const router = useRouter()
	const [project, setProject] = useState<Project | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [loggedInUserId, setLoggedInUserId] = useState(null)

	useEffect(() => {
		const token = Cookies.get('token')
		if (token) {
			getUser(token).then(user => {
				setLoggedInUserId(user)
			})
		}
	}, [])

	async function fetchProject() {
		try {
			const response = await axios.get<Project>(
				`${backendApiUrl}/project/${projectId}`
			)
			setProject(response.data)
			console.log(response.data)
		} catch (error) {
			console.error(`Ошибка при получении проекта с id=${projectId}:`, error)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchProject()
	}, [projectId])

	const handleJoinProject = async () => {
		try {
			const token = Cookies.get('token') // Получаем токен из cookies
			if (!token) {
				throw new Error('Токен отсутствует')
			}
			const response = await axios.post(
				`${backendApiUrl}/project/${projectId}/join`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`, // Используем токен для авторизации
					},
				}
			)
			setProject(response.data) // Обновляем проект с новым списком участников
		} catch (error) {
			console.error('Ошибка при присоединении к проекту:', error)
		}
	}

	const handleActionCreated = async () => {
		// После создания действия повторно загружаем проект
		await fetchProject()
		setIsModalOpen(false)
	}

	if (isLoading) {
		return <div>Загрузка...</div>
	}

	// Проверяем, есть ли пользователь в списке участников
	const isUserInProject = project?.users.some(
		user => user.id === loggedInUserId.id
	)

	return (
		<div>
			<Header />
			<div className={styles.detailsContainer}>
				{project && (
					<div className={styles.projectWrapper}>
						<div className={styles.projectHeader}>
							<h1 className={styles.projectTitle}>{project.title}</h1>
							<p className={styles.projectDescription}>{project.description}</p>
							<p className={styles.projectCreator}>
								Создано: {project.creator.name} в{' '}
								{new Date(project.createdAt).toLocaleDateString()}
							</p>
						</div>
						<div className={styles.projectFooter}>
							{project.isCompleted == false &&
							project.creator.id !== loggedInUserId &&
							!isUserInProject &&
							loggedInUserId.role !== 'EMPLOYER' ? (
								<button
									className={styles.joinButton}
									onClick={handleJoinProject}
								>
									Присоединиться к проекту
								</button>
							) : (
								<>
									{' '}
									{project.isCompleted == false &&
										loggedInUserId.role !== 'EMPLOYER' && (
											<button
												className={styles.actionButton}
												onClick={() => setIsModalOpen(true)}
											>
												Создать действие
											</button>
										)}
									<CreateProjectActionModal
										isOpen={isModalOpen}
										onClose={() => setIsModalOpen(false)}
										projectId={projectId}
										onActionCreated={handleActionCreated} // Обновляем действия после создания
									/>
								</>
							)}
						</div>
						<div className={styles.actionsContainer}>
							<h2>Участники проекта</h2>
							<ul>
								{project.users && project.users.length > 0 ? (
									project.users.map(user => <li key={user.id}>{user.name}</li>)
								) : (
									<p>Нет участников в этом проекте.</p>
								)}
							</ul>
						</div>
						<div className={styles.actionsContainer}>
							<h2 className={styles.actionTitle}>Действия проекта</h2>
							{project.actions.length > 0 ? (
								project.actions.map((action, index) => (
									<div key={index} className={styles.actionItem}>
										<h3 className={styles.actionName}>{action.title}</h3>
										<p>{action.description}</p>

										<p>
											Создано: {new Date(action.createdAt).toLocaleDateString()}
										</p>
										{action.repositoryUrl && (
											<p>
												<a
													href={action.repositoryUrl}
													target='_blank'
													className={styles.repositoryLink}
													rel='noopener noreferrer'
												>
													Ссылка на репозиторий
												</a>
											</p>
										)}
									</div>
								))
							) : (
								<p>Нет доступных действий для этого проекта.</p>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
