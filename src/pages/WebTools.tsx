import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WebMetricsD3 } from "@/components/visualizations/WebMetricsD3";
import { WebMetricsHighcharts } from "@/components/visualizations/WebMetricsHighcharts";
import { WebMetricsP5 } from "@/components/visualizations/WebMetricsP5";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { AppSidebar } from "@/components/AppSidebar";
import { supabase } from "@/integrations/supabase/client";

interface MetricResult {
  metric: string;
  value: string;
}

interface ConsoleLog {
  timestamp: string;
  message: string;
}

const WebTools = () => {
  const [url, setUrl] = useState("https://pwaburton.co.uk");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<MetricResult[]>([
    { metric: "Page Load Time", value: "0.59s" },
    { metric: "Page Size", value: "0.89 KB" },
    { metric: "Images Count", value: "0" },
    { metric: "Mobile Viewport", value: "Present" },
    { metric: "Meta Description", value: "Present" },
    { metric: "Favicon", value: "Missing" },
    { metric: "H1 Tag", value: "Missing" },
    { metric: "Canonical Tag", value: "Missing" },
    { metric: "HTTPS", value: "Yes" },
    { metric: "Robots.txt", value: "Missing" },
    { metric: "Sitemap", value: "Missing" },
    { metric: "Schema Markup", value: "Missing" },
    { metric: "Open Graph Tags", value: "Present" },
    { metric: "Twitter Cards", value: "Missing" },
    { metric: "Image Alt Tags", value: "Present" },
    { metric: "HTML Lang Attribute", value: "Present" },
    { metric: "Structured Data", value: "Missing" },
    { metric: "AMP Version", value: "Missing" },
    { metric: "Web App Manifest", value: "Missing" }
  ]);

  const [logs, setLogs] = useState<ConsoleLog[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to real-time updates for website analysis
    const channel = supabase
      .channel('analysis-updates')
      .on('broadcast', { event: 'analysis-log' }, ({ payload }) => {
        setLogs(currentLogs => [...currentLogs, {
          timestamp: new Date().toLocaleTimeString(),
          message: payload.message
        }]);
      })
      .on('broadcast', { event: 'analysis-result' }, ({ payload }) => {
        setResults(payload.results);
        setAnalyzing(false);
        toast({
          title: "Analysis Updated",
          description: "Website analysis results have been updated"
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const analyzeWebsite = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    setAnalyzing(true);
    setLogs([{
      timestamp: new Date().toLocaleTimeString(),
      message: `Starting analysis of ${url}`
    }]);

    // Broadcast the analysis request
    await supabase.channel('analysis-updates').send({
      type: 'broadcast',
      event: 'start-analysis',
      payload: { url }
    });
  };

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 container mx-auto p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">Web Development Tools</h1>
        
        <Card className="p-6 mb-6">
          <div className="flex gap-4 items-center">
            <Input 
              placeholder="Enter website URL" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={analyzeWebsite}
              disabled={analyzing}
            >
              {analyzing ? "Analyzing..." : "Analyze Website"}
            </Button>
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Analysis Status</h2>
            <p className={analyzing ? "text-yellow-500" : "text-green-500"}>
              {analyzing ? "Analysis in progress..." : "Analysis completed successfully"}
            </p>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Console Logs</h2>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              {logs.map((log, index) => (
                <div key={index} className="mb-2">
                  <span className="text-muted-foreground">[{log.timestamp}]</span>{" "}
                  {log.message}
                </div>
              ))}
            </ScrollArea>
          </Card>

          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Website Analysis Report</h2>
            <ScrollArea className="h-[200px] w-full rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Metric</th>
                    <th className="text-left p-2">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{result.metric}</td>
                      <td className="p-2">
                        <span className={
                          result.value === "Missing" ? "text-destructive" : 
                          (result.value === "Present" || result.value === "Yes") ? "text-green-500" : ""
                        }>
                          {result.value}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WebMetricsD3 data={results} />
          <WebMetricsHighcharts data={results} />
        </div>

        <div className="mt-6">
          <WebMetricsP5 data={results} />
        </div>
      </div>
    </div>
  );
};

export default WebTools;