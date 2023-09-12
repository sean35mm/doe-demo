'use client'

import axios from 'axios'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ingredients } from '@/data/data'
import { getRandomFloat } from '@/lib/helpers'
import { useState } from 'react'

export default function Home() {
	const [weight, setWeight] = useState<string | null>(null)

	const generateAndSetWeight = (): void => {
		const randomFloat = getRandomFloat()
		setWeight(randomFloat)
	}

	const saveWeight = async (): Promise<void> => {
		if (!weight) return

		try {
			const response = await axios.post('BACKEND_ENDPOINT_HERE_YEE_BOYYY', {
				weight,
			})
			console.log('Saved successfully', response.data)
		} catch (error) {
			console.error('Error saving the weight', error)
		}
	}

	return (
		<main className='py-12 px-24 bg-slate-700 text-white'>
			<Table>
				<TableCaption>Caluclated Weight: {weight}</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className='w-[150px]'>Name</TableHead>
						<TableHead className=''>Description</TableHead>
						<TableHead>Price</TableHead>
						<TableHead className=''>Amount</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{ingredients.map((item) => {
						return (
							<TableRow key={item.id}>
								<TableCell className='font-medium'>{item.name}</TableCell>
								<TableCell>{item.description}</TableCell>
								<TableCell>${item.price}</TableCell>
								<TableCell>{item.amount}</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
			<div className='flex justify-center mt-2'>
				<Button
					variant='outline'
					className='mt-12 mx-2 rounded hover:bg-white hover:text-black'
					onClick={generateAndSetWeight}
				>
					Calculate Weight
				</Button>

				<Button
					variant='outline'
					className='mt-12 mx-2 rounded hover:bg-white hover:text-black'
					onClick={saveWeight}
				>
					Save Weight
				</Button>
			</div>
		</main>
	)
}
