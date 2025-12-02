import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { TokenDashboard } from "./components/TokenDashboard";
import { PromptToolSection } from "./components/PromptToolSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { DashboardPreviewSection } from "./components/DashboardPreviewSection";
import { PricingSection } from "./components/PricingSection";
import { FeedbackSection } from "./components/FeedbackSection";
import { Footer } from "./components/Footer";
import { InteractiveSheetEditor } from "./components/InteractiveSheetEditor";
import { ChartViewer } from "./components/ChartViewer";
import { FullScreenSheetPreview } from "./components/FullScreenSheetPreview";
import { useEffect, useState } from "react";

export default function App() {
  const [editorData, setEditorData] = useState<{ data: any[]; columns: string[] } | null>(null);
  const [chartViewerData, setChartViewerData] = useState<{ charts: Array<{ chartUrl: string; chartType: string; title?: string }> } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const checkRoute = () => {
      // Check if we're on the preview page
      if (window.location.pathname === '/preview' || window.location.search.includes('preview=true')) {
        const previewDataStr = sessionStorage.getItem('previewData');
        if (previewDataStr) {
          setShowPreview(true);
          return;
        }
      } else {
        setShowPreview(false);
      }
      
      // Check if we're on the editor page
      if (window.location.pathname === '/editor' || window.location.search.includes('editor=true')) {
        const editorDataStr = sessionStorage.getItem('editorData');
        if (editorDataStr) {
          try {
            setEditorData(JSON.parse(editorDataStr));
          } catch (error) {
            console.error('Error parsing editor data:', error);
          }
        }
      } else {
        setEditorData(null);
      }
      
      // Check if we're on the chart viewer page
      if (window.location.search.includes('charts=true')) {
        const chartViewerDataStr = sessionStorage.getItem('chartViewerData');
        if (chartViewerDataStr) {
          try {
            setChartViewerData(JSON.parse(chartViewerDataStr));
          } catch (error) {
            console.error('Error parsing chart viewer data:', error);
          }
        }
      } else {
        setChartViewerData(null);
      }
    };

    // Check route on mount
    checkRoute();

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', checkRoute);

    return () => {
      window.removeEventListener('popstate', checkRoute);
    };
  }, []);

  // If preview is requested, show full-screen preview
  if (showPreview) {
    return (
      <FullScreenSheetPreview
        onClose={() => {
          window.history.pushState({}, '', '/');
          setShowPreview(false);
          // Trigger popstate to update route
          window.dispatchEvent(new PopStateEvent('popstate'));
        }}
      />
    );
  }

  // If chart viewer data is loaded, show only the chart viewer
  if (chartViewerData) {
    return (
      <ChartViewer
        charts={chartViewerData.charts}
        onClose={() => {
          if (window.opener) {
            window.close();
          } else {
            window.location.href = '/';
          }
        }}
      />
    );
  }

  // If editor data is loaded, show only the editor
  if (editorData) {
    return (
      <InteractiveSheetEditor
        data={editorData.data}
        columns={editorData.columns}
        onClose={() => {
          window.history.back();
        }}
        onSave={(editedData) => {
          sessionStorage.setItem('editorData', JSON.stringify({
            data: editedData,
            columns: editorData.columns
          }));
          alert("Changes saved!");
        }}
      />
    );
  }

  // Otherwise show the main app
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <PromptToolSection />
        <FeaturesSection />
        <DashboardPreviewSection />
        {/* Product Hunt Badge */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto flex justify-center">
            <a 
              href="https://www.producthunt.com/products/easyexcel?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-easyexcel" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <img 
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1044628&theme=light&t=1764598786487" 
                alt="EasyExcel - Clean sheets and build dashboards with one click | Product Hunt" 
                style={{ width: "250px", height: "54px" }} 
                width="250" 
                height="54" 
              />
            </a>
          </div>
        </section>
        <PricingSection />
        <TokenDashboard />
        <FeedbackSection />
      </main>
      <Footer />
    </div>
  );
}
