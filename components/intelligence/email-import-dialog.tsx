'use client'

import { useState, useCallback } from 'react'
import {
  emailProvider,
  parseEmails,
  parseEmail,
  ParsedEmail,
  ParsedApplication
} from '@/lib/services/email-parser'
import { useCreateApplication } from '@/hooks/use-applications'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Mail,
  Loader2,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Trash2,
  Edit2,
  Import,
  FileText,
  Building2,
  Briefcase,
  MapPin,
  Link,
  Calendar,
} from 'lucide-react'

interface EmailImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ImportStep = 'input' | 'review' | 'complete'

export function EmailImportDialog({ open, onOpenChange }: EmailImportDialogProps) {
  const createApplication = useCreateApplication()

  const [step, setStep] = useState<ImportStep>('input')
  const [inputMode, setInputMode] = useState<'paste' | 'fetch'>('paste')
  const [emailText, setEmailText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [parsedApplications, setParsedApplications] = useState<ParsedApplication[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [importedCount, setImportedCount] = useState(0)

  const resetDialog = () => {
    setStep('input')
    setEmailText('')
    setParsedApplications([])
    setSelectedIds(new Set())
    setEditingIndex(null)
    setImportedCount(0)
  }

  const handleClose = () => {
    resetDialog()
    onOpenChange(false)
  }

  // Parse pasted email text
  const handleParseText = useCallback(() => {
    if (!emailText.trim()) return

    setIsLoading(true)

    // Create a mock email object from pasted text
    const mockEmail: ParsedEmail = {
      id: `paste-${Date.now()}`,
      subject: emailText.split('\n')[0] || 'Pasted Email',
      from: '',
      date: new Date().toISOString(),
      body: emailText,
    }

    const parsed = parseEmail(mockEmail)
    if (parsed) {
      setParsedApplications([parsed])
      setSelectedIds(new Set([parsed.source_email_id]))
      setStep('review')
    }

    setIsLoading(false)
  }, [emailText])

  // Fetch from mock provider
  const handleFetchEmails = useCallback(async () => {
    setIsLoading(true)

    try {
      await emailProvider.connect()
      const emails = await emailProvider.fetchEmails({ maxResults: 10 })
      const parsed = parseEmails(emails)

      if (parsed.length > 0) {
        setParsedApplications(parsed)
        setSelectedIds(new Set(parsed.map(p => p.source_email_id)))
        setStep('review')
      }
    } catch (error) {
      console.error('Failed to fetch emails:', error)
    }

    setIsLoading(false)
  }, [])

  // Toggle selection
  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  // Select/deselect all
  const toggleSelectAll = () => {
    if (selectedIds.size === parsedApplications.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(parsedApplications.map(p => p.source_email_id)))
    }
  }

  // Update a parsed application
  const updateParsedApp = (index: number, field: keyof ParsedApplication, value: any) => {
    const updated = [...parsedApplications]
    updated[index] = { ...updated[index], [field]: value }
    setParsedApplications(updated)
  }

  // Remove a parsed application
  const removeApp = (index: number) => {
    const app = parsedApplications[index]
    const newApps = parsedApplications.filter((_, i) => i !== index)
    setParsedApplications(newApps)

    const newSelected = new Set(selectedIds)
    newSelected.delete(app.source_email_id)
    setSelectedIds(newSelected)
  }

  // Import selected applications
  const handleImport = async () => {
    setIsLoading(true)

    const toImport = parsedApplications.filter(app =>
      selectedIds.has(app.source_email_id)
    )

    let imported = 0
    for (const app of toImport) {
      try {
        await createApplication.mutateAsync({
          company_name: app.company_name,
          role_title: app.role_title,
          job_url: app.job_url,
          location: app.location,
          work_type: app.work_type,
          applied_date: app.applied_date.split('T')[0],
          status: 'applied',
          notes: `Imported from email. Confidence: ${app.confidence}%`,
        })
        imported++
      } catch (error) {
        console.error('Failed to import:', error)
      }
    }

    setImportedCount(imported)
    setStep('complete')
    setIsLoading(false)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return 'bg-green-100 text-green-700'
    if (confidence >= 40) return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Smart Email Import
          </DialogTitle>
          <DialogDescription>
            {step === 'input' && 'Paste an application email or fetch from your inbox'}
            {step === 'review' && 'Review and edit the extracted information before importing'}
            {step === 'complete' && 'Import complete!'}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Input */}
        {step === 'input' && (
          <div className="space-y-4">
            <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as 'paste' | 'fetch')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="paste" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Paste Email
                </TabsTrigger>
                <TabsTrigger value="fetch" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Fetch from Inbox
                </TabsTrigger>
              </TabsList>

              <TabsContent value="paste" className="space-y-4">
                <div className="space-y-2">
                  <Label>Paste your application confirmation email</Label>
                  <Textarea
                    value={emailText}
                    onChange={(e) => setEmailText(e.target.value)}
                    placeholder={`Paste the email content here. Example:

Subject: Application Received - Software Engineer at Google

Hi,

Thank you for applying to Google for the Software Engineer position.

Position: Software Engineer
Location: Mountain View, CA
...`}
                    rows={12}
                    className="font-mono text-sm"
                  />
                </div>
                <Button
                  onClick={handleParseText}
                  disabled={!emailText.trim() || isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Parsing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Extract Application Data
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="fetch" className="space-y-4">
                <Card className="border-dashed">
                  <CardContent className="py-8 text-center">
                    <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Fetch Application Emails</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Currently using mock data for demonstration. Connect Gmail API for real emails.
                    </p>
                    <Badge variant="outline" className="mb-4">
                      Using Mock Data (Demo)
                    </Badge>
                    <div className="flex justify-center">
                      <Button onClick={handleFetchEmails} disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Fetching...
                          </>
                        ) : (
                          <>
                            <Import className="mr-2 h-4 w-4" />
                            Fetch Sample Emails
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="text-center text-sm text-gray-500">
                  <p>To connect real Gmail, add Google OAuth credentials to your project.</p>
                  <p className="text-xs mt-1">See lib/services/email-parser.ts for instructions</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Step 2: Review */}
        {step === 'review' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedIds.size === parsedApplications.length}
                  onCheckedChange={toggleSelectAll}
                />
                <span className="text-sm text-gray-600">
                  {selectedIds.size} of {parsedApplications.length} selected
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setStep('input')}>
                ← Back
              </Button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {parsedApplications.map((app, index) => (
                <Card
                  key={app.source_email_id}
                  className={`transition-all ${selectedIds.has(app.source_email_id)
                      ? 'border-blue-300 bg-blue-50/50'
                      : 'opacity-60'
                    }`}
                >
                  <CardContent className="py-4">
                    {editingIndex === index ? (
                      // Edit mode
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Company</Label>
                            <Input
                              value={app.company_name}
                              onChange={(e) => updateParsedApp(index, 'company_name', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Role</Label>
                            <Input
                              value={app.role_title}
                              onChange={(e) => updateParsedApp(index, 'role_title', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Location</Label>
                            <Input
                              value={app.location || ''}
                              onChange={(e) => updateParsedApp(index, 'location', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Work Type</Label>
                            <Select
                              value={app.work_type || ''}
                              onValueChange={(v) => updateParsedApp(index, 'work_type', v || undefined)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="remote">Remote</SelectItem>
                                <SelectItem value="hybrid">Hybrid</SelectItem>
                                <SelectItem value="onsite">On-site</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Job URL</Label>
                          <Input
                            value={app.job_url || ''}
                            onChange={(e) => updateParsedApp(index, 'job_url', e.target.value)}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button size="sm" onClick={() => setEditingIndex(null)}>
                            Done
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // View mode
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedIds.has(app.source_email_id)}
                          onCheckedChange={() => toggleSelection(app.source_email_id)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <span className="font-semibold">{app.company_name}</span>
                            <Badge className={getConfidenceColor(app.confidence)}>
                              {app.confidence}% confidence
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <Briefcase className="h-3 w-3" />
                            <span>{app.role_title}</span>
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                            {app.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {app.location}
                              </div>
                            )}
                            {app.work_type && (
                              <Badge variant="outline" className="text-xs">
                                {app.work_type}
                              </Badge>
                            )}
                            {app.job_url && (
                              <div className="flex items-center gap-1">
                                <Link className="h-3 w-3" />
                                <span className="truncate max-w-[150px]">{app.job_url}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(app.applied_date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingIndex(index)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                            onClick={() => removeApp(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={selectedIds.size === 0 || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Import className="mr-2 h-4 w-4" />
                    Import {selectedIds.size} Application{selectedIds.size !== 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Complete */}
        {step === 'complete' && (
          <div className="py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Import Complete!</h3>
            <p className="text-gray-600 mb-6">
              Successfully imported {importedCount} application{importedCount !== 1 ? 's' : ''} to your dashboard.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => setStep('input')}>
                Import More
              </Button>
              <Button onClick={handleClose}>
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
