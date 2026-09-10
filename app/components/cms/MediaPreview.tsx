import { Download, ExternalLink } from "lucide-react";
import Image from "next/image";

export type MediaType = "office" | "pdf" | "image" | "video" | "other";

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: MediaType;
  size?: number;
}

interface MediaPreviewProps {
  file: MediaFile;
}

export default function MediaPreview({ file }: MediaPreviewProps) {
  const formatSize = (bytes?: number) => {
    if (!bytes) return "";
    const mb = bytes / (1024 * 1024);
    return `(${mb.toFixed(2)} MB)`;
  };

  const renderContent = () => {
    switch (file.type) {
      case "image":
        return (
          <div className="relative w-full h-[400px] bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={file.url} 
              alt={file.name}
              className="w-full h-full object-contain"
            />
          </div>
        );
      case "video":
        return (
          <div className="w-full rounded-lg overflow-hidden border border-slate-200 bg-black">
            <video controls className="w-full max-h-[500px]">
              <source src={file.url} />
              Trình duyệt của bạn không hỗ trợ thẻ video.
            </video>
          </div>
        );
      case "pdf":
        return (
          <div className="w-full h-[600px] border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
            <iframe 
              src={`${file.url}#toolbar=0`} 
              className="w-full h-full border-none"
              title={file.name}
            />
          </div>
        );
      case "office":
        // For Office Online Viewer, the URL must be publicly accessible and encoded.
        const encodedUrl = encodeURIComponent(file.url);
        const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`;
        return (
          <div className="w-full h-[600px] border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
            <iframe 
              src={officeUrl} 
              className="w-full h-full border-none"
              title={file.name}
            />
          </div>
        );
      default:
        return (
          <div className="w-full p-8 border border-slate-200 rounded-lg bg-slate-50 flex flex-col items-center justify-center text-slate-500">
            <p>Định dạng tệp không được hỗ trợ xem trước.</p>
          </div>
        );
    }
  };

  return (
    <div className="mb-8 group">
      <div className="flex items-center justify-between mb-3 px-1">
        <h4 className="font-semibold text-slate-800 text-sm md:text-base truncate mr-4">
          {file.name} <span className="text-slate-400 font-normal">{formatSize(file.size)}</span>
        </h4>
        <div className="flex gap-2 shrink-0">
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Mở tab mới"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href={file.url}
            download={file.name}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Tải xuống"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>
      {renderContent()}
    </div>
  );
}

