import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: string;
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
        <div className="text-red-500 text-lg">{error}</div>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pools
          </Button>
        </Link>
      </div>
    </div>
  );
}