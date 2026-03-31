'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, ExternalLink, X } from 'lucide-react'

interface PDFPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  url: string
  title: string
}

export function PDFPreviewDialog({ open, onOpenChange, url, title }: PDFPreviewDialogProps) {
  const [loading, setLoading] = useState(true)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between">
          <DialogTitle className="text-lg">{title}</DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(url, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Open
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a href={url} download={title}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </a>
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 relative bg-gray-100">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
            </div>
          )}
          <iframe
            src={`${url}#toolbar=0&navpanes=0`}
            className="w-full h-full"
            onLoad={() => setLoading(false)}
            title={title}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
