import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 오류 상태를 업데이트하여 폴백 UI를 렌더링하도록 함
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 오류 로깅 (예: 서버로 전송)
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 폴백 UI 렌더링
      return <h1>문제가 발생했습니다. 잠시 후 다시 시도해주세요.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
