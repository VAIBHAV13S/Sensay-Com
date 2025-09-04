"use client";

import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useSensayStatus } from "@/hooks/useSensay";

export function StatusIndicator() {
  const { data: status, isLoading, error } = useSensayStatus();

  if (isLoading) {
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        Checking...
      </Badge>
    );
  }

  if (error || !status) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        Offline
      </Badge>
    );
  }

  if (status.status === 'operational' && status.replicasInitialized) {
    return (
      <Badge variant="outline" className="flex items-center gap-1 border-green-400 text-green-600">
        <CheckCircle className="w-3 h-3" />
        Online
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="flex items-center gap-1 border-yellow-400 text-yellow-600">
      <AlertCircle className="w-3 h-3" />
      Starting...
    </Badge>
  );
}
