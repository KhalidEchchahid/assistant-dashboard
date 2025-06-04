"use client"
import { Copy, Code } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

interface EmbedCodeSectionProps {
  websiteId: string
}

export function EmbedCodeSection({ websiteId }: EmbedCodeSectionProps) {
  const { toast } = useToast()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const javascriptCode = `<!-- AI Assistant Chat Widget -->
<div id="ai-assistant-chat"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${apiUrl}/widget.js';
    script.setAttribute('data-website-id', '${websiteId}');
    script.setAttribute('data-api-url', '${apiUrl}');
    document.head.appendChild(script);
  })();
</script>`

  const reactCode = `import { AIChatWidget } from '@ai-assistant/react';

function App() {
  return (
    <div>
      {/* Your app content */}
      <AIChatWidget 
        websiteId="${websiteId}"
        apiUrl="${apiUrl}"
        theme="light" // or "dark"
        position="bottom-right"
      />
    </div>
  );
}`

  const iframeCode = `<iframe 
  src="${apiUrl}/chat/${websiteId}" 
  width="400" 
  height="600" 
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
</iframe>`

  const apiCode = `// Query your AI assistant programmatically
const response = await fetch('${apiUrl}/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-api-key'
  },
  body: JSON.stringify({
    website_id: ${websiteId},
    query: "What are your business hours?",
    context: {} // Optional context
  })
});

const data = await response.json();
console.log(data.answer);`

  const handleCopy = (code: string, type: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Code copied",
      description: `${type} code has been copied to your clipboard.`,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Embed Code
          </CardTitle>
          <CardDescription>Choose how you want to integrate the AI assistant into your website.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="javascript" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="react">React</TabsTrigger>
              <TabsTrigger value="iframe">iFrame</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>

            <TabsContent value="javascript" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">JavaScript Widget</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add this code to your website's HTML to embed a chat widget.
                </p>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{javascriptCode}</code>
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopy(javascriptCode, "JavaScript")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="react" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">React Component</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Use our React component for seamless integration with React applications.
                </p>
                <div className="mb-4">
                  <code className="bg-muted px-2 py-1 rounded text-sm">npm install @ai-assistant/react</code>
                </div>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{reactCode}</code>
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopy(reactCode, "React")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="iframe" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">iFrame Embed</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Embed the chat interface as an iframe for simple integration.
                </p>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{iframeCode}</code>
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopy(iframeCode, "iFrame")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="api" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">API Integration</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Query the AI assistant programmatically using our REST API.
                </p>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{apiCode}</code>
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopy(apiCode, "API")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customization Options</CardTitle>
          <CardDescription>Customize the appearance and behavior of your AI assistant.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Theme Options</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Light and dark themes</li>
                <li>• Custom color schemes</li>
                <li>• Brand logo integration</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Position & Size</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Bottom-right, bottom-left positioning</li>
                <li>• Customizable widget size</li>
                <li>• Mobile-responsive design</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
