'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { fetchWithAuth } from '@/lib/api'
import { useWorkspaceStore } from '@/lib/stores/workspaceStore'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'

// Schemas for each step
const step1Schema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
})

const step2Schema = z.object({
  location: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal('')),
})

const step3Schema = z.object({
  services: z.string().min(10, "Please provide at least a brief description of your services/menu"),
})

const step4Schema = z.object({
  tone: z.enum(['friendly', 'professional', 'casual']),
})

export default function SetupWizard() {
  const router = useRouter()
  const { setWorkspace } = useWorkspaceStore()
  
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<any>({})

  // Form setups
  const form1 = useForm({ resolver: zodResolver(step1Schema) })
  const form2 = useForm({ resolver: zodResolver(step2Schema) })
  const form3 = useForm({ resolver: zodResolver(step3Schema) })
  const form4 = useForm<z.infer<typeof step4Schema>>({ 
    resolver: zodResolver(step4Schema),
    defaultValues: { tone: 'professional' }
  })

  const handleNext = async (form: any, data: any) => {
    setFormData((prev: any) => ({ ...prev, ...data }))
    setStep(s => s + 1)
  }

  const handleBack = () => setStep(s => s - 1)

  const handleFinalSubmit = async () => {
    setIsSubmitting(true)
    try {
      // 1. Create Workspace
      const businessRes = await fetchWithAuth('/workspaces', {
        method: 'POST',
        body: JSON.stringify({ name: formData.name })
      })
      
      const businessId = businessRes.id

      // 2. Setup Workspace Context
      await fetchWithAuth(`/workspaces/${businessId}/setup`, {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          location: formData.location,
          city: formData.city,
          phone: formData.phone,
          website: formData.website,
          services: { description: formData.services },
          tone: formData.tone
        })
      })

      // 3. Update local state and redirect
      setWorkspace(businessId, formData.name, 'owner')
      router.push(`/${businessId}`)
    } catch (err) {
      console.error('Setup failed', err)
      // Error handling UI omitted for brevity
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalSteps = 5

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 dark:bg-gray-900">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-500">Step {step} of {totalSteps}</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`h-2 w-8 rounded-full ${i <= step ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
              ))}
            </div>
          </div>
          <CardTitle className="text-2xl">
            {step === 1 && "Let's create your business profile"}
            {step === 2 && "Where can customers find you?"}
            {step === 3 && "What do you sell?"}
            {step === 4 && "Choose your AI personality"}
            {step === 5 && "Connect Integrations"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "This helps the AI understand your industry."}
            {step === 2 && "Local search depends on accurate location data."}
            {step === 3 && "The AI will use this to write posts and answer customer questions."}
            {step === 4 && "How should the AI sound when talking to your customers?"}
            {step === 5 && "You can skip this and connect later from the settings page."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === 1 && (
            <form id="step1" onSubmit={form1.handleSubmit((d) => handleNext(form1, d))} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name</Label>
                <Input id="name" {...form1.register('name')} placeholder="e.g. Dhaka Biryani House" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(val: any) => { if(val) form1.setValue('category', val) }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurant">Restaurant / Cafe</SelectItem>
                    <SelectItem value="clinic">Clinic / Healthcare</SelectItem>
                    <SelectItem value="salon">Salon / Beauty</SelectItem>
                    <SelectItem value="retail">Retail Shop</SelectItem>
                    <SelectItem value="hotel">Hotel / Hospitality</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </form>
          )}

          {step === 2 && (
            <form id="step2" onSubmit={form2.handleSubmit((d) => handleNext(form2, d))} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Address</Label>
                <Input id="location" {...form2.register('location')} placeholder="e.g. 123 Banani Road 11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...form2.register('city')} placeholder="e.g. Dhaka" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" {...form2.register('phone')} placeholder="e.g. +8801712345678" />
              </div>
            </form>
          )}

          {step === 3 && (
            <form id="step3" onSubmit={form3.handleSubmit((d) => handleNext(form3, d))} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="services">Products, Services or Menu</Label>
                <Textarea 
                  id="services" 
                  {...form3.register('services')} 
                  placeholder="e.g. We serve authentic Kacchi Biryani, Chicken Roast, and Borhani. Open 11 AM to 11 PM..." 
                  className="min-h-[150px]"
                />
              </div>
            </form>
          )}

          {step === 4 && (
            <form id="step4" onSubmit={form4.handleSubmit((d) => handleNext(form4, d))} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {['friendly', 'professional', 'casual'].map((tone) => (
                  <div 
                    key={tone}
                    onClick={() => form4.setValue('tone', tone as any)}
                    className={`border rounded-lg p-4 cursor-pointer text-center capitalize transition-colors ${form4.watch('tone') === tone ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'hover:border-gray-400'}`}
                  >
                    <div className="font-medium">{tone}</div>
                  </div>
                ))}
              </div>
            </form>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 flex justify-between items-center bg-white dark:bg-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">f</div>
                  <div>
                    <div className="font-medium">Facebook Page</div>
                    <div className="text-sm text-gray-500">For posts & Messenger</div>
                  </div>
                </div>
                <Button variant="outline" disabled>Connect Later</Button>
              </div>
              
              <div className="border rounded-lg p-4 flex justify-between items-center bg-white dark:bg-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">G</div>
                  <div>
                    <div className="font-medium">Google Business Profile</div>
                    <div className="text-sm text-gray-500">For reviews & insights</div>
                  </div>
                </div>
                <Button variant="outline" disabled>Connect Later</Button>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t p-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          ) : <div></div>}
          
          {step < 5 ? (
            <Button type="submit" form={`step${step}`} className="bg-blue-600 hover:bg-blue-700">
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleFinalSubmit} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
              Launch Dashboard
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
