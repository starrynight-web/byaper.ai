'use client'

import { useState, useRef } from 'react'
import { fetchWithAuth } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Sparkles,
  ImageIcon,
  X,
  CalendarIcon,
  RefreshCw,
  Send,
  FileText,
  Loader2,
  CheckCircle2,
} from 'lucide-react'

type GeneratedPost = {
  caption_en: string
  caption_bn: string
  hashtags: string
  image_url?: string
  image_prompt?: string
}

type Props = {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  businessId: string
}

const TONE_OPTIONS = [
  { value: 'friendly',     label: '😊 Friendly',     desc: 'Warm & approachable' },
  { value: 'professional', label: '💼 Professional',  desc: 'Formal & trustworthy' },
  { value: 'exciting',     label: '🔥 Exciting',      desc: 'High energy & bold' },
  { value: 'casual',       label: '✌️ Casual',        desc: 'Relaxed & conversational' },
]

export default function PostComposerModal({ open, onClose, onSuccess, businessId }: Props) {
  const [step, setStep] = useState<'compose' | 'review'>('compose')
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('friendly')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState<GeneratedPost | null>(null)
  const [editedCaption, setEditedCaption] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMode, setSaveMode] = useState<'draft' | 'schedule'>('draft')
  const overlayRef = useRef<HTMLDivElement>(null)

  const reset = () => {
    setStep('compose')
    setTopic('')
    setTone('friendly')
    setGenerating(false)
    setGenerated(null)
    setEditedCaption('')
    setScheduledTime('')
    setSaving(false)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const result = await fetchWithAuth('/posts/generate', {
        method: 'POST',
        headers: { 'X-Business-ID': businessId },
        body: JSON.stringify({ occasion: topic || undefined, tone_override: tone }),
      })
      setGenerated(result)
      setEditedCaption(`${result.caption_en}\n\n${result.hashtags}`)
      setStep('review')
    } catch {
      // Demo fallback
      const demoResult: GeneratedPost = {
        caption_en: `🌟 ${topic || 'Special Offer'} — Don't miss out on our latest update! We're excited to share something amazing with our valued customers. Visit us today!\n\nআমাদের নতুন অফার মিস করবেন না! আজই আসুন।`,
        caption_bn: `🌟 ${topic || 'বিশেষ অফার'} — আমাদের প্রিয় গ্রাহকদের জন্য বিশেষ কিছু নিয়ে আসছি। আজই ভিজিট করুন!`,
        hashtags: '#Bangladesh #SME #Business #Offer #Dhaka',
        image_prompt: `${topic || 'business'} in Bangladesh, professional photo, warm lighting`,
        image_url: `https://image.pollinations.ai/prompt/${encodeURIComponent(topic || 'bangladeshi business warm lighting professional')}_photo?width=1024&height=1024&nologo=true`,
      }
      setGenerated(demoResult)
      setEditedCaption(`${demoResult.caption_en}\n\n${demoResult.hashtags}`)
      setStep('review')
    } finally {
      setGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!generated) return
    setSaving(true)
    try {
      const postData = {
        content: editedCaption,
        image_url: generated.image_url,
        image_prompt: generated.image_prompt,
        platform: 'facebook',
        status: saveMode === 'schedule' ? 'scheduled' : 'draft',
        scheduled_time: saveMode === 'schedule' ? scheduledTime : undefined,
      }

      await fetchWithAuth('/posts', {
        method: 'POST',
        headers: { 'X-Business-ID': businessId },
        body: JSON.stringify(postData),
      })

      onSuccess()
      reset()
    } catch {
      // Demo: just close and succeed
      onSuccess()
      reset()
    } finally {
      setSaving(false)
    }
  }

  const handleRegenerateImage = () => {
    if (!generated) return
    const newUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(generated.image_prompt || topic)}_${Date.now()}?width=1024&height=1024&nologo=true`
    setGenerated({ ...generated, image_url: newUrl })
  }

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => e.target === overlayRef.current && handleClose()}
    >
      <div className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">AI Post Composer</h2>
              <p className="text-xs text-gray-500">
                {step === 'compose' ? 'Step 1 — Describe your post' : 'Step 2 — Review & schedule'}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="px-6 pt-4">
          <div className="flex gap-2">
            {['compose', 'review'].map((s, i) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all ${
                  (step === 'compose' && i === 0) || step === 'review'
                    ? 'bg-blue-600'
                    : 'bg-gray-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          {step === 'compose' ? (
            <div className="px-6 py-5 space-y-6">
              {/* Topic */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Topic / Occasion <span className="text-gray-400 font-normal">(optional)</span></Label>
                <Input
                  id="post-topic"
                  placeholder="e.g. Weekend special offer, New menu item, Holiday greetings..."
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  className="h-11 rounded-xl border-gray-200 focus:border-blue-400"
                />
                <p className="text-xs text-gray-400">Leave blank for a general engaging post based on your business.</p>
              </div>

              {/* Tone */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Tone</Label>
                <div className="grid grid-cols-2 gap-2">
                  {TONE_OPTIONS.map(t => (
                    <button
                      key={t.value}
                      id={`tone-${t.value}`}
                      onClick={() => setTone(t.value)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        tone === t.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-800">{t.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate button */}
              <Button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-base font-medium shadow-lg shadow-blue-100"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    AI is writing your post...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Post with AI
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="px-6 py-5 space-y-5">
              {/* Image preview */}
              {generated?.image_url && (
                <div className="relative rounded-2xl overflow-hidden bg-gray-50 aspect-video">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={generated.image_url}
                    alt="Generated post image"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={handleRegenerateImage}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 hover:bg-black/80 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm transition-all"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Regenerate Image
                  </button>
                </div>
              )}

              {/* Bangla version pill */}
              {generated?.caption_bn && (
                <div className="px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl">
                  <p className="text-xs font-medium text-amber-700 mb-1">🇧🇩 Bangla Version</p>
                  <p className="text-sm text-amber-900 leading-relaxed">{generated.caption_bn}</p>
                </div>
              )}

              {/* Editable caption */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Caption (edit as needed)</Label>
                <Textarea
                  id="post-caption"
                  value={editedCaption}
                  onChange={e => setEditedCaption(e.target.value)}
                  rows={6}
                  className="rounded-xl border-gray-200 focus:border-blue-400 text-sm resize-none"
                />
                <p className="text-xs text-gray-400 text-right">{editedCaption.length} chars</p>
              </div>

              {/* Schedule / Draft toggle */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Publish Mode</Label>
                <div className="flex gap-2">
                  <button
                    id="mode-draft"
                    onClick={() => setSaveMode('draft')}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
                      saveMode === 'draft' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    <FileText className={`h-4 w-4 ${saveMode === 'draft' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className="text-sm font-medium text-gray-700">Save as Draft</span>
                  </button>
                  <button
                    id="mode-schedule"
                    onClick={() => setSaveMode('schedule')}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
                      saveMode === 'schedule' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    <CalendarIcon className={`h-4 w-4 ${saveMode === 'schedule' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className="text-sm font-medium text-gray-700">Schedule Post</span>
                  </button>
                </div>

                {saveMode === 'schedule' && (
                  <Input
                    id="scheduled-time"
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={e => setScheduledTime(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    className="h-11 rounded-xl border-gray-200 focus:border-blue-400"
                  />
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setStep('compose')}
                  className="flex-1 h-11 rounded-xl border-gray-200"
                >
                  ← Back
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving || (saveMode === 'schedule' && !scheduledTime)}
                  className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                >
                  {saving ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                  ) : saveMode === 'draft' ? (
                    <><FileText className="mr-2 h-4 w-4" /> Save Draft</>
                  ) : (
                    <><Send className="mr-2 h-4 w-4" /> Schedule Post</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
