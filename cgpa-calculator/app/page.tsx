'use client'

import { useState, useEffect } from 'react'
import Header from './components/Header'
import { SearchForm } from './components/SearchForm'
import { ResultDisplay } from './components/ResultDisplay'
import { HowToUse } from './components/HowToUse'
import { CalculationSystem } from './components/CalculationSystem'
import { Footer } from './components/Footer'
import { ResultData, CourseRow } from './types'
import { toast } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'
import { calculateSemesterCGPA, groupBySemester, resetOverallCGPA } from './utils/calculations'
import { LoadingSpinner } from './components/LoadingSpinner'

export default function Home() {
  const [regNumber, setRegNumber] = useState('')
  const [result, setResult] = useState<ResultData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const [includedCourses, setIncludedCourses] = useState<CourseRow[]>([])
  const [expandedSemesters, setExpandedSemesters] = useState<string[]>([])
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const regNumberPattern = /^\d{4}-ag-\d{1,6}$/i;
    if (!regNumberPattern.test(regNumber)) {
      toast.error('Please enter a valid registration number (e.g., 2022-ag-7693)');
      return;
    }

    setLoading(true)
    setError('')
    setProgress(0)

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + 10))
    }, 300)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.uafcalculator.live/api";
      const response = await fetch(`${apiUrl}/result?reg_number=${regNumber}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json()

      if (data.status === 'success') {
        setResult(data.data)
        setExpandedSemesters([])
        toast.success('Results loaded successfully!')
      } else {
        setError('No results found for this registration number. Please check the number and try again.')
        toast.error('No results found')
      }
    } catch (err) {
      const errorMessage = 'Unable to fetch results. This could be due to server maintenance or network issues.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      clearInterval(progressInterval)
      setProgress(100)
      setTimeout(() => setLoading(false), 500)
    }
  }

  useEffect(() => {
    if (result) {
      resetOverallCGPA()
      setIncludedCourses(result.result_table.rows)
    }
  }, [result])

  const handleRemoveCourse = (courseCode: string) => {
    setIncludedCourses(prevCourses => {
      const newCourses = prevCourses.filter(course => course["Course Code"] !== courseCode);
      resetOverallCGPA();
      const groupedSemesters = groupBySemester(newCourses);
      Object.values(groupedSemesters).forEach(semesterCourses => {
        calculateSemesterCGPA(semesterCourses);
      });
      return newCourses;
    });
  }

  const handleAddCourse = (newCourse: CourseRow) => {
    setIncludedCourses(prevCourses => {
      const newCourses = [...prevCourses, newCourse];
      resetOverallCGPA();
      const groupedSemesters = groupBySemester(newCourses);
      Object.values(groupedSemesters).forEach(semesterCourses => {
        calculateSemesterCGPA(semesterCourses);
      });
      return newCourses;
    });
  };

  const toggleSemesterExpansion = (semester: string) => {
    if (windowWidth < 1024) {
      setExpandedSemesters(prev =>
        prev.includes(semester)
          ? prev.filter(s => s !== semester)
          : [...prev, semester]
      )
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'UAF CGPA Calculator',
    description: 'Calculate your CGPA for University of Agriculture Faisalabad (UAF) with our easy-to-use calculator.',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: 'UAF CGPA Calculator',
    },
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Header />
        <SearchForm
          regNumber={regNumber}
          loading={loading}
          onSubmit={handleSubmit}
          onRegNumberChange={setRegNumber}
          error={error}
          onRetry={() => {
            setError('')
            handleSubmit(new Event('submit') as any)
          }}
        />
        
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingSpinner progress={progress} />
          ) : (
            result && (
              <ResultDisplay
                result={result}
                includedCourses={includedCourses}
                expandedSemesters={expandedSemesters}
                windowWidth={windowWidth}
                onRemoveCourse={handleRemoveCourse}
                onAddCourse={handleAddCourse}
                toggleSemesterExpansion={toggleSemesterExpansion}
              />
            )
          )}
        </AnimatePresence>
        
        <HowToUse />
        <CalculationSystem />
        <Footer />
      </div>
    </div>
  )
}
