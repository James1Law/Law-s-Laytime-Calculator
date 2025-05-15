import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Law's Laytime Calculator
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The professional tool for accurate laytime and demurrage calculations. 
            Streamline your maritime operations with precise time tracking and cost analysis.
          </p>
          <Button 
            type="primary" 
            size="large"
            onClick={() => navigate('/new-calculation')}
            className="h-12 px-8 text-lg"
          >
            Start a New Calculation
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Accurate Calculations</h3>
            <p className="text-gray-600">
              Precise laytime tracking with support for multiple ports and events.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Demurrage Analysis</h3>
            <p className="text-gray-600">
              Automatic demurrage cost calculations based on your specified rates.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-3">PDF Reports</h3>
            <p className="text-gray-600">
              Generate professional PDF reports for your calculations instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 