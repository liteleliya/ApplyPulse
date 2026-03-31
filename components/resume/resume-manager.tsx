'use client'

import { useState, useRef } from 'react'
import { useResumes, useUploadResume, useDeleteResume, useUpdateResume } from '@/hooks/use-resumes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { FileText, Upload, Trash2, Download, Edit2, Loader2, Plus, Eye } from 'lucide-react'
import { Resume } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { PDFPreviewDialog } from './pdf-preview-dialog'

export function ResumeManager() {
  const { data: resumes, isLoading } = useResumes()
  const uploadResume = useUploadResume()
  const deleteResume = useDeleteResume()
  const updateResume = useUpdateResume()

  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null)

  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadNotes, setUploadNotes] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const [editTitle, setEditTitle] = useState('')
  const [editNotes, setEditNotes] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (!uploadTitle) {
        setUploadTitle(file.name.replace(/\.[^/.]+$/, ''))
      }
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !uploadTitle) return

    setIsUploading(true)
    try {
      await uploadResume.mutateAsync({
        file: selectedFile,
        title: uploadTitle,
        versionNotes: uploadNotes || undefined,
      })
      setShowUploadDialog(false)
      resetUploadForm()
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const resetUploadForm = () => {
    setUploadTitle('')
    setUploadNotes('')
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleEdit = (resume: Resume) => {
    setSelectedResume(resume)
    setEditTitle(resume.title)
    setEditNotes(resume.version_notes || '')
    setShowEditDialog(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedResume) return

    try {
      await updateResume.mutateAsync({
        id: selectedResume.id,
        title: editTitle,
        versionNotes: editNotes || undefined,
      })
      setShowEditDialog(false)
    } catch (error) {
      console.error('Update failed:', error)
    }
  }

  const handleDelete = async () => {
    if (!selectedResume) return

    try {
      await deleteResume.mutateAsync(selectedResume.id)
      setShowDeleteConfirm(false)
      setSelectedResume(null)
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 border-2 border-black bg-[#F5F5F0]">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF4D00]" />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">RESUME MANAGER</h2>
            <p className="text-xs font-mono text-gray-600 uppercase tracking-widest">
              {resumes?.length || 0} RESUMES UPLOADED
            </p>
          </div>
          <button 
            onClick={() => setShowUploadDialog(true)}
            className="h-10 px-4 bg-[#FF4D00] text-white border-2 border-black font-bold uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            UPLOAD
          </button>
        </div>

        {resumes?.length === 0 ? (
          <div className="border-2 border-dashed border-black p-12 text-center bg-white">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-black text-black uppercase tracking-tight mb-2">NO RESUMES YET</h3>
            <p className="text-xs font-mono text-gray-500 mb-6 max-w-sm mx-auto uppercase tracking-wider">
              UPLOAD YOUR RESUMES TO TRACK WHICH VERSION YOU USED FOR EACH APPLICATION
            </p>
            <button 
              onClick={() => setShowUploadDialog(true)}
              className="h-10 px-4 bg-[#FF4D00] text-white border-2 border-black font-bold uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all inline-flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              UPLOAD FIRST RESUME
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes?.map((resume) => (
              <div key={resume.id} className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                {/* Card Header */}
                <div className="p-4 border-b-2 border-black">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[#FF4D00] border-2 border-black">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-black text-sm uppercase tracking-tight text-black truncate">{resume.title}</h4>
                      <p className="text-[10px] font-mono text-gray-500 truncate uppercase tracking-widest">
                        {resume.file_name}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Card Content */}
                <div className="p-4 space-y-3">
                  {resume.version_notes && (
                    <p className="text-xs text-gray-600 line-clamp-2">{resume.version_notes}</p>
                  )}
                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                    <span>{formatFileSize(resume.file_size)}</span>
                    <span>{formatDistanceToNow(new Date(resume.created_at), { addSuffix: true }).toUpperCase()}</span>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t-2 border-black">
                    <button
                      onClick={() => {
                        setSelectedResume(resume)
                        setShowPreview(true)
                      }}
                      className="flex-1 h-8 px-3 border-2 border-black bg-white text-black font-bold uppercase text-[10px] tracking-wider hover:bg-gray-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      PREVIEW
                    </button>
                    <button
                      onClick={() => handleEdit(resume)}
                      className="h-8 w-8 border-2 border-black bg-white flex items-center justify-center hover:bg-gray-100"
                    >
                      <Edit2 className="h-3 w-3 text-black" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedResume(resume)
                        setShowDeleteConfirm(true)
                      }}
                      className="h-8 w-8 border-2 border-red-500 bg-red-100 flex items-center justify-center hover:bg-red-200"
                    >
                      <Trash2 className="h-3 w-3 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Dialog - Brutalist */}
      <Dialog open={showUploadDialog} onOpenChange={(open) => {
        setShowUploadDialog(open)
        if (!open) resetUploadForm()
      }}>
        <DialogContent className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-[#F5F5F0]">
          <DialogHeader>
            <DialogTitle className="text-lg font-black uppercase tracking-tight text-black">UPLOAD RESUME</DialogTitle>
            <DialogDescription className="text-xs font-mono uppercase tracking-widest text-gray-600">
              UPLOAD A PDF. TAG IT TO APPLICATIONS LATER.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-black">RESUME FILE (PDF)</label>
              <div
                className="border-2 border-dashed border-black p-6 text-center cursor-pointer hover:bg-gray-100 transition-colors bg-white"
                onClick={() => fileInputRef.current?.click()}
              >
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="h-8 w-8 text-[#FF4D00]" />
                    <div className="text-left">
                      <p className="font-bold text-sm text-black uppercase">{selectedFile.name}</p>
                      <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs font-mono text-gray-600 uppercase tracking-wider">CLICK TO SELECT OR DRAG AND DROP</p>
                    <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">PDF FILES ONLY, MAX 10MB</p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-black">TITLE *</label>
              <Input
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="e.g., Software Engineer Resume v2"
                className="border-2 border-black bg-white font-mono text-sm placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-black">VERSION NOTES</label>
              <Textarea
                value={uploadNotes}
                onChange={(e) => setUploadNotes(e.target.value)}
                placeholder="e.g., Tailored for frontend roles"
                rows={2}
                className="border-2 border-black bg-white font-mono text-sm placeholder:text-gray-400"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <button 
              onClick={() => setShowUploadDialog(false)} 
              disabled={isUploading}
              className="h-10 px-4 border-2 border-black bg-white text-black font-bold uppercase text-xs tracking-wider hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              CANCEL
            </button>
            <button 
              onClick={handleUpload} 
              disabled={!selectedFile || !uploadTitle || isUploading}
              className="h-10 px-4 bg-[#FF4D00] text-white border-2 border-black font-bold uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  UPLOADING...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  UPLOAD
                </>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog - Brutalist */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-[#F5F5F0]">
          <DialogHeader>
            <DialogTitle className="text-lg font-black uppercase tracking-tight text-black">EDIT RESUME</DialogTitle>
            <DialogDescription className="text-xs font-mono uppercase tracking-widest text-gray-600">
              UPDATE THE TITLE OR NOTES FOR THIS RESUME.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-black">TITLE</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="border-2 border-black bg-white font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-black">VERSION NOTES</label>
              <Textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={3}
                className="border-2 border-black bg-white font-mono text-sm"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <button 
              onClick={() => setShowEditDialog(false)}
              className="h-10 px-4 border-2 border-black bg-white text-black font-bold uppercase text-xs tracking-wider hover:bg-gray-100 transition-colors"
            >
              CANCEL
            </button>
            <button 
              onClick={handleSaveEdit} 
              disabled={!editTitle}
              className="h-10 px-4 bg-[#FF4D00] text-white border-2 border-black font-bold uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
            >
              SAVE CHANGES
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation - Brutalist */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="border-2 border-red-500 bg-[#F5F5F0] shadow-[8px_8px_0px_0px_rgba(239,68,68,0.5)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-black uppercase tracking-tight text-black">⚠ DELETE RESUME?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs font-mono uppercase tracking-wider text-gray-600">
              THIS WILL PERMANENTLY DELETE "{selectedResume?.title?.toUpperCase()}" AND REMOVE IT FROM ALL LINKED APPLICATIONS.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="h-10 px-4 border-2 border-black bg-white text-black font-bold uppercase text-xs tracking-wider hover:bg-gray-100">
              CANCEL
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="h-10 px-4 bg-red-600 text-white border-2 border-red-800 font-bold uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(127,29,29,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              DELETE
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* PDF Preview Dialog */}
      {selectedResume && (
        <PDFPreviewDialog
          open={showPreview}
          onOpenChange={setShowPreview}
          url={selectedResume.file_url}
          title={selectedResume.title}
        />
      )}
    </>
  )
}
