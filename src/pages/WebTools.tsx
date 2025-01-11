import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { WebMetricsD3 } from "@/components/visualizations/WebMetricsD3";
import { WebMetricsHighcharts } from "@/components/visualizations/WebMetricsHighcharts";
import { WebMetricsP5 } from "@/components/visualizations/WebMetricsP5";

interface MetricResult {
  metric: string;
  value: string;
}

const WebTools = () => {
  const [results, setResults] = useState<MetricResult[]>([]);

  useEffect(() => {
    // Simulated data - replace with actual API call if needed
    const sampleData = [
      { metric: "Load Time", value: "2.5s" },
      { metric: "First Contentful Paint", value: "1.8s" },
      { metric: "Time to Interactive", value: "3.2s" },
      { metric: "SSL Certificate", value: "Present" },
      { metric: "Mobile Friendly", value: "Yes" },
      { metric: "SEO Score", value: "92" },
      { metric: "Performance Score", value: "88" },
      { metric: "Accessibility Score", value: "95" },
      { metric: "HTTPS", value: "Present" },
      { metric: "Responsive Design", value: "Yes" }
    ];
    setResults(sampleData);
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Web Tools Analysis</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Raw Results</h2>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="font-medium">{result.metric}:</span>
                <span className="text-primary">{result.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <WebMetricsHighcharts data={results} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WebMetricsD3 data={results} />
        <WebMetricsP5 data={results} />
      </div>
    </div>
  );
};

export default WebTools;