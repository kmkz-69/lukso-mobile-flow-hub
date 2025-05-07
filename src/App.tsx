
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ChatDetail from "./pages/ChatDetail";
import NotFound from "./pages/NotFound";
import { ProfileProvider } from "./context/ProfileContext";
import { DealProvider } from "./context/DealContext";
import { ChatProvider } from "./context/ChatContext";
import { UpProvider } from "./context/upProvider";

const queryClient = new QueryClient();

const App = () => (
  <UpProvider>
    <QueryClientProvider client={queryClient}>
      <ProfileProvider>
        <DealProvider>
          <ChatProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/chat/:id" element={<ChatDetail />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </ChatProvider>
        </DealProvider>
      </ProfileProvider>
    </QueryClientProvider>
  </UpProvider>
);

export default App;
