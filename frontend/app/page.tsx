'use client'

import { useState, useRef } from 'react'

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ msg: string; code: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const detectorRef = useRef<HTMLDivElement>(null)

  const scrollToDetector = () => {
    detectorRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResult(null)
      setError(null)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file) {
      setError('Please select a file first')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Use local backend by default, or override with environment variable
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      
      const response = await fetch(`${apiUrl}/predict`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to process the image')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing the uploaded file.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Hero Section */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        
        <div className="container mx-auto px-4 z-10 text-center">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium tracking-wide animate-fade-in-up">
            AI-POWERED DIAGNOSTICS
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 leading-tight animate-fade-in-up delay-100">
            Advanced COVID-19 <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Detection System
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
            Utilizing state-of-the-art deep learning algorithms to analyze chest X-ray images for rapid and accurate COVID-19 screening assistance.
          </p>
          
          <button 
            onClick={scrollToDetector}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-200 bg-slate-900 rounded-full hover:bg-slate-800 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 animate-fade-in-up delay-300"
          >
            Start Diagnosis
            <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-slate-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Detector Section */}
      <section ref={detectorRef} className="py-24 bg-slate-50 min-h-screen flex items-center">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              
              {/* Left Panel: Upload */}
              <div className="p-8 md:p-12 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-slate-100">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Upload X-Ray</h2>
                  <p className="text-slate-500">Select a chest X-ray image to begin the analysis.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="relative group">
                    <input
                      type="file"
                      id="file-upload"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={loading}
                    />
                    <div className={`
                      border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300
                      ${file 
                        ? 'border-blue-500 bg-blue-50/50' 
                        : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                      }
                      ${loading ? 'opacity-50' : ''}
                    `}>
                      {file ? (
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="font-medium text-slate-900 truncate max-w-xs">{file.name}</p>
                          <p className="text-sm text-slate-500 mt-1">Click to change file</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <p className="font-medium text-slate-900">Drop your image here</p>
                          <p className="text-sm text-slate-500 mt-1">or click to browse</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={!file || loading}
                      className={`flex-1 py-4 px-6 rounded-xl font-semibold text-white shadow-lg transition-all duration-200
                        ${!file || loading
                          ? 'bg-slate-300 cursor-not-allowed shadow-none'
                          : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200 hover:-translate-y-0.5'
                        }
                      `}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Analyzing...
                        </span>
                      ) : 'Analyze Image'}
                    </button>
                    
                    {(file || result) && (
                      <button
                        type="button"
                        onClick={handleReset}
                        disabled={loading}
                        className="px-6 py-4 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </form>

                {error && (
                  <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-start gap-3">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}
              </div>

              {/* Right Panel: Preview & Results */}
              <div className="bg-slate-50/50 p-8 md:p-12 flex flex-col">
                <div className="flex-1 flex flex-col">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Analysis Result</h3>
                  
                  {result ? (
                    <div className="flex-1 flex flex-col gap-6 animate-fade-in">
                      <div className={`
                        p-6 rounded-2xl border flex items-center gap-5 shadow-sm
                        ${result.code === 1 
                          ? 'bg-amber-50 border-amber-200' 
                          : 'bg-emerald-50 border-emerald-200'
                        }
                      `}>
                        <div className={`
                          w-16 h-16 rounded-full flex items-center justify-center text-3xl flex-shrink-0
                          ${result.code === 1 ? 'bg-amber-100' : 'bg-emerald-100'}
                        `}>
                          {result.code === 1 ? '⚠️' : '🛡️'}
                        </div>
                        <div>
                          <h4 className={`text-xl font-bold ${result.code === 1 ? 'text-amber-900' : 'text-emerald-900'}`}>
                            {result.code === 1 ? 'COVID-19 Detected' : 'Negative for COVID-19'}
                          </h4>
                          <p className={`text-sm mt-1 ${result.code === 1 ? 'text-amber-700' : 'text-emerald-700'}`}>
                            {result.msg}
                          </p>
                        </div>
                      </div>

                      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white">
                        <img 
                          src={preview!} 
                          alt="Analyzed X-Ray" 
                          className="w-full h-auto object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <p className="text-white text-sm font-medium">Analyzed Image Source</p>
                        </div>
                      </div>
                    </div>
                  ) : preview ? (
                    <div className="flex-1 flex items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                      <img 
                        src={preview} 
                        alt="Preview" 
                        className="max-h-[400px] object-contain rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                      <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p>No image selected</p>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200">
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-slate-700 mb-3">Try with sample images:</p>
                    <div className="flex flex-col gap-2">
                      <a
                        href="https://github.com/arihant1805/COVID-Detection/blob/master/SampleImage.jpeg"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Download Sample Image
                      </a>
                      <a
                        href="https://www.kaggle.com/datasets/khoongweihao/covid19-xray-dataset-train-test-sets"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Kaggle Dataset
                      </a>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 text-center">
                    Disclaimer: This tool is for educational purposes only and should not be used as a substitute for professional medical diagnosis.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
