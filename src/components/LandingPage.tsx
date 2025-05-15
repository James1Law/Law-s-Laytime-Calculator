import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ClockCircleOutlined, CalculatorOutlined, FileTextOutlined } from '@ant-design/icons';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col">
      <div className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center mb-16 sm:mb-24">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Professional Laytime & Demurrage Calculator
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Streamline voyage calculations with accurate time tracking and PDF-ready reporting.
            </p>
            <Button 
              type="primary" 
              size="large"
              onClick={() => navigate('/new-calculation')}
              className="h-12 px-8 text-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              Start a New Calculation
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col items-center text-center">
                <ClockCircleOutlined className="text-3xl text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Accurate Laytime</h3>
                <p className="text-gray-600">
                  Track and account for every port call and event.
                </p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col items-center text-center">
                <CalculatorOutlined className="text-3xl text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Demurrage Analysis</h3>
                <p className="text-gray-600">
                  Automatically calculate time lost and costs.
                </p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col items-center text-center">
                <FileTextOutlined className="text-3xl text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-3 text-gray-900">PDF Reports</h3>
                <p className="text-gray-600">
                  Generate professional reports for sharing and record-keeping.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="border-t border-gray-200 py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-center text-sm text-gray-500">
            © 2025 Law's Laytime Calculator. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 