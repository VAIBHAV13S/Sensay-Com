"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

export function StatusIndicator() {
  const [status, setStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/sensay/status');
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error('Status check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        Checking...
      </Badge>
    );
  }

  if (!status || status.status !== 'operational') {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        Offline
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="flex items-center gap-1 border-green-400 text-green-600">
      <CheckCircle className="w-3 h-3" />
      Online
    </Badge>
  );
}
