'use client'

import { useState } from 'react'

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ msg: string; code: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

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
    <main className="w-full h-screen max-h-screen flex items-center justify-center p-4 md:p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 overflow-y-auto">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-10 my-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            COVID-19 Detection
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Upload an X-ray image of the chest for COVID-19 detection
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column - Upload and Controls */}
          <div className="flex flex-col gap-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute w-0 h-0 opacity-0 overflow-hidden -z-10"
                  disabled={loading}
                />
                <label
                  htmlFor="file-upload"
                  className={`block p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-300 bg-blue-50 text-blue-700 font-medium text-base border-blue-300 ${
                    loading 
                      ? 'opacity-60 cursor-not-allowed' 
                      : 'hover:bg-blue-100 hover:border-blue-400 hover:shadow-md'
                  }`}
                >
                  {file ? (
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm text-gray-600 break-all">{file.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span>Click to upload or drag and drop</span>
                      <span className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB</span>
                    </div>
                  )}
                </label>
              </div>

              <div className="flex gap-4 flex-col sm:flex-row">
                <button
                  type="submit"
                  disabled={!file || loading}
                  className={`flex-1 px-6 py-3.5 text-base font-semibold rounded-lg transition-all duration-300 ${
                    !file || loading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Detect COVID-19'
                  )}
                </button>
                
                {(file || result) && (
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={loading}
                    className={`px-6 py-3.5 text-base font-semibold rounded-lg transition-all duration-300 ${
                      loading
                        ? 'bg-gray-200 text-gray-500 opacity-60 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:shadow-md'
                    }`}
                  >
                    Reset
                  </button>
                )}
              </div>
            </form>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {result && (
              <div
                className={`p-6 rounded-xl border-l-4 transition-all duration-300 ${
                  result.code === 1
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-green-50 border-green-500'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`text-4xl ${result.code === 1 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {result.code === 1 ? '⚠️' : '✅'}
                  </div>
                  <div className="flex-1">
                    <h2
                      className={`text-2xl font-bold mb-2 ${
                        result.code === 1 ? 'text-yellow-800' : 'text-green-800'
                      }`}
                    >
                      {result.code === 1 ? 'COVID-19 Detected' : 'No COVID-19 Detected'}
                    </h2>
                    <p
                      className={`text-lg font-medium ${
                        result.code === 1 ? 'text-yellow-700' : 'text-green-700'
                      }`}
                    >
                      {result.msg}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Preview */}
          <div className="flex flex-col gap-6">
            {preview ? (
              <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-xl p-4 min-h-[300px]">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full max-h-[500px] rounded-lg shadow-lg object-contain"
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-xl p-8 min-h-[300px] border-2 border-dashed border-gray-300">
                <div className="text-center text-gray-400">
                  <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg font-medium">Image Preview</p>
                  <p className="text-sm mt-2">Your uploaded X-ray will appear here</p>
                </div>
              </div>
            )}

            {/* Info Section */}
            <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-600">
              <p className="mb-3 font-semibold text-gray-800">
                <strong>⚠️ Important Note:</strong>
              </p>
              <p className="mb-4 leading-relaxed">
                This tool is for educational purposes only. Always consult a healthcare professional for medical diagnosis.
              </p>
              <div className="pt-4 border-t border-gray-200">
                <p className="mb-2 font-semibold text-gray-800">Try with sample images:</p>
                <div className="flex flex-col gap-2">
                  <a
                    href="https://github.com/arihant1805/COVID-Detection/blob/master/SampleImage.jpeg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors"
                  >
                    Sample Image
                  </a>
                  <a
                    href="https://www.kaggle.com/datasets/khoongweihao/covid19-xray-dataset-train-test-sets"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors"
                  >
                    Kaggle Dataset
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

