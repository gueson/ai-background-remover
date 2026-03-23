"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="flex justify-between items-center py-6">
      <div className="text-2xl font-bold text-gray-900">
        <Link href="/">AI Background Remover</Link>
      </div>
      <div className="flex gap-4">
        <Button variant="ghost" size="sm">Features</Button>
        <Button variant="ghost" size="sm">Pricing</Button>
        <Button variant="ghost" size="sm">API</Button>
        <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
          Sign In
        </Button>
      </div>
    </header>
  );
}