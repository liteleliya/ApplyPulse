'use client'

import { useState, useMemo } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { useApplications, useUpdateApplication } from '@/hooks/use-applications'
import { useAllApplicationResumes } from '@/hooks/use-resumes'
import { KanbanColumn } from './kanban-column'
import { AddApplicationDialog } from './add-application-dialog'
import { EditApplicationDialog } from './edit-application-dialog'
import { Application, ApplicationStatus } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Loader2, Search, X } from 'lucide-react'

// Split into two rows for better visibility
const PIPELINE_COLUMNS: { status: ApplicationStatus; title: string }[] = [
  { status: 'wishlist', title: '💭 Wishlist' },
  { status: 'applied', title: '📤 Applied' },
  { status: 'assessment', title: '📝 Assessment' },
  { status: 'interview', title: '🎤 Interview' },
]

const OUTCOME_COLUMNS: { status: ApplicationStatus; title: string }[] = [
  { status: 'offer', title: '🎉 Offer' },
  { status: 'accepted', title: '✅ Accepted' },
  { status: 'rejected', title: '❌ Rejected' },
]

export function KanbanBoard() {
  const { data: applications, isLoading } = useApplications()
  const { data: resumeMap } = useAllApplicationResumes()
  const updateApplication = useUpdateApplication()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Get all unique tags from applications
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    applications?.forEach(app => {
      app.tags?.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [applications])

  // Filter applications based on search and tags
  const filteredApplications = useMemo(() => {
    if (!applications) return []
    
    return applications.filter(app => {
      // Search filter
      const matchesSearch = !searchQuery || 
        app.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.role_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.location?.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Tag filter
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some(tag => app.tags?.includes(tag))
      
      return matchesSearch && matchesTags
    })
  }, [applications, searchQuery, selectedTags])

  const groupedApplications = filteredApplications.reduce((acc, app) => {
    if (!acc[app.status]) acc[app.status] = []
    acc[app.status].push(app)
    return acc
  }, {} as Record<ApplicationStatus, Application[]>)

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    if (source.droppableId === destination.droppableId) return

    await updateApplication.mutateAsync({
      id: draggableId,
      status: destination.droppableId as ApplicationStatus,
    })
  }

  const handleCardClick = (app: Application) => {
    setSelectedApp(app)
    setShowEditDialog(true)
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedTags([])
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const hasFilters = searchQuery || selectedTags.length > 0

  return (
    <>
      <div className="mb-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Application Pipeline</h2>
            <p className="text-gray-600">
              {filteredApplications.length} of {applications?.length || 0} applications
              {hasFilters && ' (filtered)'}
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Application
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search companies, roles, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {/* Tag Filters */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-500">Tags:</span>
              {allTags.slice(0, 8).map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-blue-100"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="mr-1 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Row 1: Pipeline Stages */}
        <div className="mb-2">
          <p className="text-sm font-medium text-gray-500 mb-2">Pipeline</p>
          <div className="grid grid-cols-4 gap-3">
            {PIPELINE_COLUMNS.map((column) => (
              <KanbanColumn
                key={column.status}
                status={column.status}
                title={column.title}
                applications={groupedApplications?.[column.status] || []}
                resumeMap={resumeMap}
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        </div>

        {/* Row 2: Outcomes */}
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-500 mb-2">Outcomes</p>
          <div className="grid grid-cols-3 gap-3">
            {OUTCOME_COLUMNS.map((column) => (
              <KanbanColumn
                key={column.status}
                status={column.status}
                title={column.title}
                applications={groupedApplications?.[column.status] || []}
                resumeMap={resumeMap}
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        </div>
      </DragDropContext>

      <AddApplicationDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
      <EditApplicationDialog
        application={selectedApp}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
    </>
  )
}
