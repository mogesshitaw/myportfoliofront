// lib/api/testimonials.ts
import apiClient from '../api'

export interface Testimonial {
  id: string
  author: string
  position: string
  content: string
  rating: number
  avatarUrl?: string
  createdAt: string
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const response = await apiClient.get('/testimonials')
    if (response.data?.success) {
      return response.data.data
    }
    return []
  } catch (error) {
    console.error('Failed to fetch testimonials:', error)
    return []
  }
}

export async function createTestimonial(data: Omit<Testimonial, 'id' | 'createdAt'>) {
  try {
    const response = await apiClient.post('/testimonials', data)
    return response.data
  } catch (error) {
    console.error('Failed to create testimonial:', error)
    throw error
  }
}

export async function deleteTestimonial(id: string) {
  try {
    const response = await apiClient.delete(`/testimonials/${id}`)
    return response.data
  } catch (error) {
    console.error('Failed to delete testimonial:', error)
    throw error
  }
}