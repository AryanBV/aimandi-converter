'use client';

import { useState, useRef, useCallback } from 'react';
import { FileConverterService, ConversionResult } from '@/services/fileConverter';

// Types
interface QueueItem {
  id: string;
  file: File;
  format: string;
  status: 'waiting' | 'processing' | 'completed' | 'failed';
  progress: number;
}

interface HistoryItem {
  id: string;
  fileName: string;
  originalFormat: string;
  targetFormat: string;
  size: number;
  date: string;
  downloadUrl: string;
  convertedFileName?: string;
}

const FORMAT_OPTIONS = [
  { format: 'pdf', emoji: '📕', label: 'PDF' },
  { format: 'docx', emoji: '📘', label: 'DOCX' },
  { format: 'txt', emoji: '📝', label: 'TXT' },
  { format: 'rtf', emoji: '📋', label: 'RTF' },
  { format: 'html', emoji: '🌐', label: 'HTML' },
  { format: 'epub', emoji: '📚', label: 'EPUB' }
];

export default function FileConverter() {
  // State management
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [conversionQueue, setConversionQueue] = useState<QueueItem[]>([]);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Utility functions
  const getFileIcon = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    const icons: { [key: string]: string } = {
      pdf: '📕', doc: '📘', docx: '📘', txt: '📝',
      rtf: '📋', xlsx: '📊', pptx: '📈',
      jpg: '🖼️', jpeg: '🖼️', png: '🎨', gif: '🎞️',
      bmp: '🖌️', webp: '🌐', svg: '📐',
      mp4: '🎬', avi: '📹', mov: '🎥',
      mp3: '🎵', wav: '🎼', ogg: '🎶',
      default: '📄'
    };
    return icons[extension] || icons.default;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const truncateFileName = (name: string, maxLength: number): string => {
    if (name.length <= maxLength) return name;
    const extension = name.split('.').pop() || '';
    const nameWithoutExt = name.slice(0, name.lastIndexOf('.'));
    const truncatedName = nameWithoutExt.slice(0, maxLength - extension.length - 4) + '...';
    return truncatedName + '.' + extension;
  };

  const showNotification = (message: string) => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  // File handling functions
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
      showNotification(`Selected ${files.length} file(s)`);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFiles(files);
      showNotification(`Dropped ${files.length} file(s)`);
    }
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Format selection
  const handleFormatSelect = (format: string) => {
    setSelectedFormat(format);
    showNotification(`Selected ${format.toUpperCase()} format`);
  };

  // Queue management
  const addToQueue = () => {
    if (selectedFiles.length === 0 || !selectedFormat) return;

    const newItems: QueueItem[] = selectedFiles.map(file => ({
      id: Date.now() + Math.random().toString(),
      file,
      format: selectedFormat,
      status: 'waiting',
      progress: 0
    }));

    setConversionQueue(prev => [...prev, ...newItems]);
    
    // Reset selection
    setSelectedFiles([]);
    setSelectedFormat('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    showNotification(`Added ${newItems.length} file(s) to queue`);
  };

  const removeFromQueue = (id: string) => {
    if (isProcessingQueue) return;
    setConversionQueue(prev => prev.filter(item => item.id !== id));
    showNotification('Removed from queue');
  };

  const clearQueue = () => {
    if (isProcessingQueue) return;
    if (conversionQueue.length === 0) return;
    
    if (confirm('Are you sure you want to clear the entire queue?')) {
      setConversionQueue([]);
      showNotification('Queue cleared');
    }
  };

  // Real queue processing with actual file conversion
  const processQueueItem = async (item: QueueItem): Promise<void> => {
    try {
      // Update status to processing
      setConversionQueue(prev => 
        prev.map(qItem => 
          qItem.id === item.id 
            ? { ...qItem, status: 'processing', progress: 0 }
            : qItem
        )
      );

      // Perform actual file conversion
      const result: ConversionResult = await FileConverterService.convertFile(
        item.file,
        item.format,
        (progress) => {
          setConversionQueue(prev => 
            prev.map(qItem => 
              qItem.id === item.id 
                ? { ...qItem, progress }
                : qItem
            )
          );
        }
      );

      if (result.success && result.data) {
        // Mark as completed
        setConversionQueue(prev => 
          prev.map(qItem => 
            qItem.id === item.id 
              ? { ...qItem, status: 'completed', progress: 100 }
              : qItem
          )
        );

        // Create download URL for the converted file
        const downloadUrl = URL.createObjectURL(result.data);

        // Add to history
        const historyItem: HistoryItem = {
          id: Date.now().toString(),
          fileName: item.file.name,
          originalFormat: item.file.name.split('.').pop() || '',
          targetFormat: item.format,
          size: item.file.size,
          date: new Date().toISOString(),
          downloadUrl: downloadUrl,
          convertedFileName: result.filename
        };

        // Store in localStorage
        const existingHistory = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
        const newHistory = [historyItem, ...existingHistory].slice(0, 50);
        localStorage.setItem('conversionHistory', JSON.stringify(newHistory));

        // Trigger update event for RecentConversions component
        window.dispatchEvent(new CustomEvent('conversionAdded'));

        showNotification(`✅ Successfully converted ${item.file.name} to ${item.format.toUpperCase()}`);
      } else {
        // Mark as failed
        setConversionQueue(prev => 
          prev.map(qItem => 
            qItem.id === item.id 
              ? { ...qItem, status: 'failed', progress: 0 }
              : qItem
          )
        );

        showNotification(`❌ Failed to convert ${item.file.name}: ${result.error}`);
      }
    } catch (error) {
      // Mark as failed
      setConversionQueue(prev => 
        prev.map(qItem => 
          qItem.id === item.id 
            ? { ...qItem, status: 'failed', progress: 0 }
            : qItem
        )
      );

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      showNotification(`❌ Conversion failed: ${errorMessage}`);
    }
  };

  const startQueueProcessing = async () => {
    if (isProcessingQueue || conversionQueue.length === 0) return;

    setIsProcessingQueue(true);
    
    const waitingItems = conversionQueue.filter(item => item.status === 'waiting');
    
    // Process items sequentially
    for (const item of waitingItems) {
      await processQueueItem(item);
    }

    setIsProcessingQueue(false);
    showNotification('All conversions completed!');
  };

  // Get available formats based on selected files
  const getAvailableFormats = (): typeof FORMAT_OPTIONS => {
    if (selectedFiles.length === 0) {
      return FORMAT_OPTIONS;
    }

    // Get formats supported by all selected files
    const supportedFormats = new Set<string>();
    
    // For the first file, get all supported target formats
    const firstFileExtension = selectedFiles[0].name.split('.').pop()?.toLowerCase() || '';
    const firstFileSupported = FileConverterService.getSupportedConversions()[firstFileExtension] || [];
    firstFileSupported.forEach(format => supportedFormats.add(format));

    // For remaining files, keep only formats that are supported by all
    for (let i = 1; i < selectedFiles.length; i++) {
      const fileExtension = selectedFiles[i].name.split('.').pop()?.toLowerCase() || '';
      const fileSupported = FileConverterService.getSupportedConversions()[fileExtension] || [];
      
      // Remove formats that are not supported by this file
      supportedFormats.forEach(format => {
        if (!fileSupported.includes(format)) {
          supportedFormats.delete(format);
        }
      });
    }

    // Filter FORMAT_OPTIONS to only include supported formats
    return FORMAT_OPTIONS.filter(option => supportedFormats.has(option.format));
  };

  const availableFormats = getAvailableFormats();
  const canAddToQueue = selectedFiles.length > 0 && selectedFormat && availableFormats.some(f => f.format === selectedFormat);
  const hasQueueItems = conversionQueue.length > 0;

  return (
    <div className="flex gap-[25px] max-w-[1400px] w-full mx-auto max-xl:flex-col">
      {/* Main Container */}
      <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[30px] p-10 flex-1 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] relative animate-[containerFloat_6s_ease-in-out_infinite] before:content-[''] before:absolute before:top-[-2px] before:left-[-2px] before:right-[-2px] before:bottom-[-2px] before:bg-gradient-to-r before:from-[#667eea] before:to-[#764ba2] before:rounded-[32px] before:z-[-1] before:opacity-30 before:animate-[borderPulse_4s_ease-in-out_infinite]">
        
        {/* Upload Workspace */}
        <div 
          className={`bg-[#1a1a2e] border-2 border-dashed rounded-[25px] p-[50px_30px] text-center cursor-pointer transition-all duration-[0.4s] cubic-bezier(0.4,0,0.2,1) mb-[30px] relative overflow-hidden group hover:border-[#667eea] hover:bg-[rgba(102,126,234,0.05)] hover:translate-y-[-5px] hover:shadow-[0_20px_40px_rgba(102,126,234,0.2)] before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-[rgba(102,126,234,0.1)] before:to-transparent before:transition-[left_0.6s_ease] hover:before:left-full ${
            dragOver ? 'border-[#667eea] bg-[rgba(102,126,234,0.05)] translate-y-[-5px]' : 'border-[rgba(255,255,255,0.1)]'
          }`}
          onClick={handleUploadClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="w-[100px] h-[100px] mx-auto mb-[25px] bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center text-[2.5rem] shadow-[0_15px_30px_rgba(102,126,234,0.3)] transition-all duration-[0.4s] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-110">
            🚀
          </div>
          <div className="text-[1.4rem] font-bold mb-[10px]">Select Files</div>
          <div className="text-[#b8b8d1] text-base">Choose multiple files or drag them here</div>
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            accept=".pdf,.doc,.docx,.txt,.rtf,.odt,.xlsx,.pptx,.jpg,.png" 
            multiple 
            onChange={handleFileSelect}
          />
        </div>

        {/* Selected Files Info */}
        {selectedFiles.length > 0 && (
          <div className="bg-[#1a1a2e] border border-[rgba(255,255,255,0.1)] rounded-[15px] p-5 mb-5 animate-[cardSlideIn_0.4s_ease]">
            <div className="flex items-center justify-between mb-[15px]">
              <div className="font-semibold text-white">Selected Files</div>
              <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-3 py-1 rounded-[12px] text-[0.85rem] font-semibold">
                {selectedFiles.length} files
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="bg-[rgba(102,126,234,0.1)] border border-[rgba(102,126,234,0.3)] rounded-[20px] px-[15px] py-[6px] text-[0.85rem] text-white flex items-center gap-2">
                  <span>{getFileIcon(file.name)}</span>
                  <span>{truncateFileName(file.name, 20)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Format Gallery */}
        <div className="mb-[30px]">
          <div className="text-[1.3rem] font-bold mb-[25px] text-center bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Select Transformation Format
          </div>
          {selectedFiles.length > 0 && availableFormats.length === 0 && (
            <div className="text-center text-[#ff5757] mb-4 p-4 bg-[rgba(255,87,87,0.1)] rounded-lg border border-[rgba(255,87,87,0.3)]">
              ⚠️ No compatible output formats available for the selected file types
            </div>
          )}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-[18px]">
            {FORMAT_OPTIONS.map((item) => {
              const isAvailable = availableFormats.some(f => f.format === item.format);
              return (
                <div 
                  key={item.format} 
                  className={`bg-[#1a1a2e] border rounded-[18px] p-[25px_20px] text-center cursor-pointer transition-all duration-[0.4s] cubic-bezier(0.4,0,0.2,1) relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#667eea] before:to-[#764ba2] before:opacity-0 before:transition-opacity before:duration-300 before:rounded-[18px] ${
                    !isAvailable 
                      ? 'opacity-40 cursor-not-allowed border-[rgba(255,255,255,0.05)]' 
                      : selectedFormat === item.format 
                        ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] border-[#667eea] translate-y-[-8px] scale-105 shadow-[0_20px_40px_rgba(102,126,234,0.4)]' 
                        : 'border-[rgba(255,255,255,0.1)] hover:border-[#667eea] hover:translate-y-[-8px] hover:shadow-[0_15px_35px_rgba(102,126,234,0.25)] hover:before:opacity-10'
                  }`}
                  onClick={() => isAvailable && handleFormatSelect(item.format)}
                  title={!isAvailable ? 'Not compatible with selected files' : `Convert to ${item.label}`}
                >
                  <span className="text-[2.2rem] mb-3 block transition-transform duration-300 hover:scale-110">{item.emoji}</span>
                  <div className="text-[0.95rem] font-bold uppercase tracking-[1px] relative z-[1]">{item.label}</div>
                  {!isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.7)] rounded-[18px]">
                      <span className="text-[1.5rem]">🚫</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Add to Queue Button */}
        <button 
          className={`border-none rounded-[16px] p-[20px_40px] text-[1.1rem] font-bold text-white cursor-pointer transition-all duration-[0.4s] cubic-bezier(0.4,0,0.2,1) w-full uppercase tracking-[1px] relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-[rgba(255,255,255,0.3)] before:to-transparent before:transition-[left_0.6s_ease] hover:before:left-full ${
            canAddToQueue
              ? 'bg-gradient-to-r from-[#f093fb] to-[#f5576c] hover:translate-y-[-5px] hover:shadow-[0_15px_35px_rgba(240,147,251,0.4)]'
              : 'bg-[rgba(255,255,255,0.1)] text-[#b8b8d1] cursor-not-allowed'
          }`}
          onClick={addToQueue}
          disabled={!canAddToQueue}
        >
          {canAddToQueue ? `Add ${selectedFiles.length} file(s) to Queue` : 'Select Files & Format First'}
        </button>
      </div>

      {/* Queue Container */}
      <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[30px] p-[30px] w-[400px] max-xl:w-full shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] relative max-h-[80vh] flex flex-col animate-[containerFloat_6s_ease-in-out_infinite] [animation-delay:0.5s] before:content-[''] before:absolute before:top-[-2px] before:left-[-2px] before:right-[-2px] before:bottom-[-2px] before:bg-gradient-to-r before:from-[#667eea] before:to-[#764ba2] before:rounded-[32px] before:z-[-1] before:opacity-30 before:animate-[borderPulse_4s_ease-in-out_infinite]">
        
        {/* Queue Header */}
        <div className="flex items-center justify-between mb-[25px] pb-5 border-b border-[rgba(255,255,255,0.1)]">
          <div className="text-[1.5rem] font-bold bg-gradient-to-r from-[#f093fb] to-[#f5576c] bg-clip-text text-transparent">
            Conversion Queue
          </div>
          <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-[15px] py-[5px] rounded-[20px] text-[0.9rem] font-semibold">
            {conversionQueue.length} items
          </div>
        </div>

        {/* Queue List */}
        <div className="flex-1 overflow-y-auto pr-[10px] mb-5 scrollbar-thin scrollbar-track-[rgba(255,255,255,0.05)] scrollbar-thumb-gradient-primary">
          {conversionQueue.length === 0 ? (
            <div className="text-center py-10 text-[#b8b8d1]">
              <div className="text-[3rem] mb-[15px] opacity-50">📭</div>
              <div>Queue is empty</div>
              <div className="text-[0.9rem] mt-[5px]">Add files to start converting</div>
            </div>
          ) : (
            <div className="space-y-3">
              {conversionQueue.map((item) => (
                <div key={item.id} className="bg-[#1a1a2e] border border-[rgba(255,255,255,0.1)] rounded-[15px] p-[15px] transition-all duration-300 relative overflow-hidden hover:translate-x-[-5px] hover:border-[#667eea] before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-[rgba(102,126,234,0.1)] before:to-transparent before:transition-[left_0.6s_ease] hover:before:left-full">
                  <div className="flex items-center justify-between mb-[10px]">
                    <div className="font-semibold text-[0.95rem] flex-1 mr-[10px] overflow-hidden text-ellipsis whitespace-nowrap flex items-center gap-2">
                      <span>{getFileIcon(item.file.name)}</span>
                      <span>{truncateFileName(item.file.name, 25)}</span>
                    </div>
                    <div className="flex items-center gap-[10px]">
                      <span className={`px-3 py-1 rounded-[10px] text-[0.75rem] font-semibold uppercase ${
                        item.status === 'waiting' ? 'bg-[rgba(255,255,255,0.1)] text-[#b8b8d1]' :
                        item.status === 'processing' ? 'bg-gradient-to-r from-[#fa709a] to-[#fee140] text-white animate-[statusPulse_1.5s_ease-in-out_infinite]' :
                        item.status === 'completed' ? 'bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {item.status}
                      </span>
                      {item.status === 'waiting' && !isProcessingQueue && (
                        <button 
                          onClick={() => removeFromQueue(item.id)}
                          className="w-[30px] h-[30px] bg-[rgba(255,87,87,0.1)] border border-[rgba(255,87,87,0.3)] rounded-full text-[#ff5757] cursor-pointer flex items-center justify-center transition-all duration-300 text-[0.9rem] hover:bg-[rgba(255,87,87,0.2)] hover:scale-110"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[0.85rem] text-[#b8b8d1]">
                    <div className="flex items-center gap-[5px]">
                      <span>→</span>
                      <span>{item.format.toUpperCase()}</span>
                    </div>
                    <div>{formatFileSize(item.file.size)}</div>
                  </div>
                  {item.status === 'processing' && (
                    <div className="mt-[10px]">
                      <div className="h-1 bg-[rgba(255,255,255,0.05)] rounded-[2px] overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#fa709a] to-[#fee140] rounded-[2px] transition-[width] duration-300"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Queue Actions */}
        <div className="flex gap-[10px]">
          <button 
            className={`flex-1 p-[12px_20px] border-none rounded-[12px] text-[0.95rem] font-semibold cursor-pointer transition-all duration-300 uppercase tracking-[0.5px] ${
              hasQueueItems && !isProcessingQueue
                ? 'bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-white hover:translate-y-[-2px] hover:shadow-[0_10px_20px_rgba(79,172,254,0.3)]'
                : 'bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-white opacity-50 cursor-not-allowed'
            }`}
            onClick={startQueueProcessing}
            disabled={!hasQueueItems || isProcessingQueue}
          >
            {isProcessingQueue ? 'Processing...' : 'Start All'}
          </button>
          <button 
            className={`flex-1 p-[12px_20px] border border-[rgba(255,87,87,0.3)] rounded-[12px] text-[0.95rem] font-semibold cursor-pointer transition-all duration-300 uppercase tracking-[0.5px] bg-[rgba(255,87,87,0.1)] text-[#ff5757] ${
              hasQueueItems && !isProcessingQueue
                ? 'hover:bg-[rgba(255,87,87,0.2)]'
                : 'opacity-50 cursor-not-allowed'
            }`}
            onClick={clearQueue}
            disabled={!hasQueueItems || isProcessingQueue}
          >
            Clear Queue
          </button>
        </div>
      </div>
    </div>
  );
}