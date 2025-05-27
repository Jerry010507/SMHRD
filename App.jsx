import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RequestForm from './components/requests/RequestForm';
import CameraCapture from './components/attendance/CameraCapture';
import Management from './components/management/Management';

// ✅ ErrorBoundary 컴포넌트 정의
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("🧨 에러 발생:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <h2 style={{ padding: "20px", textAlign: "center", color: "red" }}>앱에서 문제가 발생했습니다.</h2>;
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/attendance" />} />
            <Route path="/attendance" element={<CameraCapture />} />
            <Route path="/request" element={<RequestForm />} />
            <Route path="/manage" element={<Management />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
