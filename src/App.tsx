import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AccessibilityBar } from "@/components/AccessibilityBar";
import { VLibrasButton } from "@/components/VLibrasButton";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { AudiodescriptionController } from "@/components/AudiodescriptionController";
import StudentContents from "./pages/student/Contents";
import StudentPerformance from "./pages/student/Performance";
import StudentMessages from "./pages/student/Messages";
import TeacherClasses from "./pages/teacher/Classes";
import TeacherContents from "./pages/teacher/Contents";
import TeacherActivities from "./pages/teacher/Activities";
import TodosPage from "./pages/Todos";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AccessibilityBar />
      <AudiodescriptionController />
      <VLibrasButton />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/todos" element={<TodosPage />} />
          {/* Student routes */}
          <Route path="/student/contents" element={<StudentContents />} />
          <Route path="/student/performance" element={<StudentPerformance />} />
          <Route path="/student/messages" element={<StudentMessages />} />
          {/* Teacher routes */}
          <Route path="/teacher/classes" element={<TeacherClasses />} />
          <Route path="/teacher/contents" element={<TeacherContents />} />
          <Route path="/teacher/activities" element={<TeacherActivities />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
