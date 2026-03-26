export function cn(...inputs: (string | undefined | null | false)[]) {
    return inputs.filter(Boolean).join(" ");
}

export function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
    });
}

export function formatRelativeTime(date: Date | string): string {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(date);
}

export function truncate(str: string, length: number): string {
    if (str.length <= length) return str;
    return str.substring(0, length) + "...";
}

export function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
}

export function getStatusColor(status: string): string {
    switch (status) {
      case "ACTIVE":
              return "bg-green-500/20 text-green-400 border-green-500/30";
      case "DRAFT":
              return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "ARCHIVED":
              return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
              return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
}

export function getModelDisplayName(model: string): string {
    const models: Record<string, string> = {
          "gpt-4": "GPT-4",
          "gpt-3.5-turbo": "GPT-3.5 Turbo",
          "claude-3-opus": "Claude 3 Opus",
          "claude-3-sonnet": "Claude 3 Sonnet",
    };
    return models[model] || model;
}

export async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, options);
    if (!res.ok) {
          const error = await res.json().catch(() => ({ error: "An error occurred" }));
          throw new Error(error.error || "An error occurred");
    }
    return res.json();
}
