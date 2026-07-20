import { toEmbedUrl } from "@/lib/markdown";
import type { Video } from "@/lib/types";

export default function VideoPlayer({ video }: { video: Video }) {
  return (
    <div className="my-4">
      {video.title && (
        <div className="text-sm font-medium mb-2 flex items-center gap-1.5">
          🎬 {video.title}
        </div>
      )}
      <div className="relative w-full max-w-md mx-auto overflow-hidden rounded-xl border bg-black aspect-video">
        {video.kind === "upload" ? (
          <video
            src={video.url}
            controls
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <iframe
            src={toEmbedUrl(video.url)}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.title || "Video"}
          />
        )}
      </div>
    </div>
  );
}
