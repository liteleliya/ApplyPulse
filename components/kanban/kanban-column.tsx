'use client'

import { Application, ApplicationStatus } from '@/types'
import { ApplicationCard } from './application-card'
import { Droppable, Draggable } from '@hello-pangea/dnd'

interface KanbanColumnProps {
  status: ApplicationStatus
  title: string
  applications: Application[]
  resumeMap?: Record<string, { id: string; title: string }[]>
  onCardClick: (application: Application) => void
}

const statusColors: Record<ApplicationStatus, string> = {
  wishlist: 'bg-gray-100 border-gray-500',
  applied: 'bg-blue-100 border-blue-500',
  assessment: 'bg-yellow-100 border-yellow-500',
  interview: 'bg-purple-100 border-purple-500',
  offer: 'bg-green-100 border-green-500',
  rejected: 'bg-red-100 border-red-500',
  accepted: 'bg-emerald-100 border-emerald-500',
}

export function KanbanColumn({ status, title, applications, resumeMap, onCardClick }: KanbanColumnProps) {
  return (
    <div className="flex flex-col h-full min-h-[280px]">
      {/* Neo-Brutalist Column Header */}
      <div className={`px-4 py-3 border-2 border-black border-b-0 transition-all duration-200 ${statusColors[status]}`}>
        <h2 className="font-black text-xs flex items-center justify-between text-black uppercase tracking-wider">
          <span>{title}</span>
          <span className="font-mono bg-black text-white px-2 py-0.5 text-[10px] transition-transform">
            {applications.length}
          </span>
        </h2>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-2 space-y-2 bg-gray-50 border-2 border-t-0 border-black min-h-[200px] max-h-[400px] overflow-y-auto transition-colors duration-200 ${
              snapshot.isDraggingOver ? 'bg-gray-100' : ''
            }`}
          >
            {applications.map((app, index) => (
              <Draggable key={app.id} draggableId={app.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={provided.draggableProps.style}
                    className={snapshot.isDragging ? 'z-50' : ''}
                  >
                    <ApplicationCard 
                      application={app} 
                      linkedResumes={resumeMap?.[app.id]}
                      onClick={() => onCardClick(app)}
                      isDragging={snapshot.isDragging}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
