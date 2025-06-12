'use client';

import { useState, useEffect } from 'react';

interface HistoryItem {
  id: string;
  fileName: string;
  originalFormat: string;
  targetFormat: string;
  size: number;
  date: string;
  downloadUrl: string;
}

export default function RecentConversions() {
  const [conversionHistory, setConversionHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
    setConversionHistory(history);
  }, []);

  // Listen for storage changes to update in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
      setConversionHistory(history);
    };

    // Listen for custom events when new conversions are added
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events from our app
    const handleConversionAdded = () => {
      const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
      setConversionHistory(history);
    };

    window.addEventListener('conversionAdded', handleConversionAdded);

    // Poll for changes every 2 seconds as a fallback
    const interval = setInterval(handleStorageChange, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('conversionAdded', handleConversionAdded);
      clearInterval(interval);
    };
  }, []);

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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleDownload = (item: HistoryItem) => {
    // For now, just show a notification
    // In a real implementation, this would trigger the actual download
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = `Download started for ${item.fileName}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all conversion history?')) {
      localStorage.removeItem('conversionHistory');
      setConversionHistory([]);
      
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.textContent = 'History cleared';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[30px] p-10 mb-[30px]">
      <div className="flex items-center justify-between mb-[30px]">
        <h2 className="text-[1.8rem] font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
          Recent Conversions
        </h2>
        {conversionHistory.length > 0 && (
          <button 
            onClick={clearHistory}
            className="bg-[rgba(255,87,87,0.1)] border border-[rgba(255,87,87,0.3)] text-[#ff5757] px-5 py-2 rounded-[20px] font-semibold cursor-pointer transition-all duration-300 hover:bg-[rgba(255,87,87,0.2)]"
          >
            Clear History
          </button>
        )}
      </div>
      
      {conversionHistory.length === 0 ? (
        <div className="text-center py-[60px_20px] text-[#b8b8d1]">
          <div className="text-[3rem] mb-[15px] opacity-50">📂</div>
          <div>No recent conversions</div>
          <div className="text-[0.9rem] mt-[5px]">Start converting files to see them here</div>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
          {conversionHistory.map((item) => (
            <div key={item.id} className="bg-[#1a1a2e] border border-[rgba(255,255,255,0.1)] rounded-[15px] p-5 transition-all duration-300 hover:translate-y-[-5px] hover:border-[#667eea] hover:shadow-[0_10px_25px_rgba(102,126,234,0.2)]">
              <div className="flex items-center justify-between mb-[15px]">
                <div className="font-semibold text-base flex-1 mr-[10px] overflow-hidden text-ellipsis whitespace-nowrap flex items-center gap-2" title={item.fileName}>
                  <span>{getFileIcon(item.fileName)}</span>
                  <span>{truncateFileName(item.fileName, 25)}</span>
                </div>
              </div>
              <div className="text-[0.85rem] text-[#b8b8d1] mb-[15px]">
                {formatDate(item.date)}
              </div>
              <div className="flex items-center gap-[10px] text-[0.9rem] text-[#b8b8d1] mb-[15px]">
                <span>{item.originalFormat.toUpperCase()}</span>
                <span>→</span>
                <span>{item.targetFormat.toUpperCase()}</span>
                <span>•</span>
                <span>{formatFileSize(item.size)}</span>
              </div>
              <button 
                onClick={() => handleDownload(item)}
                className="bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-white border-none px-4 py-2 rounded-[12px] text-[0.85rem] font-semibold cursor-pointer transition-all duration-300 w-full hover:translate-y-[-2px] hover:shadow-[0_5px_15px_rgba(79,172,254,0.3)]"
              >
                Download {item.targetFormat.toUpperCase()}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}