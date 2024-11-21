'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { parseDepartments } from '../utils/parseDepartments'
import { Department } from '../types/department'
import { Mail, Copy, Search, MapPin, Clock } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { cn } from '@/lib/utils'

export default function DepartmentDashboard() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showStatenIslandOnly, setShowStatenIslandOnly] = useState(false)
  const [showEndTimeOnly, setShowEndTimeOnly] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetch('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Departments-P2b6mIc6iUVJKvXqTpuDGv6bmpYI2E.txt')
      .then(response => response.text())
      .then(data => {
        const parsedDepartments = parseDepartments(data)
        setDepartments(parsedDepartments)
      })
  }, [])

  const filteredDepartments = departments.filter(dept =>
    (showStatenIslandOnly ? dept.isStatenIsland : true) &&
    (showEndTimeOnly ? dept.hasEndTime : true) &&
    (dept.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.info.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const copyEmails = (emails: string[]) => {
    navigator.clipboard.writeText(emails.join(', '))
    toast({
      title: "Emails copied",
      description: "The email addresses have been copied to your clipboard.",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Departments</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search departments or information..."
                className="pl-10 h-12"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowStatenIslandOnly(!showStatenIslandOnly)}
                className={cn(
                  "h-12 gap-2",
                  showStatenIslandOnly 
                    ? "bg-orange-500 hover:bg-orange-600" 
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                )}
              >
                <MapPin className="h-4 w-4" />
                Staten Island
                {showStatenIslandOnly && (
                  <span className="ml-2 text-xs bg-orange-400 text-white px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </Button>
              <Button
                onClick={() => setShowEndTimeOnly(!showEndTimeOnly)}
                className={cn(
                  "h-12 gap-2",
                  showEndTimeOnly 
                    ? "bg-purple-500 hover:bg-purple-600" 
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                )}
              >
                <Clock className="h-4 w-4" />
                End Time Jobs
                {showEndTimeOnly && (
                  <span className="ml-2 text-xs bg-purple-400 text-white px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* End Time Notice */}
        {showEndTimeOnly && (
          <div className="mb-6 bg-purple-100 border-l-4 border-purple-500 p-4 rounded-r">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Clock className="h-5 w-5 text-purple-500 mt-0.5" />
              </div>
              <div className="ml-3">
                <h3 className="text-purple-800 font-medium">End Time Jobs Notice</h3>
                <p className="text-purple-700 mt-1 text-sm">
                  For department 653, the job will always end at the scheduled end time. 
                  Remember to call and inform the spotter 10 minutes before the end time.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Staten Island Notice */}
        {showStatenIslandOnly && (
          <div className="mb-6 bg-orange-100 border-l-4 border-orange-500 p-4 rounded-r">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <MapPin className="h-5 w-5 text-orange-500 mt-0.5" />
              </div>
              <div className="ml-3">
                <h3 className="text-orange-800 font-medium">Staten Island Notice</h3>
                <p className="text-orange-700 mt-1 text-sm">
                  We are NOT sending re-route emails to Staten Island jobs. This includes not only SI Overhead jobs, but all other SI departments as well.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Departments Grid */}
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDepartments.map((dept) => (
              <Dialog key={dept.id}>
                <DialogTrigger asChild>
                  <Card 
                    className={cn(
                      "cursor-pointer hover:shadow-lg transition-all duration-200",
                      dept.isStatenIsland 
                        ? "border-orange-400 hover:border-orange-500 bg-orange-50"
                        : dept.hasEndTime
                        ? "border-purple-400 hover:border-purple-500 bg-purple-50"
                        : "hover:border-blue-200"
                    )}
                  >
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-xl font-bold",
                            dept.isStatenIsland ? "text-orange-600" : 
                            dept.hasEndTime ? "text-purple-600" : "text-blue-600"
                          )}>
                            Department {dept.id}
                          </span>
                          {dept.isStatenIsland && (
                            <span className="text-xs bg-orange-200 text-orange-700 px-2 py-1 rounded-full">
                              Staten Island
                            </span>
                          )}
                          {dept.hasEndTime && (
                            <span className="text-xs bg-purple-200 text-purple-700 px-2 py-1 rounded-full">
                              End Time
                            </span>
                          )}
                        </div>
                        {dept.emails.length > 0 && (
                          <Mail className={cn(
                            dept.isStatenIsland ? "text-orange-500" : 
                            dept.hasEndTime ? "text-purple-500" : "text-blue-500"
                          )} size={20} />
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className={cn(
                        "line-clamp-3 text-sm",
                        dept.isStatenIsland ? "text-orange-700" : "text-gray-600"
                      )}>
                        {dept.info}
                      </p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className={cn(
                  "sm:max-w-[600px]",
                  dept.isStatenIsland && "border-orange-400"
                )}>
                  <DialogHeader>
                    <DialogTitle className={cn(
                      "text-2xl font-bold",
                      dept.isStatenIsland ? "text-orange-600" : "text-blue-600"
                    )}>
                      Department {dept.id}
                      {dept.isStatenIsland && (
                        <span className="ml-2 text-sm bg-orange-200 text-orange-700 px-2 py-1 rounded-full">
                          Staten Island
                        </span>
                      )}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <div className="prose max-w-none">
                      {dept.info.split('\n\n').map((paragraph, index) => (
                        <div key={index} className="mb-6">
                          {paragraph.split('\n').map((line, lineIndex) => (
                            <p key={lineIndex} className="text-gray-700 mb-2">
                              {line.split(' ').map((word, wordIndex) => {
                                if (
                                  word.includes('@') || 
                                  /^[A-Z][a-z]+(?:\s[A-Z][a-z]+)*$/.test(word) || // Names
                                  word.match(/^\d+(?:\.\d+)?(?:ft|feet|')/) || // Measurements
                                  word.toUpperCase() === word && word.length > 1 // ALL CAPS words
                                ) {
                                  return (
                                    <span key={wordIndex} className="font-medium text-blue-600">
                                      {word}{' '}
                                    </span>
                                  );
                                }
                                return word + ' ';
                              })}
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                    {dept.emails.length > 0 && (
                      <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-3">Email Addresses:</h3>
                        <ul className="space-y-2 mb-4">
                          {dept.emails.map((email, index) => (
                            <li key={index} className="flex items-center text-gray-600 hover:text-blue-600">
                              <Mail className="h-4 w-4 mr-2 text-blue-500" />
                              <span className="font-medium">{email}</span>
                            </li>
                          ))}
                        </ul>
                        <Button 
                          onClick={() => copyEmails(dept.emails)}
                          className="w-full justify-center bg-blue-600 hover:bg-blue-700"
                        >
                          <Copy className="mr-2 h-4 w-4" /> Copy All Emails
                        </Button>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

