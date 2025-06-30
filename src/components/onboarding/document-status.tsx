import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle, Eye } from "lucide-react"

interface DocumentStatusProps {
  status: string
}

export function DocumentStatus({ status }: DocumentStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          variant: "secondary" as const,
          icon: <Clock className="w-3 h-3" />,
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        }
      case "in_review":
        return {
          label: "In Review",
          variant: "secondary" as const,
          icon: <Eye className="w-3 h-3" />,
          className: "bg-blue-100 text-blue-800 border-blue-200",
        }
      case "complete":
        return {
          label: "Complete",
          variant: "secondary" as const,
          icon: <CheckCircle className="w-3 h-3" />,
          className: "bg-green-100 text-green-800 border-green-200",
        }
      case "action_required":
        return {
          label: "Action Required",
          variant: "destructive" as const,
          icon: <AlertCircle className="w-3 h-3" />,
          className: "bg-red-100 text-red-800 border-red-200",
        }
      default:
        return {
          label: "Not Uploaded",
          variant: "outline" as const,
          icon: null,
          className: "bg-gray-100 text-gray-600 border-gray-200",
        }
    }
  }

  const config = getStatusConfig()

  return (
    <Badge variant={config.variant} className={`ml-2 text-xs ${config.className}`}>
      {config.icon && <span className="mr-1">{config.icon}</span>}
      {config.label}
    </Badge>
  )
}
